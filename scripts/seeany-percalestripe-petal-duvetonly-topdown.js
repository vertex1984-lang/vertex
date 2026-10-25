/**
 * seeany-percalestripe-petal-duvetonly-topdown.js — petal 被套·俯视折叠展示图（2026-10-23 用户定）
 * 参考图 1（结构/角度锚）：JACTHROW-HB-BLACK-150X200/1.webp —— 正上方俯拍、折叠成规整矩形、
 *   浅灰纯色底、柔和单侧投影、产品竖向占画面主体，全部 1:1 复刻。
 * 参考图 2（布料锚）：PERCALESTRIPE-PETAL-QUEEN/1-3x4.webp —— 仅取粉白细条纹提花布料配色与织纹。
 * 输出：public/images/staging/percalestripe-petal-duvetonly-topdown-34.png
 * 用法: node scripts/seeany-percalestripe-petal-duvetonly-topdown.js
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
const REF_STRUCTURE = path.join(ROOT, 'public', 'images', 'products', 'JACTHROW-HB-BLACK-150X200', '1.webp'); // 俯视折叠+灰底基准
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'products', 'PERCALESTRIPE-PETAL-QUEEN', '1-3x4.webp'); // 布料配色来源

const prompt =
  '以第一张参考图为绝对基准：正上方垂直俯拍构图、浅灰色纯色背景、柔和单侧投影、产品竖向居中占画面主体，' +
  '全部 1:1 复刻；唯一区别是产品形态——把针织毯换成一条 duvet cover（被套）：被套平铺后对折两次' +
  '（先横向对折、再纵向对折，折成规整的矩形），平整摆放，边角整齐，可见自然的折叠层叠厚度与边缘缝线。' +
  '被套布料严格取自第二张参考图： blush pink（淡灰粉）与白色相间的细密竖条纹提花棉质面料，' +
  '哑光细腻质感；条纹宽度比例、配色密度与排列与第二张参考图 1:1 对应，不得加宽或改变条纹。' +
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
  const dest = path.join(OUT, 'percalestripe-petal-duvetonly-topdown-34.png');
  console.log('创建任务: Petal 被套 俯视折叠灰底展示图（JACTHROW 角度 + PERCALESTRIPE-PETAL 布料）');
  const uuid = await createTask([await dataUri(REF_STRUCTURE), await dataUri(REF_FABRIC)]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
