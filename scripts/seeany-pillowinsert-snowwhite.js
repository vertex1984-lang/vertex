/**
 * seeany-pillowinsert-snowwhite.js — B0CQC6H9MZ 枕芯棚拍图灰底换 Snow White 底（2026-10-17 用户定）
 * 以 studio-main.webp（两只叠放白色枕芯 + 冷灰棚拍底）为参考：枕芯主体 1:1 零改动，
 * 背景换成 PANTONE 11-0602 TCX Snow White（约 #F2F0EB），保留自然接触阴影。
 * 原图不动，结果先出到 staging 供确认。
 * 输出：public/images/staging/pillow-insert-b0cqc6h9mz-snowwhite-1x1.png
 * 用法: node scripts/seeany-pillowinsert-snowwhite.js
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
const SRC = path.join(__dirname, '..', 'public', 'images', 'products', 'B0CQC6H9MZ', 'studio-main.webp');
const DEST = path.join(__dirname, '..', 'public', 'images', 'staging', 'pillow-insert-b0cqc6h9mz-snowwhite-1x1.png');

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
  if (!fs.existsSync(SRC)) { console.error(`找不到 ${SRC}`); process.exit(1); }
  // 已创建未消费的任务（避免重复扣费，同 seeany-gen.js 的 EXISTING 机制）
  const EXISTING = 'w012a3b990d9dca88db338167';
  const prompt =
    '以这张参考图为绝对基准：画面中两只叠放的白色方形抱枕芯，枕芯的叠放方式、位置、角度、大小、' +
    '纯白布面质感、蓬松度、褶皱细节全部 1:1 零改动，画面中只能有这两只枕芯，不得增加或减少物体。' +
    '唯一改动：背景——把冷调浅灰背景替换为 PANTONE 11-0602 TCX Snow White 纯色摄影棚背景' +
    '（snow white with a hint of warm gray seamless studio background，色值约 #F2F0EB，接近纯白但带一丝暖灰调），' +
    '背景均匀干净，柔和均匀的棚拍光线，枕芯底部保留自然柔和的接触阴影，阴影落在 Snow White 背景上。' +
    '写实摄影质感，画面无文字、无水印、无logo、无人。';
  console.log('创建任务: B0CQC6H9MZ 枕芯 Snow White 底棚拍图（1:1）');
  const uuid = EXISTING || await createTask(prompt, [await localRefDataUri(SRC)]);
  console.log(`  task_uuid=${uuid}${EXISTING ? '（复用）' : ''}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.writeFileSync(DEST, buf);
  console.log(`  已保存 ${DEST} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
