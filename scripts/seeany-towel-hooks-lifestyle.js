/**
 * seeany-towel-hooks-lifestyle.js — 长绒棉毛巾挂杆场景种草图（2026-10-16）
 * 参考图1（场景/构图）：两条毛巾挂在原木挂钩排上，米色墙面+白色门框，1:1 复刻空间布局；
 * 参考图2（材质）：MK-TOWEL-LSC-SAGE 灰底主图——长绒棉毛圈质感 + sage 灰绿色，毛巾面料/颜色以此为准。
 * 规则：docs/lifestyle-image-rules.md 六段式；社媒种草调性（不绑网站色系，博主实拍感）；1:1。
 * 用法: node scripts/seeany-towel-hooks-lifestyle.js
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
const OUT = path.join(__dirname, 'seeany-edit-preview');
fs.mkdirSync(OUT, { recursive: true });

const REF_SCENE = 'https://www.makimoohome.com/images/staging/towel-hooks-ref.webp';           // 挂杆场景构图参考
// 每个颜色一张：材质/颜色参考用该色灰底主图（已上线）
const COLORS = [
  { slug: 'cream', name: 'Cream', zh: '奶油白色（soft cream）' },
  { slug: 'oatmeal', name: 'Oatmeal', zh: '燕麦色（warm oatmeal beige）' },
  { slug: 'sage', name: 'Sage', zh: '鼠尾草灰绿（muted sage green）' },
  { slug: 'dustyrose', name: 'Dusty Rose', zh: '灰粉色（muted dusty rose）' },
  { slug: 'lightgrey', name: 'Light Grey', zh: '浅灰色（soft light grey）' },
  { slug: 'dustyblue', name: 'Dusty Blue', zh: '灰蓝色（muted dusty blue）' },
];
const fabricRef = (slug) => `https://www.makimoohome.com/images/products/MK-TOWEL-LSC-${slug.toUpperCase()}-40X70/1.webp`;

// 六段式（lifestyle-image-rules.md）
const promptOf = (zh, en) =>
  // 1. 产品锚定段（场景复刻类：锁定空间布局 + 材质置换）
  '以第一张参考图为基准 1:1 复刻场景构图：米色乳胶漆墙面、左侧白色门框线条、墙面上方原木色三联挂钩排（深色金属钩），' +
  '两条毛巾分别挂在相邻钩子上自然垂坠——左边一条较小（擦手巾），右边一条更大更长（浴巾），一短一长前后错落，' +
  '布料垂坠褶皱造型、位置、大小比例与原图保持一致，零增减移位。' +
  '毛巾面料和颜色严格参照第二张参考图：长绒棉毛圈（long-staple cotton terry）——蓬松饱满的细小环形毛圈颗粒、哑光柔软、端部带细密罗纹缎档边，' +
  `颜色为${zh}（${en}），与参考图2的毛巾颜色 1:1 一致，画面内所有毛巾（挂着的、折叠的、凳上的）均为同一颜色，布面零织标零印花。` +
  // 2. 场景构建段（在墙面场景基础上补充生活感细节）
  '场景细节丰富化：挂钩排第三只钩子上搭一条折叠的同色系小方巾；墙面右下方露出白色浴缸边缘一角，' +
  '缸沿上放一只粗陶托盘（天然陶土颗粒质感）、一瓶琥珀玻璃洗手液和一小束干花芦苇；' +
  '画面下缘露出一角原木浴室凳，凳上叠放一条同色系毛巾和一本翻开的杂志；' +
  '左侧门框边点缀一株小型尤加利绿植（带自然脉络绒面质感）。前景/中景/远景层次清晰，画面有呼吸感留白。' +
  // 3. 光线氛围段
  '温暖金色时刻自然日光从左侧窗外漫射入室，墙面与毛巾上形成柔和斑驳光影，柔和漫射渐变阴影，暖色温温润光晕，自然光线衰减。' +
  // 4. 镜头画质段
  '专业室内家居摄影，8K 超高清，浅景深电影镜头效果（焦点锁定两条挂着的毛巾，前景与背景自然虚化），' +
  '细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质。' +
  // 5. 品牌调性段（社媒种草图：不绑网站色系）
  'ins 生活方式博主实拍感，自然真实色彩还原，白平衡准确，清爽通透不发闷，色彩饱和自然不刻意暖调，' +
  '像真实博主家里的随手拍大片，现代简约风格。' +
  // 6. 负向规避段
  '零改动毛巾颜色质感；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、任何文字水印 logo。';

async function createTask(prompt, refFabric) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [REF_SCENE, refFabric], imgNum: 1, imgRatio: '1:1',
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
    const { status, assets } = data.data;
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
  for (const { slug, name, zh } of COLORS) {
    const dest = path.join(OUT, `towel-hooks-lifestyle-${slug}.png`);
    if (fs.existsSync(dest)) { console.log(`跳过 ${slug}（已存在）`); continue; }
    console.log(`[${slug}] 创建任务...`);
    const uuid = await createTask(promptOf(zh, name), fabricRef(slug));
    console.log(`[${slug}] task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`[${slug}] 已保存 ${dest} (${buf.length} bytes)`);
  }
  console.log('完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
