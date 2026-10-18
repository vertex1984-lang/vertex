/**
 * seeany-down-pillow.js — 新品 Down Bed Pillows（Set of 2, 100% Cotton 白色枕套）主图 + 填充图生成
 * 2026-10-18 用户定：
 *  - 主图：灰底、两个白色枕头平叠摆放（参照用户给的摆放图，与 B0GD87ZBN9 studio-main 同风格），
 *    枕套为光滑纯棉（无压花纹理）
 *  - 填充图：枕头开口处羽绒簇（down clusters）涌出特写，参照 Parachute down pillow 图
 * 输出：staging/down-pillow-main-1x1.png / staging/down-pillow-filling-1x1.png（确认后再落正式目录）
 * 用法: node scripts/seeany-down-pillow.js [main|filling]（不传 = 两张都生成；已存在自动跳过）
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
    dest: path.join(STAGING, 'down-pillow-main-1x1.png'),
    refs: [path.join(PRODUCTS, 'B0GD87ZBN9', 'studio-main.webp')],
    prompt:
      '以这张参考图为绝对基准：浅灰色纯色摄影棚背景、柔和均匀的棚拍光线、相机角度全部 1:1 零改动。' +
      '构图要求（最重要）：两个白色枕头完全水平地平叠——下边的枕头平放在台面上，上边的枕头整体平躺、贴合地落在下边枕头的正上方，' +
      '两只枕头轴线对齐、上下完全重叠，上面枕头不倾斜、不翘起、不悬空、不错位，底边与下枕大面积接触。' +
      '面料：光滑平整的 100% 纯棉贡缎感白色枕套（无压花、无格纹、无刺绣，布面干净细腻只有自然褶皱）；' +
      '厚度要求：枕头要明显更厚、更高的蓬松度（high loft），每只枕头中部隆起饱满，厚度约为普通枕头的 1.5 倍，' +
      '羽绒枕特有的柔软下陷感和圆润边角，但整体厚实不扁塌。' +
      '写实摄影质感，画面无文字、无水印、无logo、无人。',
  },
  fillingblend: {
    dest: path.join(STAGING, 'down-pillow-filling-blend-1x1.png'),
    refs: [path.join(STAGING, 'ref-down-clusters.jpg')],
    prompt:
      '以这张参考图为羽绒质感的基准：轻盈蓬松的白色羽绒簇（down clusters），绒丝细腻分明。' +
      '构图：特写镜头，一堆自然堆叠的混合填充物占满整个画面——约 50% 白色羽绒簇与约 50% 白色小羽毛（feathers，带细密羽轴和羽枝的柔软小型羽毛）均匀混合，' +
      '羽绒的蓬松空气感与羽毛的条状结构清晰可见、比例大致各半；填充物从画面左边延伸到右边、从底部堆到顶部，四边都顶到画框边缘，几乎不留背景空间；' +
      '浅灰色纯色背景只在缝隙间隐约可见，柔和均匀的棚拍光线，与网站其他产品图风格一致。' +
      '绝对不要出现：手、手指、手臂、枕头、枕套、布料、任何人造物体或人体部位。' +
      '写实摄影质感，画面无文字、无水印、无logo、无人。',
  },
  fillingonly: {
    dest: path.join(STAGING, 'down-pillow-filling-only-1x1.png'),
    refs: [path.join(STAGING, 'ref-down-clusters.jpg')],
    prompt:
      '以这张参考图为填充物质感的绝对基准：轻盈蓬松的白色羽绒簇（down clusters），绒丝细腻分明、空气感十足的羽绒堆。' +
      '构图：特写镜头，一大堆自然堆叠的白色羽绒簇占满整个画面——填充物从画面左边延伸到右边、从底部堆到顶部，四边都顶到画框边缘，几乎不留背景空间；' +
      '浅灰色纯色背景只在羽绒缝隙间隐约可见，柔和均匀的棚拍光线，与网站其他产品图风格一致。' +
      '绝对不要出现：手、手指、手臂、枕头、枕套、布料、任何人造物体或人体部位。' +
      '写实摄影质感，画面无文字、无水印、无logo、无人。',
  },
  filling: {
    dest: path.join(STAGING, 'down-pillow-filling-1x1.png'),
    refs: [
      path.join(PRODUCTS, 'B0GD87ZBN9', 'studio-filling.webp'),
      path.join(STAGING, 'ref-parachute-down-pillow.jpg'),
    ],
    prompt:
      '以第一张参考图为构图基准：浅灰色纯色摄影棚背景，一只白色枕头局部特写，侧边开口处填充物涌出，柔和棚拍光线，构图和光线 1:1 零改动。' +
      '唯一改动：填充物从聚酯纤维球改为真正的羽绒——参照第二张图的羽绒质感：轻盈蓬松的白色羽绒簇（down clusters），羽毛绒丝细腻分明、空气感十足，从开口自然涌出并散落在枕头上。' +
      '枕套面料为光滑纯棉白色（无压花纹理）。写实摄影质感，画面无文字、无水印、无logo、无人。',
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
  for (const [key, j] of jobs) {
    if (fs.existsSync(j.dest)) { console.log(`跳过已存在: ${j.dest}`); continue; }
    for (const r of j.refs) if (!fs.existsSync(r)) { console.error(`缺参考图: ${r}`); process.exit(1); }
    const refs = await Promise.all(j.refs.map(localRefDataUri));
    console.log(`创建任务: ${key}（1:1, sunburst 2K）`);
    const uuid = await createTask(j.prompt, refs);
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
