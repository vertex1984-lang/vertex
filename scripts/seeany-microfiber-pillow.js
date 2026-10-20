/**
 * seeany-microfiber-pillow.js — Microfiber 床枕（polyester 枕套）图片生成（2026-10-18 用户定）
 *  - main：灰底双枕平叠棚拍图（构图 1:1 对齐 down-pillow-main-1x1.png），面料保持 polyester 光面枕套
 *    （参照 B0F62Y59CW 现有主图的布料质感）——3 个尺寸变体共用
 *  - filling：microfiber 纤维棉填充物特写，占满整个画面（与 down 填充图同标准）——变体共用
 *  - seed：种草图——microfiber 枕 + down 枕同框，暖米色卧室场景，匹配网站整体色调
 *    （风格参照 percale 场景图）
 * 输出：staging/microfiber-pillow-main-1x1.png / microfiber-pillow-filling-1x1.png / pillow-seed-down-vs-microfiber.png
 * 用法: node scripts/seeany-microfiber-pillow.js [main|filling|seed]（不传 = 全部；已存在自动跳过）
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
  main: {
    dest: path.join(STAGING, 'microfiber-pillow-main-1x1.png'),
    refs: [
      path.join(STAGING, 'down-pillow-main-1x1.png'),
      path.join(PRODUCTS, 'B0F62Y59CW', '1.webp'),
    ],
    prompt:
      '以第一张参考图为构图的绝对基准：浅灰色纯色摄影棚背景、柔和均匀的棚拍光线、两个白色枕头完全水平地平叠' +
      '（下枕平放台面、上枕整体平躺在下枕正上方，轴线对齐、上下完全重叠，不倾斜不翘起不悬空）、相机角度全部 1:1 零改动。' +
      '面料以第二张参考图为准：光滑平纹的白色聚酯（polyester）枕套，布面干净细腻、只有自然褶皱，无压花无格纹无刺绣无 logo 无标签；' +
      '填充为纤维棉的饱满感——挺括圆润但不像羽绒那样松垮下陷，边角成形略方正。' +
      '写实摄影质感，画面无文字、无水印、无logo、无人。',
  },
  filling: {
    dest: path.join(STAGING, 'microfiber-pillow-filling-1x1.png'),
    refs: [path.join(STAGING, 'down-pillow-filling-only-1x1.png')],
    prompt:
      '以这张参考图为构图基准：特写镜头，填充物占满整个画面、四边顶到画框边缘，浅灰色背景只在缝隙间隐约可见，柔和均匀的棚拍光线。' +
      '唯一改动：填充物从羽绒簇改为纤维棉（microfiber / polyester fiberfill）——细腻的白色丝绒状纤维团，' +
      '丝缕绵密均匀、蓬松轻盈，像撕开的棉絮云团，没有羽毛、没有羽轴、没有绒枝结构。' +
      '画面中只有填充物本身，绝对不要出现：手、枕头、枕套、布料、任何人造物体或人体部位。' +
      '写实摄影质感，画面无文字、无水印、无logo、无人。',
  },
  seed2: {
    dest: path.join(STAGING, 'pillow-seed-bright-morning.png'),
    refs: [
      path.join(STAGING, 'down-pillow-main-1x1.png'),
      path.join(PRODUCTS, 'B0F62Y59CW', '1.webp'),
    ],
    prompt:
      '生成一张明亮清亮色调的晨间卧室生活场景图（与上一张暖米色种草图同系列但色调更清透、以白色为主）：' +
      '清晨阳光透过白纱帘洒进房间，光影落在墙上和床上；浅橡木床头板，白色床品自然揉皱、被子随意摊开有刚起床的松弛感；' +
      '床上有几只白色睡枕，摆放自然随意——有的斜靠床头、有的微歪相叠、角度不对称，绝对不要整齐并排平叠；' +
      '其中一只是羽绒枕（参照第一张图：纯棉枕套、饱满松软的羽绒下陷感、圆润边角），' +
      '另一只是纤维棉枕（参照第二张图：polyester 光面枕套、挺括成形略方正），质感差异自然可见；' +
      '枕头前点缀一两只灰粉色和赭橘色灯芯绒抱枕增加色彩层次；一只奶油色的猫在床上伸懒腰；' +
      '床头木柜上有翻开的书、马克杯、眼镜，地板上放着拖鞋和报纸，窗台有绿植和小闹钟，生活化细节自然不摆拍。' +
      '写实摄影质感、明亮通透的日光色调，画面无文字、无水印、无logo。',
  },
  seed: {
    dest: path.join(STAGING, 'pillow-seed-down-vs-microfiber.png'),
    refs: [
      path.join(PRODUCTS, 'PERCALE-COCONUT-QUEEN', '1.webp'),
      path.join(STAGING, 'down-pillow-main-1x1.png'),
      path.join(PRODUCTS, 'B0F62Y59CW', '1.webp'),
    ],
    prompt:
      '以第一张参考图为色调基准：暖米色奶油调、柔和自然光从左侧纱帘洒入、原木与藤编元素，整体色调与网站风格保持一致。' +
      '画面主体：一张松弛未刻意整理的床——奶白色床品自然起皱、被子随意掀开一角，床上有两组白色枕头，' +
      '摆放要自然随意有松弛感：有的斜靠在床头、有的微微歪着叠在另一只上面、角度各不相同，像有人刚起床随手一放，' +
      '绝对不要整齐的并排平叠、不要对称构图。其中一组是羽绒枕（参照第二张图：纯棉枕套、饱满松软的羽绒下陷感、圆润边角），' +
      '另一组是纤维棉枕（参照第三张图：polyester 光面枕套、挺括成形略方正），两组质感差异自然可见。' +
      '写实摄影质感、生活化氛围（lived-in），画面无文字、无水印、无logo、无人。',
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

async function fetchRetry(url, opts, label = 'fetch') {
  for (let t = 0; t < 8; t++) {
    try { return await fetch(url, opts); }
    catch (e) { console.log(`  ${label} 网络重试 ${t + 1}/8`); await new Promise((r) => setTimeout(r, 8000)); }
  }
  throw new Error(`${label} 网络持续失败`);
}

async function createTask(prompt, inputImgs, ratio) {
  const res = await fetchRetry(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: ratio,
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
  for (const [key, j] of jobs) {
    if (fs.existsSync(j.dest)) { console.log(`跳过已存在: ${j.dest}`); continue; }
    for (const r of j.refs) if (!fs.existsSync(r)) { console.error(`缺参考图: ${r}`); process.exit(1); }
    const refs = await Promise.all(j.refs.map(localRefDataUri));
    const ratio = key === 'seed' ? '3:2' : '1:1';
    console.log(`创建任务: ${key}（${ratio}, sunburst 2K）`);
    const uuid = await createTask(j.prompt, refs, ratio);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const res = await fetchRetry(imgUrl, undefined, '结果图下载');
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(j.dest, buf);
    console.log(`  已保存 ${j.dest} (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
