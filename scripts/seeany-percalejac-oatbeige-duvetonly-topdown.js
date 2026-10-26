/**
 * seeany-percalejac-oatbeige-duvetonly-topdown.js — 单独被套主图试做·俯视对折平铺（2026-10-23 用户定）
 * 背景：裸床平铺方向与套装图拉不开区别，改为——被套平铺对折两次、正上方俯拍、灰色底。
 * 参考图 1（结构/角度锚）：KNITTHROW-CREAM/1.webp —— 正俯视平铺构图、浅灰纯色底、柔和单侧投影、
 *   产品竖向占画面主体，全部 1:1 复刻。
 * 参考图 2（布料锚）：PERCALEJAC-OATBEIGE-QUEEN/1-3x4.webp —— 仅取燕麦米白条纹提花布料配色与织纹。
 * 注意（用户强调）：花纹纹路要真实——俯视平铺状态下条纹平直、连续、无扭曲。
 * 输出：public/images/staging/percalejac-oatbeige-duvetonly-topdown-34.png
 * 用法: node scripts/seeany-percalejac-oatbeige-duvetonly-topdown.js
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
const REF_STRUCTURE = path.join(ROOT, 'public', 'images', 'products', 'KNITTHROW-CREAM', '1.webp'); // 俯视角度+灰底基准
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-OATBEIGE-QUEEN', '1-3x4.webp'); // 布料配色来源
const REF_DETAIL = path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-OATBEIGE-QUEEN', '3.webp'); // 织纹特写：华夫格肌理 + 条纹宽度比基准

const prompt =
  '以第一张参考图为绝对基准：正上方俯视平铺构图、浅灰色纯色背景、柔和单侧投影、产品竖向居中占画面主体，' +
  '全部 1:1 复刻；唯一区别是产品形态——把针织毯换成一条 duvet cover（被套）：被套平铺后对折两次' +
  '（先横向对折、再纵向对折，折成规整的矩形四分之一大小），平整摆放，边角整齐，可见自然的折叠层叠厚度与边缘缝线。' +
  '被套布料严格取自第二张、第三张参考图：燕麦米色（oat beige）与奶白色（cream white）相间的竖向条纹' +
  '提花棉质面料，华夫格编织肌理与柔和哑光质感以第三张特写图为准。' +
  '条纹宽度比例（关键，以上版生成错误须修正）：奶白色条纹明显宽于燕麦米色条纹，' +
  '奶白:燕麦 ≈ 4:3，条纹宽度、配色与排列与第二张、第三张参考图 1:1 对应，不得加宽米色条纹。' +
  '关键要求：俯视平铺状态下条纹必须平直、连续、间距均匀，折叠处条纹走向转折自然真实，无扭曲、无断裂、无重影；' +
  '第二张参考图仅作布料来源，严禁沿用其卧室场景与任何陈设。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人、无道具。';

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
      mode: 'gpt-image-2.5-sunburst', size: '2K',
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
  const dest = path.join(OUT, 'percalejac-oatbeige-duvetonly-topdown-34-v2.png');
  console.log('创建任务: Oat Beige 单独被套 俯视对折平铺灰底图（KNITTHROW 角度 + PERCALEJAC 布料）');
  const uuid = await createTask([await dataUri(REF_STRUCTURE), await dataUri(REF_FABRIC), await dataUri(REF_DETAIL)]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
