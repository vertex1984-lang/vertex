/**
 * seeany-restack-embossed.js — B0GD846FS2 压花枕主图重生成（2026-10-18 用户定）
 * 以用户提供的压花枕主图（ref-embossed-pillow-main.png，两只立放、白底）为基准：
 * 面料压花纹理（细密篮子编纹）、纯白颜色、蓬松度 1:1 保留；
 * 仅改摆放为两个枕头平躺上下叠放（用户给的叠放参考图构图）+ 浅灰摄影棚背景。
 * 输出：staging/b0gd846fs2-main-restack-1x1.png（确认后替换正式主图，不直接覆盖）
 * 用法: node scripts/seeany-restack-embossed.js（已存在自动跳过，删除输出可重跑）
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
const REF = path.join(STAGING, 'ref-embossed-pillow-main.png');
const DEST = path.join(STAGING, 'b0gd846fs2-main-restack-1x1.png');

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
      inputImgs, imgNum: 1, imgRatio: '1:1',
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
  if (fs.existsSync(DEST)) { console.log(`跳过已存在: ${DEST}`); process.exit(0); }
  if (!fs.existsSync(REF)) { console.error(`缺参考图: ${REF}`); process.exit(1); }
  const ref = await localRefDataUri(REF);
  const prompt =
    '以这张参考图为绝对基准：两只白色压花枕头的面料必须 1:1 保留——细密的篮子编织压花纹理（embossed basket-weave texture）清晰完整、纯白颜色、饱满蓬松的枕型全部零改动。' +
    '仅做两处改动：' +
    '1) 摆放方式从直立改为平躺叠放：两个枕头完全平放、一上一下整齐叠在一起，上面的枕头居中略偏上，正面微俯视角（约15度俯视），能看到枕头上表面和侧边厚度；' +
    '2) 背景从纯白改为浅灰色纯色摄影棚背景（柔和均匀棚拍光线，枕头底部有轻微自然的接触阴影）。' +
    '压花纹理在两个枕头上都要清晰可见，平放后纹理随枕面弧度自然起伏。' +
    '写实摄影质感，画面无文字、无水印、无logo、无人。';
  console.log('创建任务: B0GD846FS2 压花枕平叠主图（1:1, sunburst 2K）');
  const uuid = await createTask(prompt, [ref]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetchRetry(imgUrl, undefined, '结果图下载');
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(DEST, buf);
  console.log(`  已保存 ${DEST} (${buf.length} bytes)`);
  console.log('完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
