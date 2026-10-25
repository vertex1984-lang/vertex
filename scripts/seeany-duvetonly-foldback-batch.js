/**
 * seeany-duvetonly-foldback-batch.js — 单独被套主图·局部翻折露内面（v1 标准批量版，2026-10-23 用户定）
 * 标准：以 percalejac-oatbeige-duvetonly-foldback-34.png（v1）的构图为模板 + 种草图规则（光线/镜头/调性/负向段）；
 *   近距离裁切床体侧角，只呈现部分被套；被套上部约 1/3 向床头翻折露纯色内面；无任何摆件。
 * 布料：严格以各产品主图参考为准——材质、纹理、颜色、图案 1:1，不做文字描述（用户定）。
 * 角度与背景允许随产品略有变化（用户定）：petal 左侧取景晨光、stone 右侧取景午后光。
 * 输出：public/images/staging/{percalestripe-petal,percalepatch-stone}-duvetonly-foldback-34.png
 * 用法: node scripts/seeany-duvetonly-foldback-batch.js
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

const JOBS = [
  {
    name: 'percalestripe-petal-duvetonly-foldback-34-v2.png',
    ref: path.join(ROOT, 'public', 'images', 'products', 'PERCALESTRIPE-PETAL-QUEEN', '1-3x4.webp'),
    angle: '镜头从床的左侧偏床尾位置近距离取景，晨光从右侧纱帘柔和洒入',
  },
  {
    name: 'percalepatch-stone-duvetonly-foldback-34.png',
    ref: path.join(ROOT, 'public', 'images', 'products', 'PERCALEPATCH-STONE-QUEEN', '1-3x4.webp'),
    angle: '镜头从床的右侧偏床尾位置近距离取景，午后暖光从左侧窗户柔和洒入',
  },
  {
    name: 'sateen4-olive-duvetonly-foldback-34.png',
    ref: path.join(ROOT, 'public', 'images', 'products', 'SATEEN4-OLIVE-QUEEN', '1.webp'),
    angle: '镜头从床的右侧偏床尾位置近距离取景，清晨柔光从左侧纱帘洒入',
  },
  {
    name: 'percale-coconut-duvetonly-foldback-34.png',
    ref: path.join(ROOT, 'public', 'images', 'products', 'PERCALE-COCONUT-QUEEN', '1-3x4.webp'),
    angle: '镜头从床的左侧偏床尾位置近距离取景，午后暖光从右侧窗户柔和洒入',
  },
  {
    // v2（2026-10-23 用户反馈 v1 质感偏亚麻）：颜色以参考图为准，质感明确为光滑挺括的 percale
    name: 'percale-coconut-duvetonly-foldback-v2.png',
    ref: path.join(ROOT, 'public', 'images', 'products', 'PERCALE-COCONUT-QUEEN', '1-3x4.webp'),
    angle: '镜头从床的左侧偏床尾位置近距离取景，午后暖光从右侧窗户柔和洒入',
    extra: '布料质感特别强调：光滑平整的纯棉 percale（府绸）质感——布面哑光、细腻、平整挺括，只有少量柔软自然的垂坠褶皱；' +
      '严禁亚麻质感：不得出现亚麻式的粗糙颗粒、竹节纹理、重度水洗褶皱或蓬松做旧感；布面以大面积平滑为主，褶皱少而浅。',
  },
  {
    name: 'percalejac-oatbeige-duvetonly-foldback-34.png',
    ref: path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-OATBEIGE-QUEEN', '1-3x4.webp'),
    angle: '镜头从床的右侧偏床尾位置近距离取景，晨光从左侧纱帘柔和洒入',
  },
  {
    name: 'duvset-gray-duvetonly-foldback-34.png',
    ref: path.join(ROOT, 'public', 'images', 'products', 'DUVSET-GRAY-QUEEN', '1-3x4.webp'),
    angle: '镜头从床的左侧偏床尾位置近距离取景，清晨柔光从右侧纱帘洒入',
  },
  {
    name: 'percalejac-haze-duvetonly-foldback-34.png',
    ref: path.join(ROOT, 'public', 'images', 'products', 'PERCALEJAC-HAZE-QUEEN', '1-3x4.webp'),
    angle: '镜头从床的右侧偏床尾位置近距离取景，上午柔和自然光从左侧纱帘洒入',
  },
  {
    name: 'linen3-oatmeal-duvetonly-foldback-34.png',
    ref: path.join(ROOT, 'public', 'images', 'products', 'LINEN3-OATMEAL-QUEEN', '1-3x4.webp'),
    angle: '镜头从床的右侧偏床尾位置近距离取景，晨光从左侧窗户柔和洒入',
  },
];

function buildPrompt(angle, extra) {
  return (
    // 产品锚定（布料不做文字描述，完全以图为准——2026-10-23 用户定）
    '被套面料严格以所附参考图为准：材质、纹理、颜色、图案及其比例全部 1:1 复刻，零改动，不做任何文字转述，以图为准；' +
    '严禁任何色偏——布料色相必须与参考图完全一致，不得因环境光、暖调氛围而改变布料本身的颜色；' +
    '布面零织标零印花。参考图仅作布料来源，严禁沿用其场景与陈设。' + (extra || '') +
    // 场景构图（v1 foldback 标准）
    '场景：3:4 竖版，暖调极简卧室。' + angle + '，画面只呈现床的局部与部分被套——' +
    '被套铺在床垫上，上部约三分之一向床头方向整齐翻折，露出被套的纯色内面（无图案纯色，颜色与参考图布料同色系）；' +
    '翻折边线自然平直，内面与外面形成质感对比；被套边缘自然垂坠盖住床垫侧面，露出少量原木床架与地毯。' +
    '画面中只有床与被套：没有枕头、没有被芯、没有任何小摆件（无书籍、无托盘、无杯饮、无花瓶）。' +
    // 光线氛围
    '光线：柔和自然光，白平衡准确（不得把布料洗成米色/棕色），布面有细腻明暗层次与柔软褶皱阴影，整体低饱和。' +
    // 镜头画质
    '镜头：专业家居纺织品摄影，8K 超高清，焦距略近的局部取景，布料肌理清晰锐利，超写实真实物理材质。' +
    // 负向规避
    '规避：零改动产品颜色质感；无塑料 CGI 质感、无平涂死黑阴影、无高饱和色彩、' +
    '无失真反光、无扭曲透视；画面无任何文字、水印、logo、人物、道具。'
  );
}

async function dataUri(file) {
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
  // 可选参数：node scripts/seeany-duvetonly-foldback-batch.js petal → 只跑匹配的任务
  const filter = process.argv[2];
  const jobs = filter ? JOBS.filter((j) => j.name.includes(filter)) : JOBS;
  for (const job of jobs) {
    const dest = path.join(OUT, job.name);
    console.log(`创建任务: ${job.name}`);
    const uuid = await createTask(buildPrompt(job.angle, job.extra), [await dataUri(job.ref)]);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  已保存 ${dest} (${buf.length} bytes)`);
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
