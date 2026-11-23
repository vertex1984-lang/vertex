/**
 * seedream-main-a2b-blanket-batch.js — Blanket 主图 A2b 方案批量生成剩余 29 张（2026-11-11）
 * 结构与 SCENE_A2B 常量原样复制自 seedream-main-a2b-blanket-2more.js（一字不改）。
 * 参考图已预下载到 public/images/staging/refs/（1688 需 UA/Referer 头，见下载记录）。
 * 用法: node scripts/seedream-main-a2b-blanket-batch.js [startIndex] [count]
 * 已存在的输出文件自动跳过（可断点续跑）；单张失败不中断整批。
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');
const STAGING = path.join(ROOT, 'public', 'images', 'staging');
const REFS = path.join(STAGING, 'refs');

const RABBITFUR_TEX = '仿兔毛长毛绒毯，绒毛细密蓬松，表面是规则立体的竖向泡泡抽条绒，绒面质感与颜色同参考图 1:1 一致，不改色。';
const ZIPFLEECE_TEX = '塔芙绒毯，正面是立体斜纹几何压纹绒面（浮雕感编织纹），反面为白色羊羔绒，绒面质感与颜色同参考图 1:1 一致，不改色。';
const SPRUCE_TEX = '云杉绒杉影毯：绒毛细密蓬松，毯面底色上有深色（近黑的深咖色）杉树影提花竖条纹，四边及背面是白色羊羔绒包边，纹样与颜色同参考图 1:1 一致，不扭曲纹样、不改色。';
const WAFFLEFL_TEX = '华夫格绒毯，表面是规则立体的华夫格（小方格）织纹，格纹间距与参考图 1:1 一致，不扭曲格纹、不改色。';
const KNIT995_TEX = '立体麦穗纹针织毯，表面是规则立体的竖向麦穗/菠萝格织纹，两端带流苏，织纹与颜色同参考图 1:1 一致，不扭曲织纹、不改色。';
// 989320962592 的 grey/mint 在 xlsx 中与 khaki/beige 共用同一参考图，颜色以文字描述为准
const COLOR_OVERRIDE = '参考图仅用于锁定面料质感与织纹，毯子颜色以文字描述为准：';

const PRODUCTS = [
  // ── RABBITFUR 仿兔毛长毛绒（CAMEL 已完成，剩 5）──
  { name: 'rabbitfur-white', ref: 'rabbitfur-white.jpg', fabric:
    '以参考图中的毯子面料为准：纯净奶白色（ivory white，暖调纯白，不偏黄不发灰）' + RABBITFUR_TEX },
  { name: 'rabbitfur-smoke', ref: 'rabbitfur-smoke.jpg', fabric:
    '以参考图中的毯子面料为准：深烟灰色（smoke grey，深灰略带冷调，不偏棕不偏紫）' + RABBITFUR_TEX },
  { name: 'rabbitfur-sakura', ref: 'rabbitfur-sakura.jpg', fabric:
    '以参考图中的毯子面料为准：樱花粉（sakura pink，低饱和浅粉，不偏橘不偏艳）' + RABBITFUR_TEX },
  { name: 'rabbitfur-coffee', ref: 'rabbitfur-coffee.jpg', fabric:
    '以参考图中的毯子面料为准：咖啡色（coffee brown，浓郁暖调咖啡棕，不偏红不发黑）' + RABBITFUR_TEX },
  { name: 'rabbitfur-grey', ref: 'rabbitfur-grey.jpg', fabric:
    '以参考图中的毯子面料为准：浅灰色（light silver grey，浅银灰，不偏蓝不偏黄）' + RABBITFUR_TEX },
  // ── ZIPFLEECE 塔芙绒拉链（3）──
  { name: 'zipfleece-teagreen', ref: 'zipfleece-teagreen.jpg', fabric:
    '以参考图中的毯子面料为准：茶绿色（tea green，低饱和灰调抹茶绿，不偏黄不偏艳）' + ZIPFLEECE_TEX },
  { name: 'zipfleece-grey', ref: 'zipfleece-grey.jpg', fabric:
    '以参考图中的毯子面料为准：中灰色（medium grey，中性灰，不偏蓝不偏棕）' + ZIPFLEECE_TEX },
  { name: 'zipfleece-ivory', ref: 'zipfleece-ivory.jpg', fabric:
    '以参考图中的毯子面料为准：米白色（ivory white，暖调米白，不偏黄）' + ZIPFLEECE_TEX },
  // ── SPRUCE 云杉绒杉影毯（GREEN 已完成，剩 3）──
  { name: 'spruce-cream', ref: 'spruce-cream.jpg', fabric:
    '以参考图中的毯子面料为准：奶白底色（cream white，暖调奶白，不偏黄）' + SPRUCE_TEX },
  { name: 'spruce-coffee', ref: 'spruce-coffee.jpg', fabric:
    '以参考图中的毯子面料为准：咖啡棕底色（coffee brown，暖调中棕，不偏红）' + SPRUCE_TEX },
  { name: 'spruce-khaki', ref: 'spruce-khaki.jpg', fabric:
    '以参考图中的毯子面料为准：浅卡其底色（light khaki，浅燕麦卡其，不偏黄不偏绿）' + SPRUCE_TEX },
  // ── WAFFLEFL 华夫格绒（LILAC 已完成，剩 3）──
  { name: 'wafflefl-latte', ref: 'wafflefl-latte.jpg', fabric:
    '以参考图中的毯子面料为准：乳白咖色（cream latte，奶白带极浅奶咖调，不偏黄）' + WAFFLEFL_TEX },
  { name: 'wafflefl-greige', ref: 'wafflefl-greige.jpg', fabric:
    '以参考图中的毯子面料为准：米灰色（greige，浅灰带米调，不偏蓝）' + WAFFLEFL_TEX },
  { name: 'wafflefl-nude', ref: 'wafflefl-nude.jpg', fabric:
    '以参考图中的毯子面料为准：裸粉色（nude pink，低饱和浅裸粉，不偏橘不偏艳）' + WAFFLEFL_TEX },
  // ── 989320962592 纤维针织毯（5）──
  { name: '989320962592-khaki', ref: '989320962592-khaki.jpg', fabric:
    '以参考图中的毯子面料为准：卡其色（khaki，暖调浅棕卡其，不偏黄不偏绿）' + KNIT995_TEX },
  { name: '989320962592-grey', ref: '989320962592-grey.jpg', fabric:
    COLOR_OVERRIDE + '浅灰色（light grey，中性浅灰，不偏蓝不偏黄）。' + KNIT995_TEX },
  { name: '989320962592-beige', ref: '989320962592-beige.jpg', fabric:
    '以参考图中的毯子面料为准：米色（beige，奶白偏米，不偏黄）' + KNIT995_TEX },
  { name: '989320962592-mint', ref: '989320962592-mint.jpg', fabric:
    COLOR_OVERRIDE + '薄荷绿（mint green，低饱和灰调浅薄荷绿，不偏蓝不偏艳）。' + KNIT995_TEX },
  { name: '989320962592-blue', ref: '989320962592-blue.jpg', fabric:
    '以参考图中的毯子面料为准：雾霾蓝（dusty blue，低饱和灰调蓝，不偏紫不偏艳）' + KNIT995_TEX },
  // ── 891678348176 波西米亚提花针织毯（2）──
  { name: '891678348176-oat', ref: '891678348176-oat.jpg', fabric:
    '以参考图中的毯子面料为准：燕麦白底色（oat white）波西米亚几何提花针织毯，' +
    '焦糖橘与黑色的菱形几何纹样，两端带流苏，纹样与颜色同参考图 1:1 一致，不扭曲纹样、不改色。' },
  { name: '891678348176-ukulele', ref: '891678348176-ukulele.jpg', fabric:
    '以参考图中的毯子面料为准：米白底色波西米亚民族风几何提花针织毯，' +
    '藏青、橘橙与青绿色的锯齿几何纹样，两端带流苏，纹样与颜色同参考图 1:1 一致，不扭曲纹样、不改色。' },
  // ── 单品成族（3）──
  { name: '1071513682043-coffee', ref: '1071513682043-coffee.jpg', fabric:
    '以参考图中的毯子面料为准：米白底色加咖啡色波浪横条纹毯（coffee brown 波浪条纹，不偏红），' +
    '柔软羊羔绒质感，边缘深色缝线锁边、四角带黑色小流苏，纹样与颜色同参考图 1:1 一致，不改色。' },
  { name: '993952872570-maillard', ref: '993952872570-maillard.jpg', fabric:
    '以参考图中的毯子面料为准：美拉德色系雪尼尔大格纹毯（maillard palette：焦糖橘、酒红、灰蓝、橄榄绿与米白相间的大方格），' +
    '雪尼尔绒面质感，格纹与配色同参考图 1:1 一致，不扭曲格纹、不改色。' },
  { name: '1083252788246-red', ref: '1083252788246-red.jpg', fabric:
    '以参考图中的毯子面料为准：红白格纹针织毯（正红色与米白、浅驼色相间的格纹，红色不偏橘不偏暗），' +
    '四角带红色毛球（pom-pom），针织绒面质感，格纹与颜色同参考图 1:1 一致，不扭曲格纹、不改色。' },
  // ── 897719548267 双面绒毯（2）──
  { name: '897719548267-mist', ref: '897719548267-mist.jpg', fabric:
    '以参考图中的毯子面料为准：焦糖橘棕色（caramel rust，暖调橘棕，不偏红不发暗）双面绒毯，' +
    '正面细腻短绒，反面为咖色花呢织纹，绒面质感与颜色同参考图 1:1 一致，不改色。' },
  { name: '897719548267-beige', ref: '897719548267-beige.jpg', fabric:
    '以参考图中的毯子面料为准：浅米色（light beige，浅驼米色，不偏黄）双面绒毯，' +
    '正面细腻短绒，反面深咖花呢织纹，绒面质感与颜色同参考图 1:1 一致，不改色。' },
  // ── 628822447872 纯色针织流苏毯（3）──
  { name: '628822447872-beige', ref: '628822447872-beige.jpg', fabric:
    '以参考图中的毯子面料为准：奶米白色（cream beige，暖调奶白偏米，不偏黄）纯色针织毯，' +
    '细密竖纹针织，两端带长流苏，针织质感与颜色同参考图 1:1 一致，不改色。' },
  { name: '628822447872-khaki', ref: '628822447872-khaki.jpg', fabric:
    '以参考图中的毯子面料为准：浅卡其色（light khaki，燕麦卡其，不偏绿不偏黄）纯色针织毯，' +
    '细密竖纹针织，两端带长流苏，针织质感与颜色同参考图 1:1 一致，不改色。' },
  { name: '628822447872-darkgrey', ref: '628822447872-darkgrey.jpg', fabric:
    '以参考图中的毯子面料为准：深灰色（dark grey，中性深灰，不偏蓝不偏棕）纯色针织毯，' +
    '细密竖纹针织，两端带长流苏，针织质感与颜色同参考图 1:1 一致，不改色。' },
];

const SCENE_A2B =
  '场景：现代简约客厅一角，一张浅燕麦色亚麻布艺单人沙发椅（带扶手），' +
  '画面右边缘只露出浅原木边几的一小角（上面一杯咖啡和一本翻开的书各只露出一半），' +
  '画面最右边缘露出琴叶榕的一两片叶子，背景上方只留一小条干净的米白色墙面。' +
  '毯子的搭法（最高优先级）：毯子从沙发椅靠背顶端搭入——毯子覆盖整个靠背正面，' +
  '在座面上形成柔软蓬松的自然大褶皱，一端垂过一侧扶手或座面前沿，' +
  '充分展示毯子的厚度、垂坠感和绒面光泽；半整理状态，不刻意拉平。' +
  '占图比要求（最高优先级）：近景特写构图，毯子铺满画面的 75% 以上，是画面的绝对主体；' +
  '沙发椅只在毯子边缘露出少量扶手和框架，环境元素（边几、绿植、墙面）全部退到画面边缘，只占很小比例；' +
  '参考电商爆款主图的满屏毯子构图。' +
  '清晨低角度自然光从画面左侧白纱帘透入，在毯面上形成柔和 directional 光影，绒面有细腻的光泽明暗变化。' +
  '白平衡中性准确：毯子颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/亚麻道具。' +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考毯子的颜色和材质。' +
  '镜头机位：斜前方 45° 中近距离视角竖构图，镜头贴近沙发椅，同时看清靠背、座面上的毯子走向和垂坠；' +
  '画面下方可见一小条浅原木色地板。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

async function gen(p) {
  const refBuf = fs.readFileSync(path.join(REFS, p.ref));
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: p.fabric + SCENE_A2B,
      image: `data:image/jpeg;base64,${refBuf.toString('base64')}`,
      response_format: 'url',
      size: '1536x2048',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
  const out = `main-a2b-blanket-${p.name}.jpg`;
  fs.writeFileSync(path.join(STAGING, out), buf);
  console.log(`已保存 ${out} (${buf.length} bytes)`);
}

(async () => {
  const start = parseInt(process.argv[2] || '0', 10);
  const count = parseInt(process.argv[3] || String(PRODUCTS.length), 10);
  const slice = PRODUCTS.slice(start, start + count);
  console.log(`本批: ${slice.length} 张 (从第 ${start + 1} 张起，共 ${PRODUCTS.length} 张)`);
  for (const p of slice) {
    const out = path.join(STAGING, `main-a2b-blanket-${p.name}.jpg`);
    if (fs.existsSync(out) && fs.statSync(out).size > 50000) {
      console.log(`跳过已存在: ${p.name}`);
      continue;
    }
    try {
      await gen(p);
    } catch (e) {
      console.error(`失败 ${p.name}: ${e.message}`);
    }
  }
  console.log('本批结束');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
