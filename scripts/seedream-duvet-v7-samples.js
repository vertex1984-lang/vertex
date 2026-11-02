/**
 * seedream-duvet-v7-samples.js — Duvet Covers 主图 v7 样图（2026-11-01，全新指令）
 * v7 重拟背景：v6 被用户判"看起来是 comforter（绗缝被），不是 duvet cover 里塞 insert"。
 * v7 主体定义：平整的布套外壳 + 被芯从里面撑出的柔和鼓胀——
 *   布面无绗缝/无分块车线、边缘有被套缝线边、布面与被芯间有轻微松动的大波浪褶。
 * 机位/光线/道具维持用户已确认的灰 v4 方向，不重拟。
 * 输出：public/images/staging/main-c-duvet-<name>-v7.jpg（1536x2048）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

const PRODUCTS = [
  {
    asin: 'LINEN3-CHARCOAL-DUVET',
    name: 'linen3-charcoal',
    fabric:
      '炭灰色（charcoal，深灰不偏蓝）水洗亚麻被套，亚麻特有的竹节纹理和自然垂坠感，颜色与参考图 1:1 一致。',
  },
  {
    asin: 'LINEN3-DUSTYBLUE-DUVET',
    name: 'linen3-dustyblue',
    fabric:
      '灰蓝色（dusty blue，低饱和灰调雾霾蓝）水洗亚麻被套，亚麻特有的竹节纹理和自然垂坠感，颜色与参考图 1:1 一致。',
  },
  {
    asin: 'PERCALE-MIST-DUVET',
    name: 'percale-mist',
    fabric:
      '薄雾色（mist，极浅的冷调灰白）纯棉贡缎被套，布面平滑干爽，颜色与参考图 1:1 一致。',
  },
  {
    asin: 'PERCALE-NUDE-DUVET',
    name: 'percale-nude',
    fabric:
      '裸肤色（nude，低饱和暖调浅裸粉米）纯棉贡缎被套，布面平滑干爽，颜色与参考图 1:1 一致。',
  },
  {
    asin: 'PERCALE-COCONUT-QUEEN-DUVET',
    name: 'percale-coconut',
    fabric:
      '椰白色（coconut white，干净的暖白色）纯棉贡缎被套，布面平滑干爽，颜色与参考图 1:1 一致。',
  },
  {
    asin: 'PERCALEJAC-HAZE-DUVET',
    name: 'percalejac-haze',
    fabric:
      '雾蓝/奶白宽条纹提花贡缎被套（haze，灰调雾蓝与奶白相间的宽条纹、提花织物质感），条纹与颜色与参考图 1:1 一致，不扭曲条纹。',
  },
  {
    asin: 'PERCALEPATCH-STONE-DUVET',
    name: 'percalepatch-stone',
    fabric:
      '石色（stone，暖调浅灰米）拼接提花贡缎被套，规则的几何拼接提花纹理、同色系深浅交织，纹理与颜色与参考图 1:1 一致，不扭曲纹样。',
  },
  {
    asin: 'POMPOM4-VINE-DUVET',
    name: 'pompom4-vine',
    fabric:
      '藤蔓纹压花天鹅绒被套（embossed velvet，绒面压出规则藤蔓纹样、绒毛细密有光泽层次），颜色纹样与参考图 1:1 一致。',
  },
  {
    asin: 'VELJAC-IVORY-DUVET',
    name: 'veljac-ivory',
    fabric:
      '象牙白色提花绒被套（双面绒提花，暖调奶白色绒面、提花暗纹有细腻光泽层次），颜色纹样与参考图 1:1 一致。',
  },
  {
    asin: 'WASHJAC-CREAM-DUVET',
    name: 'washjac-cream',
    fabric:
      '奶白色暗纹提花水洗棉被套（cream，柔和奶白、暗纹提花低调有织物质感、水洗棉自然微皱），颜色纹样与参考图 1:1 一致。',
  },
];

const scenePrompt = (fabric) =>
  '以参考图中的被套面料为准：' + fabric +
  '构图要求（最高优先级，必须严格遵守）：忽略参考图的构图和机位，仅参考被套的颜色和材质。' +
  '机位：相机固定在床尾右角高处，约 55° 斜向朝床头俯拍；' +
  '床的长轴沿画面对角线——床尾在画面左下方、床头在画面上方；' +
  '画面顶部露出一条浅原木色床头板边，两个套着纯白色枕套的枕头在画面上方、俯视见完整枕面；' +
  '一盆绿植固定在画面右上角的地板上；画面右缘和左下角可见少量木地板；看不到窗户/壁灯/床头柜。' +
  '主体（本指令的核心——一床"布套+被芯"的被子，不是绗缝被）：' +
  '床上铺着一床有厚度的被子：被套是一层平整的布料外壳，被芯的蓬松从布套里面把布面柔和地撑起来——' +
  '被面整体平整微鼓，中段和四角有自然的饱满鼓胀，被体边缘带重量感垂落床沿；' +
  '布面是光滑的布料质感：绝对没有绗缝、没有分块车线、没有羽绒被的格子纹路；' +
  '布面与被芯之间有轻微的松动——表面有几道自然的大波浪褶和柔和垂坠，' +
  '让人看出"这是一层套在蓬松被芯外面的布套"；' +
  '被套四周可见整齐的缝线包边，四个角被被芯撑起、角部轮廓分明。' +
  '整体状态：半整理、有生活感，像酒店床上刚铺好的 duvet——表面平整微蓬、边缘垂坠自然；' +
  '不要把被子揉成一团，不要刻意翻折被面，不要露出床单被芯的夹层。' +
  '其余床品：白色床单、两个纯白色枕头；床上不要出现任何毯子、盖毯或毛毯。' +
  '被子 + 枕头占画面 75% 以上，是绝对主体。' +
  '光线：晨光从画面右侧低角度斜射，被面柔和的鼓胀在侧光下形成细腻的明暗体积感；' +
  '白平衡中性准确：被套颜色与参考图 1:1 一致，画面整体不得偏黄。' +
  '专业家居纺织品质感摄影，照片级真实感，高清细节，无文字无水印无 logo。';

(async () => {
  for (const p of PRODUCTS) {
    const src = path.join(ROOT, 'public', 'images', 'products', p.asin, '1.webp');
    const b64 = fs.readFileSync(src).toString('base64');
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-pro-260628',
        prompt: scenePrompt(p.fabric),
        image: `data:image/webp;base64,${b64}`,
        response_format: 'url',
        size: '1536x2048',
        stream: false,
        watermark: false,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      console.error(`[${p.name}] API 失败:`, JSON.stringify(data).slice(0, 300));
      continue;
    }
    const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
    const out = path.join(ROOT, 'public', 'images', 'staging', `main-c-duvet-${p.name}-v7.jpg`);
    fs.writeFileSync(out, buf);
    fs.copyFileSync(out, path.join(ROOT, 'out', 'images', 'staging', `main-c-duvet-${p.name}-v7.jpg`));
    console.log(`[${p.name}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
