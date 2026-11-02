/**
 * seedream-main-c-setd.js — Sheets & Duvet Sets C 方案主图批量·SET D（4 张，2026-10-31）
 * 模板：docs/product-main-image-rules.md（SCENE + CAMERA_C 与 seedream-main-c-batch1.js 保持一致）
 * 用法: node scripts/seedream-main-c-setd.js [key]（不传=整批生成）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const PRODUCTS_DIR = path.join(ROOT, 'public', 'images', 'products');

const SCENE =
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床铺"半整理"状态：被套自然铺开带柔和生活感褶皱，不刻意拉平也不凌乱，能看清面料垂坠。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；一侧床头柜上放一杯咖啡和一本翻开的书。床上和床尾不要出现任何毯子、盖毯或毛毯。' +
  '清晨低角度自然光从左侧白纱帘透入，在被面形成柔和 directional 光影。' +
  '白平衡中性准确：床品颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编/燕麦色道具。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

const CAMERA_C =
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考床品的颜色和图案。' +
  '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
  '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
  '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
  '被面和枕面占画面 75% 以上，是绝对主体；画面底部可见一小条地板。';

const VARIANTS = {
  'btfly4-mocha': {
    src: path.join(PRODUCTS_DIR, 'MK-BTFLY4-MOCHA-QUEEN', '1.webp'),
    dest: 'main-c-mk-btfly4-mocha-queen.jpg',
    prompt:
      '以参考图中的床品为准：摩卡棕色（mocha，灰调奶咖棕，不是深咖啡不是米色）底 + 白色蝴蝶与深棕色小花枝蔓印花的四件套，' +
      '印花为浅色蝴蝶散布在细密枝叶藤蔓小花之间、分布均匀，枕套带白色荷叶花边，' +
      '水洗棉哑光柔软质感，颜色、图案、密度与参考图 1:1 一致，不改色、不扭曲印花图案。' +
      SCENE + CAMERA_C,
  },
  'floral4-grey': {
    src: path.join(PRODUCTS_DIR, 'MK-FLORAL4-GREY-QUEEN', '1.webp'),
    dest: 'main-c-mk-floral4-grey-queen.jpg',
    prompt:
      '以参考图中的床品为准：中灰色（grey，柔和中灰，不是浅银灰不是深炭灰）底 + 白色大花与枝叶印花的四件套，' +
      '印花为白色五瓣花朵沿枝条排布、花型清晰分布均匀，被套边缘和枕套带白色蕾丝荷叶花边，' +
      '水洗棉哑光质感，颜色、花型、密度与参考图 1:1 一致，不改色、不扭曲印花图案。' +
      SCENE + CAMERA_C,
  },
  'heart4-tan': {
    src: path.join(PRODUCTS_DIR, 'MK-HEART4-TAN-QUEEN', '1.webp'),
    dest: 'main-c-mk-heart4-tan-queen.jpg',
    prompt:
      '以参考图中的床品为准：浅卡其米色（tan，暖调燕麦驼色，不是纯白不是深棕）底 + 黑色小爱心散点印花的四件套，' +
      '印花为细密的黑色小爱心均匀散布，被套边缘带白色蕾丝荷叶花边，' +
      '水洗棉哑光柔绒质感，颜色、图案、密度与参考图 1:1 一致，不改色、不扭曲印花图案。' +
      SCENE + CAMERA_C,
  },
  'print4-blue': {
    src: path.join(PRODUCTS_DIR, 'MK-PRINT4-BLUE-QUEEN', '1.webp'),
    dest: 'main-c-mk-print4-blue-queen.jpg',
    prompt:
      '以参考图中的床品为准：米白色（off-white，暖调米白，不是冷白不是灰色）底 + 灰蓝色（dusty blue）小兔子整齐横排重复印花的四件套，' +
      '印花为灰蓝色小兔子剪影一排排整齐排列、排列规整不歪斜，被套边缘带白色蕾丝花边，' +
      '纯棉细腻质感，颜色、图案、密度与参考图 1:1 一致，不改色、不扭曲印花图案。' +
      SCENE + CAMERA_C,
  },
};

async function generate(v) {
  const mime = v.src.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  const b64 = fs.readFileSync(v.src).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: v.prompt,
      image: `data:${mime};base64,${b64}`,
      response_format: 'url',
      size: '1536x2048',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const imgUrl = data.data?.[0]?.url;
  if (!imgUrl) throw new Error('无结果图: ' + JSON.stringify(data).slice(0, 500));
  const buf = Buffer.from(await (await fetch(imgUrl)).arrayBuffer());
  const dest = path.join(ROOT, 'public', 'images', 'staging', v.dest);
  fs.writeFileSync(dest, buf);
  console.log(`已保存 ${v.dest} (${buf.length} bytes), size=${data.data[0].size}`);
}

(async () => {
  const only = process.argv[2];
  const keys = only ? [only] : Object.keys(VARIANTS);
  for (const k of keys) {
    console.log(`--- 生成 ${k}: ${VARIANTS[k].dest}`);
    try { await generate(VARIANTS[k]); }
    catch (e) { console.error(`${k} 失败:`, e.message); }
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
