/**
 * seeany-linen3-sage-duvet-34.js — LINEN3-SAGE-DUVET 灰底主图 3:4 竖版（2026-10-19 用户定）
 * 做法：以线上 PDP 主图（products/LINEN3-SAGE-DUVET/1.webp）为基准 img2img 扩成 3:4，
 *   叠放的被套本体（颜色/褶皱/翻折/纹理/光影）零改动，仅延展纯色灰底；
 *   产品在画面中水平居中、垂直方向居中稍微靠下（顶部灰底留白多于底部）。
 * 输出：staging/linen3-sage-duvet-3x4.png（确认后再替换正式图）
 * 用法: node scripts/seeany-linen3-sage-duvet-34.js
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
const STAGING = path.join(__dirname, '..', 'public', 'images', 'staging');
const SRC = path.join(__dirname, '..', 'public', 'images', 'products', 'LINEN3-SAGE-DUVET', '1.webp');
const DEST = path.join(STAGING, 'linen3-sage-duvet-3x4.png');

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function fetchRetry(url, opts, label = 'fetch') {
  for (let t = 0; t < 8; t++) {
    try { return await fetch(url, opts); }
    catch (e) { console.log(`  ${label} 网络重试 ${t + 1}/8`); await new Promise((r) => setTimeout(r, 8000)); }
  }
  throw new Error(`${label} 网络持续失败`);
}

async function createTask(prompt, inputImgs) {
  const res = await fetchRetry(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '3:4',
      mode: 'gpt-image-2.5-sunburst', size: '2K',
    }),
  }, '创建任务');
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 120; i++) {
    const res = await fetchRetry(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } }, '轮询');
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
  if (fs.existsSync(DEST)) { console.log(`已存在跳过: ${DEST}`); return; }
  const ref = await localRefDataUri(SRC);
  const prompt =
    '以这张参考图为绝对基准做竖版扩图（outpainting），输出 3:4 竖构图的电商灰底产品图：' +
    '参考图中的产品——鼠尾草灰绿色水洗亚麻被套，整齐叠放成三层的造型、表面的亚麻纹理、每一处褶皱和翻折、顶部掀开的一角、明暗光影——' +
    '全部 1:1 零改动保留，产品的任何细节都不允许改变；' +
    '背景保持完全相同的浅灰色纯色摄影棚背景（含产品底部淡淡的接触阴影），向四周自然延展，无渐变、无杂物；' +
    '构图：产品在画面中水平居中，垂直方向居中稍微靠下——产品位于画面中轴线偏下位置（约画面高度的 55%-60% 处），' +
    '顶部灰色留白明显多于底部，整体是专业的电商产品棚拍构图。' +
    '写实摄影质感，画面无文字、无水印、无logo、无人。';
  const uuid = await createTask(prompt, [ref]);
  console.log(`已提交: linen3-sage-duvet 3:4 灰底扩图, task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetchRetry(imgUrl, undefined, '结果图下载');
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(DEST, buf);
  console.log(`已保存 ${DEST} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
