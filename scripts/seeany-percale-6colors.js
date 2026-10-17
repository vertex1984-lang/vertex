/**
 * seeany-percale-6colors.js — Cotton Percale 三件套 6 色主图（2026-10-17 用户定）
 * 基准图 = staging/percale-sky-1x1.png（天空蓝，六段式文生图 + 用户确认的床尾机位构图；
 * 质感取用户确认的软质自然版 percale-sky-1x1-soft-backup.png，挺括修正版已弃用）。
 * 其余 5 色以基准图 img2img 换色：房间场景、机位构图、物品、光影、布料质感 1:1 零改动，
 * 唯一改动 = 被套 + 两个枕套的颜色（同 seeany-duvset-4colors.js 口径）。
 * 输出：public/images/staging/percale-<key>-1x1.png（1:1 主图，卡片/PDP 共用）
 * 用法: node scripts/seeany-percale-6colors.js [颜色key ...]（不传 = 全部 6 色；已存在自动跳过）
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
const SRC = path.join(STAGING, 'percale-sky-1x1.png');

const COLORS = {
  sky:      { zh: '天空蓝',   en: 'soft muted sky blue',              hex: '#B8C8D2' },
  mist:     { zh: '晨雾灰',   en: 'light warm mist grey',             hex: '#C6C7C2' },
  coconut:  { zh: '椰奶白',   en: 'warm coconut milk off-white',      hex: '#EDE7DB' },
  nude:     { zh: '裸粉',     en: 'muted nude apricot pink',          hex: '#E0C9BF' },
  euca:     { zh: '桉叶绿',   en: 'muted eucalyptus sage green',      hex: '#B4BDAC' },
  lavender: { zh: '雾紫',     en: 'muted lavender fog grey-purple',   hex: '#C5BDC8' },
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
      mode: 'gpt-image-2.5-sunburst', size: '2K',
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
  if (!fs.existsSync(SRC)) { console.error(`找不到基准图 ${SRC}`); process.exit(1); }
  const ref = await localRefDataUri(SRC);
  for (const [key, c] of jobs) {
    const dest = path.join(STAGING, `percale-${key}-1x1.png`);
    if (fs.existsSync(dest)) { console.log(`跳过已存在: ${dest}`); continue; }
    const prompt =
      '以这张参考图为绝对基准：暖调奶油风卧室，床上一套被套+两个枕套的三件套床品。' +
      '房间场景、机位构图、床头板、床尾长凳、床头柜、台灯、绿植、挂画、地毯、窗户光线、' +
      '床品的铺放方式、褶皱细节与布料质感全部 1:1 零改动。' +
      `唯一改动：被套和两个枕套的面料颜色改为${c.zh}（${c.en}，色值约 ${c.hex}，` +
      '柔和低饱和色调），三件套同一颜色均匀覆盖，保留原有的光影明暗与褶皱层次。' +
      '写实摄影质感，画面无文字、无水印、无logo、无人。';
    console.log(`创建任务: ${key} ${c.zh}（1:1, sunburst 2K）`);
    const uuid = await createTask(prompt, [ref]);
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
