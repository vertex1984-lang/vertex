/**
 * seeany-duvset-soften.js — DUVSET Pink/White 主图降对比改色（2026-10-17 用户定）
 * 卡片上 Pink 太艳、White 太亮：以两色的 Queen 主图（卧室场景）为基准，场景/构图/褶皱 1:1 不动，
 * 唯一改动 = 被套+枕套面料色：Pink → 裸粉 #E3C2BB；White → 奶白 #F2EDE4。
 * 原图不动，结果先出到 staging 供确认。
 * 输出：public/images/staging/duvset-<pink|white>-queen-soft-1x1.png
 * 用法: node scripts/seeany-duvset-soften.js [pink|white]（不传 = 两个都跑）
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
const PRODUCTS = path.join(__dirname, '..', 'public', 'images', 'products');
const OUT = path.join(__dirname, '..', 'public', 'images', 'staging');

const JOBS = {
  pink: {
    src: path.join(PRODUCTS, 'DUVSET-PINK-QUEEN', '1.webp'),
    from: '亮粉色（bright pink）',
    to: '裸粉（muted dusty pink，低饱和灰调粉，色值约 #E3C2BB）',
  },
  white: {
    src: path.join(PRODUCTS, 'DUVSET-WHITE-QUEEN', '1.webp'),
    from: '纯白色（bright white）',
    to: '奶白（soft ivory warm white，低对比暖调白，色值约 #F2EDE4）',
  },
};

const filters = process.argv.slice(2);
const jobs = Object.entries(JOBS).filter(([k]) => !filters.length || filters.includes(k));
if (!jobs.length) { console.error('无匹配任务'); process.exit(1); }

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
  for (let i = 0; i < 120; i++) {
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
  for (const [key, job] of jobs) {
    if (!fs.existsSync(job.src)) { console.error(`跳过 ${key}：找不到 ${job.src}`); continue; }
    const dest = path.join(OUT, `duvset-${key}-queen-soft-1x1.png`);
    const prompt =
      `以这张参考图为绝对基准：暖调卧室场景，床上一套${job.from}被套+枕套床品。` +
      '房间场景、床头板、床头柜、台灯、绿植、挂画、地毯、窗户光线、构图视角、床品的铺放方式与褶皱细节全部 1:1 零改动。' +
      `唯一改动：被套和两个枕套的面料颜色从${job.from}改为${job.to}，` +
      '柔和低饱和的温暖治愈系色调，哑光磨毛棉质感，颜色均匀覆盖整件套，保留原有的光影明暗与褶皱层次。' +
      '写实摄影质感，画面无文字、无水印、无logo、无人。';
    console.log(`创建任务: ${key} 降对比改色（1:1）`);
    const uuid = await createTask(prompt, [await localRefDataUri(job.src)]);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
