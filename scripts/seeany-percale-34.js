/**
 * seeany-percale-34.js — Percale 前两个产品（Coconut / Sky）3:4 场景图（2026-10-19 用户定）
 * 做法：以线上 PDP 主图（products/PERCALE-<COLOR>-QUEEN/1.webp）为基准 img2img 扩图成 3:4 竖版，
 *   床品、褶皱、搭毯、道具等床上一切细节零改动，仅向上下延展场景（上方墙面/挂画/床头，下方地毯/床尾凳）。
 * 输出：staging/percale-<key>-3x4.png（确认后再决定是否替换，不覆盖正式图）
 * 规则：两色任务先全部并行提交，再统一轮询（同步生成，等待时间不随张数增加）
 * 用法: node scripts/seeany-percale-34.js [颜色key ...]
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
const PRODUCTS = path.join(__dirname, '..', 'public', 'images', 'products');

const JOBS = {
  coconut: { zh: '椰奶白' },
  sky: { zh: '天空蓝' },
};

const filters = process.argv.slice(2);
const jobs = Object.entries(JOBS).filter(([k]) => !filters.length || filters.includes(k));
if (!jobs.length) { console.error('无匹配颜色'); process.exit(1); }

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
  // 第一步：全部任务并行提交
  const pending = [];
  for (const [key, v] of jobs) {
    const src = path.join(PRODUCTS, `PERCALE-${key.toUpperCase()}-QUEEN`, '1.webp');
    const dest = path.join(STAGING, `percale-${key}-3x4.png`);
    if (!fs.existsSync(src)) { console.error(`缺基准图: ${src}`); process.exit(1); }
    if (fs.existsSync(dest)) { console.log(`跳过已存在: ${dest}`); continue; }
    const ref = await localRefDataUri(src);
    const prompt =
      '以这张参考图为绝对基准做竖版扩图（outpainting），输出 3:4 竖构图：' +
      '参考图的全部内容——暖调奶油风卧室、床架床头板、床上三件套床品（' + v.zh + '）、' +
      '被套和枕套的每一处褶皱走向、搭毯的颜色材质和摆放位置、床头柜、台灯、杂志、咖啡杯、绿植、地毯——' +
      '全部 1:1 零改动保留在原位置，产品和床上摆放物的任何细节都不允许改变；' +
      '仅沿竖直方向延展画面：上方补出更多墙面、挂画和床头板上沿，下方补出更多床尾凳、地毯和地板，' +
      '延展部分的光线方向、色温、透视、景深与原图完全衔接，无拼接感。' +
      '写实摄影质感，画面无文字、无水印、无logo、无人。';
    const uuid = await createTask(prompt, [ref]);
    console.log(`已提交: ${key} ${v.zh} 3:4 扩图, task_uuid=${uuid}`);
    pending.push({ key, uuid, dest });
  }
  // 第二步：统一轮询下载
  for (const { key, uuid, dest } of pending) {
    console.log(`等待生成: ${key} [${uuid.slice(0, 8)}]`);
    const imgUrl = await pollTask(uuid);
    const res = await fetchRetry(imgUrl, undefined, '结果图下载');
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
