/**
 * seedream-main-c-setc.js — Sheets & Duvet Sets 全类目 C 方案主图批量·SET C（4 张，2026-10-31）
 * 模板：docs/product-main-image-rules.md（SCENE + CAMERA_C v3 与 seedream-main-c-batch1.js 保持一致）
 * 用法: node scripts/seedream-main-c-setc.js [key]（不传=整批生成）
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
  'percalestripe-petal': {
    src: path.join(PRODUCTS_DIR, 'PERCALESTRIPE-PETAL-QUEEN', '1-3x4.webp'),
    dest: 'main-c-percalestripe-petal-queen.jpg',
    prompt:
      '以参考图中的床品为准：浅花瓣粉色（petal pink，柔和浅粉，不是玫粉不是珊瑚橘）底 + 白色细密竖条纹的四件套，' +
      '条纹为等距细直条、间距均匀、贯穿被面和枕面，纯棉 percale 面料、哑光挺括有垂坠感，' +
      '颜色、图案与参考图 1:1 一致，不改色、不扭曲图案。' +
      SCENE + CAMERA_C,
  },
  'pompom4-vine': {
    src: path.join(PRODUCTS_DIR, 'POMPOM4-VINE-QUEEN', '1-3x4.webp'),
    dest: 'main-c-pompom4-vine-queen.jpg',
    prompt:
      '以参考图中的床品为准：米白色（ivory/cream，暖调米白，不是冷白不是深驼）底 + 橄榄绿灰褐色藤蔓卷草花卉印花的四件套，' +
      '印花为古典卷草藤蔓花纹、线条流畅、分布均匀饱满，被套和枕套边缘饰有一圈橄榄棕色小绒球（pom-pom）流苏边，' +
      '绒球饰边必须保留、颜色与参考图一致，' +
      '颜色、图案与参考图 1:1 一致，不改色、不扭曲图案。' +
      SCENE + CAMERA_C,
  },
  'veljac-ivory': {
    src: path.join(PRODUCTS_DIR, 'VELJAC-IVORY-QUEEN', '1-3x4.webp'),
    dest: 'main-c-veljac-ivory-queen.jpg',
    prompt:
      '以参考图中的床品为准：象牙白色（ivory，柔和暖白，不是冷白不是米色）绒面提花四件套，' +
      '被面和枕面为同色系象牙白几何浮雕提花——菱形、三角等部落风几何纹样靠绒面凹凸和光影显现，无彩色印花，' +
      '天鹅绒般细腻短绒质感、提花立体感清晰，' +
      '颜色、图案与参考图 1:1 一致，不改色、不扭曲图案。' +
      SCENE + CAMERA_C,
  },
  'velstripe-charcoal': {
    src: path.join(PRODUCTS_DIR, 'VELSTRIPE-CHARCOAL-QUEEN', '1-3x4.webp'),
    dest: 'main-c-velstripe-charcoal-queen.jpg',
    prompt:
      '以参考图中的床品为准：炭灰色（charcoal gray，中深炭灰，不是浅灰不是黑色）底 + 深灰近黑色细条纹的绒面四件套，' +
      '条纹为多条细直线组成的条纹组、方向一致贯穿被面和枕面，天鹅绒般细腻柔绒质感，' +
      '颜色、图案与参考图 1:1 一致，不改色、不扭曲图案。' +
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
