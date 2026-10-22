/**
 * seeany-pompom-zhongcao.js — 绒球花边雕花绒床品 7 款 3:4 种草图/主图（2026-10-21 用户定）
 * 规则：按 docs/lifestyle-image-rules.md 六段式标准生成（用户确认本次适用该规则），
 *   mode = gpt-image-2.5-sunburst；站内图分支色调（米色 #F8F5F0 + 暖棕 #8B5A2B，温馨奶油）
 * 产品（7 款 = 6 张桌面参考图 + euro-jacquard 参考图上的金色大马士革款）：
 *   每款床品图案/配色/绒球花边/雕花绒肌理 1:1 锁定各自参考图；场景布局统一
 *   （温馨奶油卧室，床占约 4/5），但各款床上褶皱与摆放物品位置细节略有不同（用户定）
 * 用法: node scripts/seeany-pompom-zhongcao.js [序号]   // 无参数=全部，有参数=只跑该款
 * 输出: public/images/staging/pompom-zhongcao-{name}-34.png
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

/** 各款产品锚定描述（中英文双写颜色，肌理/绒球/内面配色逐项锁定） */
const PRODUCTS = [
  {
    name: 'gold-swirl',
    ref: 'ref-pompom-gold-swirl.jpg',
    anchor: '被套和枕套为奶白底色配浅驼金色卷草佩斯利涡纹的雕花绒（剪花绒肌理，花纹处绒面被剪出立体浮雕感，雾面哑光，cream base with camel-gold paisley swirl carved plush），边缘一圈浅黄色绒球花边（pom-pom trim），被套反折内面与床笠为驼黄/芥末金纯色牛奶绒（mustard-gold solid milk-velvet）',
  },
  {
    name: 'cream-green',
    ref: 'ref-pompom-cream-green.jpg',
    anchor: '被套和枕套为奶白底色配浅金色卷草藤蔓纹的雕花绒（立体剪花绒肌理，雾面哑光，cream base with light-gold vine-scroll carved plush），边缘一圈棕色绒球花边（brown pom-pom trim），被套反折内面与床笠为橄榄绿纯色牛奶绒（olive-green solid milk-velvet，柔和丝绒光泽）',
  },
  {
    name: 'blue-leaf',
    ref: 'ref-pompom-blue-leaf.jpg',
    anchor: '被套和枕套为浅灰蓝底色配白色叶脉蕨叶纹的雕花绒（立体剪花绒肌理，雾面哑光，dusty-blue base with white leaf-vein carved plush），边缘一圈白色绒球花边（white pom-pom trim），被套反折内面与床笠为米白纯色牛奶绒（warm off-white solid milk-velvet）',
  },
  {
    name: 'pink-floral',
    ref: 'ref-pompom-pink-floral.jpg',
    anchor: '被套和枕套为奶白底色配浅粉与浅灰小碎花的雕花绒（立体剪花绒肌理，雾面哑光，cream base with blush-pink and grey small-floral carved plush），边缘一圈白色绒球花边（white pom-pom trim），被套反折内面与床笠为浅灰蓝纯色牛奶绒（light dusty-blue solid milk-velvet）',
  },
  {
    name: 'ink-floral',
    ref: 'ref-pompom-ink-floral.jpg',
    anchor: '被套和枕套为米白底色配黑灰色线描花卉枝叶图案的雕花绒（手绘线条感花卉，立体剪花绒肌理，雾面哑光，off-white base with charcoal ink-sketch floral carved plush），边缘一圈黑色绒球花边（black pom-pom trim），被套反折内面与床笠为浅灰纯色牛奶绒（light grey solid milk-velvet）',
  },
  {
    name: 'lilac',
    ref: 'ref-pompom-lilac.jpg',
    anchor: '被套和枕套为浅灰紫底色配白色小花与叶脉纹的雕花绒（立体剪花绒肌理，雾面哑光，lilac-grey base with white small-floral carved plush），边缘一圈淡紫色绒球花边（light-purple pom-pom trim），被套反折内面与床笠为浅灰纯色牛奶绒（light grey solid milk-velvet）',
  },
  {
    name: 'euro-gold',
    ref: 'ref-euro-jacquard-bed.png',
    anchor: '被套和枕套为奶白底色配金色卷草藤蔓大马士革纹的雕花绒（立体剪花绒肌理，雾面哑光，cream base with gold damask-scroll carved plush），边缘一圈棕色绒球花边（brown pom-pom trim），床上另有一只橄榄绿丝绒质感的长抱枕（olive-green velvet lumbar pillow），被套反折内面为橄榄绿纯色牛奶绒',
  },
];

/** 场景/光线/镜头/品牌/负向：六段式公共段（场景布局统一，细节允许自然变化） */
function promptOf(p) {
  return [
    // 1. 产品锚定段
    `以参考图为绝对基准：床上的床品套件 1:1 完全还原——${p.anchor}；床品的图案、配色、雕花绒肌理、绒球花边细节、造型比例全部 1:1 锁定参考图，布面零织标零印花`,
    // 2. 场景构建段（布局统一：床占约 4/5，温馨奶油卧室；物品摆放与床品褶皱允许自然差异）
    '场景为温馨奶油风卧室：3:4 竖版构图，宽幅大床占据画面绝大部分空间（约 4/5 画面），镜头略低角度微俯拍，从床尾侧前方取景，床体为规则长方形、严格符合透视原理；奶白色软包床头板配浅原木床架（自然木纹），床头一侧奶油色陶瓷台灯配亚麻灯罩，原木边几上放一本翻开的生活方式杂志和一只粗陶咖啡杯，床尾自然搭一条燕麦色羊毛针织毯（几何编织纹理），画面一角大型琴叶榕绿植，床下浅色羊毛几何编织地毯，墙上挂一幅细框原木挂画，窗户挂亚麻白纱帘；前景、中景、远景层次丰富，有呼吸感留白；被面上可自然摆放杂志或陶瓷杯等点缀道具（无可辨识文字）',
    // 3. 光线氛围段
    '温暖金色时刻自然日光透过白纱帘漫射入室，床品与木地板上形成柔和斑驳光影，柔和漫射渐变阴影，窗边日光自带温润光晕，自然光线衰减，暖色温',
    // 4. 镜头画质段
    '专业室内家居摄影，2K 超高清，浅景深电影镜头效果（焦点锁定床品，前景与背景自然虚化），细微复古胶片颗粒，轻微镜头边缘柔化，超写实真实物理材质',
    // 5. 品牌调性段（站内图分支）
    '整体暖色温奶油色调，米色 #F8F5F0 + 暖棕 #8B5A2B 品牌调性，低饱和 ins 风，温馨、舒适、松弛的生活方式杂志感',
    // 6. 负向规避段（参考图中有手，必须规避人物肢体）
    '零改动产品颜色质感；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视、任何文字水印 logo、人物及人体任何部位（包括手）、宠物、玩偶公仔',
  ].join('。');
}

async function localRefDataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(path.join(STAGING, file)).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(prompt, refFile) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs: [await localRefDataUri(refFile)], imgNum: 1, imgRatio: '3:4',
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

async function genOne(p) {
  const refPath = path.join(STAGING, p.ref);
  if (!fs.existsSync(refPath)) { console.error(`找不到参考图: ${refPath}`); return; }
  const out = path.join(STAGING, `pompom-zhongcao-${p.name}-34.png`);
  const uuid = await createTask(promptOf(p), p.ref);
  console.log(`创建任务: ${p.name} task_uuid=${uuid}`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(out, buf);
  console.log(`已保存 ${out} (${buf.length} bytes)`);
}

(async () => {
  const idx = process.argv[2];
  const list = idx === undefined ? PRODUCTS : [PRODUCTS[Number(idx)]];
  for (const p of list) {
    if (!p) { console.error(`无效序号: ${idx}`); process.exit(1); }
    await genOne(p);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
