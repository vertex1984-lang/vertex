/**
 * seeany-pillowcase-colors.js — 装饰枕套（Decorative Pillow Cases）新布料主图试色（2026-10-08 用户定）
 * 4 张试色图：灯芯绒 ×2（Caramel 焦糖棕 / Terracotta 陶土色）、Cotton-like ×2（Sage 鼠尾草绿 / Eucalyptus 桉树绿）
 * 参考图：cat-social-pillows.webp（用户指定的灯芯绒/cotton-like 质感来源）
 * 规格与枕芯主图一致：浅灰棚拍底、无标签 logo、1:1 2K → 1200×1200 webp q82
 * 用法: node scripts/seeany-pillowcase-colors.js [job名]   （不传则全跑）
 * 输出: public/images/staging/pillowcase-colors/{job}.webp
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, '..', 'public', 'images', 'staging', 'pillowcase-colors');
fs.mkdirSync(OUT, { recursive: true });

const REF = 'https://www.makimoohome.com/images/collections/cat-social-pillows.webp';
const STUDIO = '浅灰色纯色摄影棚背景（light gray seamless studio background），柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级，无文字无水印无logo，**不要任何织标/标签/印花，布面完全纯净**。构图：单个 45×45cm 方形抱枕（套好枕套、饱满四角），正面居中端正展示，占画面约 70%，四周留白均匀。';
const CORDUROY = '参考图中左侧那只抱枕的**灯芯绒（corduroy）布料**：细密竖条纹绒面，哑光柔雾质感，保持完全一致的布料工艺与纹理密度';
const COTTON = '参考图中右侧灰绿色那只抱枕的**水洗棉质感（washed cotton-like）布料**：细腻哑光棉质表面、轻微自然褶皱感，保持完全一致的布料质感';

const JOBS = [
  { name: 'corduroy-caramel', prompt: `${CORDUROY}。颜色：**焦糖棕（caramel brown）**，暖调棕色、低饱和度、带灰调，ins 风柔和高级感。${STUDIO}` },
  { name: 'corduroy-terracotta', prompt: `${CORDUROY}。颜色：**陶土色（muted terracotta）**，偏橘的砖调、低饱和度、柔和不鲜艳，ins 风柔和高级感。${STUDIO}` },
  { name: 'cotton-sage', prompt: `${COTTON}。颜色：**鼠尾草绿（sage green）**，灰调最足的浅绿、低对比度、柔和安静，ins 风标配色。${STUDIO}` },
  { name: 'cotton-eucalyptus', prompt: `${COTTON}。颜色：**桉树绿（eucalyptus green）**，比鼠尾草绿略深略冷的灰绿、低饱和度，柔和高级。${STUDIO}` },
  // 2026-10-08 用户试色后定稿：灯芯绒 = 焦糖棕 + 灰粉；Cotton-like = 鼠尾草绿 + 米白（同布料两色要明显区别）
  { name: 'corduroy-dusty-rose', prompt: `${CORDUROY}。颜色：**灰粉（dusty rose）**，带灰调的裸粉色、低饱和度、柔和不艳，ins 风高级感，与焦糖棕形成明显色相区别。${STUDIO}` },
  { name: 'cotton-cream', prompt: `${COTTON}。颜色：**米白（cream / off-white）**，温暖的奶油米白色、柔和不刺眼，与鼠尾草绿形成明显明暗与色相区别。${STUDIO}` },
  // 2026-10-08 用户定：每种布料补足 5 色。灯芯绒 +橄榄绿/雾霾蓝/炭灰；Cotton-like +裸粉/雾蓝/浅灰
  { name: 'corduroy-olive', prompt: `${CORDUROY}。颜色：**橄榄绿（muted olive green）**，带灰黄调的低饱和橄榄绿，复古自然，ins 风高级感。${STUDIO}` },
  { name: 'corduroy-dusty-blue', prompt: `${CORDUROY}。颜色：**雾霾蓝（dusty blue）**，带灰调的柔和蓝色、低饱和度，安静高级，ins 风。${STUDIO}` },
  { name: 'corduroy-charcoal', prompt: `${CORDUROY}。颜色：**炭灰（charcoal grey）**，深沉的暖调炭灰色、哑光，高级稳重，ins 风。${STUDIO}` },
  { name: 'cotton-blush', prompt: `${COTTON}。颜色：**裸粉（blush pink）**，极柔和的裸粉肉粉色、低饱和度、带灰调，ins 风温柔感。${STUDIO}` },
  { name: 'cotton-dusty-blue', prompt: `${COTTON}。颜色：**雾蓝（dusty blue）**，带灰调的柔和浅蓝、低饱和度，清爽安静，ins 风。${STUDIO}` },
  { name: 'cotton-light-grey', prompt: `${COTTON}。颜色：**浅灰（light heather grey）**，柔和的中性浅灰、带一点点暖调，百搭高级，ins 风。${STUDIO}` },
  // 2026-10-08 用户定：每种布料再出 2 张种草场景图（规则见 seeany-mood-feed.js：暖色调、ins 生活方式杂志感、lived-in、浅景深）
  { name: 'scene-corduroy-1', prompt: `以参考图中左侧抱枕的**灯芯绒（corduroy）布料**为准：细密竖条纹绒面、哑光柔雾质感。场景：温暖的客厅午后，米色亚麻沙发上自然叠放着三个灯芯绒抱枕——**焦糖棕（caramel）、灰粉（dusty rose）、橄榄绿（muted olive）**，随意靠着不刻意摆拍，旁边搭一条奶油色针织毯，原木边几上有一杯热咖啡，阳光透过白纱帘洒落。生活方式杂志感构图，画面有呼吸感和留白，松弛自然的居家氛围（lived-in），浅景深。暖色调家居摄影，米色暖棕色调，柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo，布面无任何织标/标签/印花。` },
  { name: 'scene-corduroy-2', prompt: `以参考图中左侧抱枕的**灯芯绒（corduroy）布料**为准：细密竖条纹绒面、哑光柔雾质感。场景：安静的卧室一角，原木床架、米白亚麻床品上放着两个灯芯绒抱枕——**雾霾蓝（dusty blue）和炭灰（charcoal grey）**，一前一后自然斜靠，床头一盏暖光陶土台灯，旁边一本翻开的书，窗外晨光柔和。生活方式杂志感构图，画面有呼吸感和留白，松弛自然的居家氛围（lived-in），浅景深。暖色调家居摄影，米色暖棕色调，柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo，布面无任何织标/标签/印花。` },
  { name: 'scene-cotton-1', prompt: `以参考图中右侧灰绿色抱枕的**水洗棉质感（washed cotton-like）布料**为准：细腻哑光棉质表面、轻微自然褶皱。场景：明亮的客厅窗边，米白色布艺沙发上自然放着三个水洗棉抱枕——**鼠尾草绿（sage）、米白（cream）、裸粉（blush）**，随意叠靠不刻意摆拍，旁边一盆琴叶榕，编织地毯，阳光透过白纱帘。生活方式杂志感构图，画面有呼吸感和留白，松弛自然的居家氛围（lived-in），浅景深。暖色调家居摄影，米白和柔和粉绿色调，柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo，布面无任何织标/标签/印花。` },
  { name: 'scene-cotton-2', prompt: `以参考图中右侧灰绿色抱枕的**水洗棉质感（washed cotton-like）布料**为准：细腻哑光棉质表面、轻微自然褶皱。场景：玄关/卧室床尾凳场景，浅色原木长凳上放着两个水洗棉抱枕——**雾蓝（dusty blue）和浅灰（light grey）**，自然靠着米白墙面，旁边一个陶土花瓶插着干花（蒲苇），地面黄麻地毯，午后斜射光。生活方式杂志感构图，画面有呼吸感和留白，松弛自然的居家氛围（lived-in），浅景深。暖色调家居摄影，米灰蓝色调，柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo，布面无任何织标/标签/印花。` },
];

async function createTask(job) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'User-Agent': 'seeany-api',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      aiTypeId: 113,
      aiType: 'smartImg',
      prompt: job.prompt,
      inputImgs: [REF],
      imgNum: 1,
      imgRatio: '1:1',
      mode: 'gpt-image-2.5',
      size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`${job.name}: ${JSON.stringify(data)}`);
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' },
    });
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
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const only = process.argv[2];
  for (const job of JOBS) {
    if (only && job.name !== only) continue;
    const dest = path.join(OUT, `${job.name}.webp`);
    console.log(`创建任务: ${job.name}`);
    const uuid = await createTask(job);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
    console.log(`  已保存 ${dest}`);
  }
  console.log('全部完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
