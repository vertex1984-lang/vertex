/**
 * seeany-percalejac-oatbeige-stacked.js — PERCALEJAC-OATBEIGE-QUEEN 叠放棚拍图试做（2026-10-23 用户定）
 * 目标：为 cotton percale 提花四件套（燕麦色）生成 LINEN3-SAGE-DUVET/1-3x4.webp 同款式的
 *       折叠叠放棚拍图（浅灰纯色背景、床品叠成一摞、仅产品无场景），只生成 Oat Beige 一个颜色。
 * 参考图 1（结构锚）：LINEN3-SAGE-DUVET/1-3x4.webp —— 叠放方式、折叠结构、角度、占比、光影、灰底 1:1
 * 参考图 2（布料锚）：PERCALEJAC-OATBEIGE-QUEEN/1-3x4.webp —— 仅取布料配色与提花织纹
 * 输出：public/images/staging/percalejac-oatbeige-stacked-34.png（确认后再进产品目录）
 * 用法: node scripts/seeany-percalejac-oatbeige-stacked.js
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  for (const p of [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '.env.local'),
    'E:\\Makimoo Website\\headless-store\\.env.local',
    'E:\\Makimoo Website\\headless-store\\.env',
  ]) {
    try {
      const env = fs.readFileSync(p, 'utf-8');
      const m = env.match(/^SEEANY_API_KEY=(.+)$/m);
      if (m) return m[1].trim();
    } catch {}
  }
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_STRUCTURE = path.join(ROOT, 'public', 'images', 'products', 'LINEN3-SAGE-DUVET', '1-3x4.webp'); // 结构基准
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-OATBEIGE-QUEEN', '1-3x4.webp'); // 布料配色来源

const prompt =
  '以第一张参考图为绝对基准：一摞折叠床品的棚拍构图——叠放方式、折叠结构、枕套搭在被套上的摆放、' +
  '拍摄角度、产品占画面比例、柔和光影、浅灰色纯色摄影棚背景全部 1:1 复刻。' +
  '唯一改动：布料——整套床品（被套、枕套）改成第二张参考图的布料：燕麦米色（oat beige）与奶白色相间的' +
  '竖向宽条纹提花棉质面料，条纹带细微编织肌理，颜色与条纹比例与第二张图 1:1 对应。' +
  '第二张参考图仅作为布料颜色与织纹来源，严禁沿用其卧室场景、陈设、褶皱形态与透视。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人、无场景道具。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(inputImgs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '3:4',
      mode: 'gpt-image-2.5', size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } });
    const data = await res.json();
    if (data.code !== 0) throw new Error(`查询失败: ${JSON.stringify(data)}`);
    const { status, progress, assets } = data.data;
    if (i % 6 === 0) console.log(`  [${uuid.slice(0, 8)}] ${status} ${progress ?? 0}%`);
    if (status === 'succeeded' || status === 'partial_failed') {
      const img = assets?.[0]?.images?.[0]?.url;
      if (!img) throw new Error(`无结果图: ${JSON.stringify(data.data).slice(0, 300)}`);
      return img;
    }
    if (status === 'failed') throw new Error(`任务失败: ${data.data.error_message || '未知原因'}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const dest = path.join(OUT, 'percalejac-oatbeige-stacked-34.png');
  console.log('创建任务: Oat Beige 提花四件套 叠放棚拍图（LINEN3-SAGE-DUVET 结构 + PERCALEJAC 布料）');
  const uuid = await createTask([await dataUri(REF_STRUCTURE), await dataUri(REF_FABRIC)]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
