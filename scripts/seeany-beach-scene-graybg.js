/**
 * seeany-beach-scene-graybg.js — 沙滩巾躺椅场景图换灰底（2026-10-16 用户定）
 * 4 款配色的躺椅场景图（staging/beach-towel-<color>-main.png）：画面内容 1:1 不变
 * （躺椅、两条毛巾、构图、配色、毛圈质感、光影），纯白背景换成站点统一的
 * 浅灰棚拍背景（约 #e5e5e5，对齐颈枕 B0BZCMDZNS 灰底标准）。灰底版将作为 PDP 第 2 张图。
 * 输出：public/images/staging/beach-towel-<color>-scene-grey-1x1.png
 * 用法: node scripts/seeany-beach-scene-graybg.js [颜色过滤词 ...]（不传 = 全部 4 个）
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'staging');

const COLORS = {
  pinkwhite: '粉白相间（灰粉 dusty rose + 奶白 cream）',
  greywhite: '浅灰奶白相间（light grey + warm cream white）',
  sagewhite: '鼠尾草绿奶白相间（sage green + warm cream white）',
  dustyblue: '灰蓝奶白相间（dusty blue + warm cream white）',
};

const filters = process.argv.slice(2);
const jobs = Object.entries(COLORS).filter(([k]) => !filters.length || filters.includes(k));
if (!jobs.length) { console.error('无匹配颜色'); process.exit(1); }

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt, inputImgs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '1:1',
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
  for (const [color, desc] of jobs) {
    const src = path.join(OUT, `beach-towel-${color}-main.png`);
    if (!fs.existsSync(src)) { console.error(`跳过 ${color}：找不到 ${src}`); continue; }
    const dest = path.join(OUT, `beach-towel-${color}-scene-grey-1x1.png`);
    const prompt =
      `以这张参考图为绝对基准：两条${desc}条纹沙滩巾搭在木质躺椅上的电商场景图，` +
      '毛巾、躺椅、构图、光影、条纹宽度与排列、棉质毛圈质感、褶皱细节全部 1:1 零改动。' +
      '唯一改动：背景——把纯白背景替换为浅灰色纯色摄影棚背景（light gray seamless studio background，色值约 #e5e5e5），' +
      '背景均匀干净，柔和均匀的棚拍光线，躺椅与毛巾在灰色背景上的接触阴影保持自然。' +
      '写实摄影质感，画面无文字、无水印、无logo、无人。';
    console.log(`创建任务: ${color} 灰底场景图（1:1）`);
    const uuid = await createTask(prompt, [await localRefDataUri(src)]);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
