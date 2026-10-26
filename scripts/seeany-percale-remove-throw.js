/**
 * seeany-percale-remove-throw.js — Percale 5 色主图去床尾盖毯（2026-10-20 用户定）
 * 基准图 = staging/percale-<color>-v2-1x1.png（当前线上主图源），
 * img2img 唯一改动 = 去掉床尾搭的针织/编织盖毯，被面自然延续；其余 1:1 零改动。
 * 1:1 主图 5 色全做；3:4 PDP 竖版仅 sky/mist/coconut/nude 四色有（lavender 无 3:4），
 * 基准 = public/images/products/PERCALE-<C>-QUEEN/1-3x4.webp（4 尺寸同图）。
 * 输出：staging/percale-<color>-nothrow-1x1.png / -nothrow-3x4.png（确认后由 replace 脚本替换正式图）
 * 用法: node scripts/seeany-percale-remove-throw.js [颜色key ...]（不传 = 全部）
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
const STAGING = path.join(ROOT, 'public', 'images', 'staging');

const COLORS = {
  sky:      { zh: '天空蓝' },
  mist:     { zh: '晨雾灰' },
  coconut:  { zh: '椰奶白' },
  nude:     { zh: '裸粉' },
  lavender: { zh: '雾紫' },
};
const HAS_34 = ['sky', 'mist', 'coconut', 'nude'];

const filters = process.argv.slice(2);
const colorKeys = Object.keys(COLORS).filter((k) => !filters.length || filters.includes(k));
if (!colorKeys.length) { console.error('无匹配颜色'); process.exit(1); }

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt, inputImgs, imgRatio) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio,
      mode: 'gpt-image-2.5-sunburst', size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid, label) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 120; i++) {
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } });
    const data = await res.json();
    if (data.code !== 0) throw new Error(`查询失败: ${JSON.stringify(data)}`);
    const { status, progress, assets } = data.data;
    if (i % 6 === 0) console.log(`  [${label}] ${status} ${progress ?? 0}%`);
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

function promptFor(zh, ratio) {
  return (
    `以这张参考图为绝对基准：暖调奶油风卧室，床上一套${zh}被套+枕套三件套。` +
    '房间场景、机位构图、床头板、床尾长凳、床头柜、台灯、绿植、挂画、地毯、窗户光线、' +
    '床品的颜色与面料质感（纯棉 percale 平纹）全部 1:1 零改动。' +
    '唯一改动：去掉床尾搭着的那条针织盖毯（throw blanket），床上不再有任何毯子；' +
    '被面在盖毯原位置自然延续，布料褶皱、明暗光影与周围被套自然衔接，床面平整真实。' +
    '写实摄影质感，画面无文字、无水印、无logo、无人。' +
    (ratio === '3:4' ? '输出 3:4 竖版构图，与参考图构图一致。' : '')
  );
}

(async () => {
  // 先建全部任务（并行），再统一轮询下载
  const jobs = [];
  for (const key of colorKeys) {
    const src11 = path.join(STAGING, `percale-${key}-v2-1x1.png`);
    const dest11 = path.join(STAGING, `percale-${key}-nothrow-1x1.png`);
    if (!fs.existsSync(src11)) { console.error(`找不到 ${src11}，跳过`); continue; }
    if (!fs.existsSync(dest11)) {
      const ref = await localRefDataUri(src11);
      const uuid = await createTask(promptFor(COLORS[key].zh, '1:1'), [ref], '1:1');
      jobs.push({ uuid, dest: dest11, label: `${key}-1x1` });
      console.log(`创建任务 ${key}-1x1: ${uuid}`);
    } else {
      console.log(`已存在，跳过: ${dest11}`);
    }
    if (HAS_34.includes(key)) {
      const src34 = path.join(ROOT, 'public', 'images', 'products', `PERCALE-${key.toUpperCase()}-QUEEN`, '1-3x4.webp');
      const dest34 = path.join(STAGING, `percale-${key}-nothrow-3x4.png`);
      if (fs.existsSync(src34) && !fs.existsSync(dest34)) {
        const ref = await localRefDataUri(src34);
        const uuid = await createTask(promptFor(COLORS[key].zh, '3:4'), [ref], '3:4');
        jobs.push({ uuid, dest: dest34, label: `${key}-3x4` });
        console.log(`创建任务 ${key}-3x4: ${uuid}`);
      }
    }
  }
  for (const job of jobs) {
    const imgUrl = await pollTask(job.uuid, job.label);
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const tmp = job.dest + '.tmp';
    fs.writeFileSync(tmp, buf);
    fs.renameSync(tmp, job.dest);
    console.log(`已保存 ${job.dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
