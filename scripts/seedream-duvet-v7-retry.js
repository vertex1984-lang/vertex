/**
 * seedream-duvet-v7-retry.js — Duvet Covers v7 重出 2 张（2026-11-01）
 * 原因：
 *  - percalejac-haze：条纹扭曲变形、宽窄不一 → 强化"宽条纹横平竖直、宽度均匀、不随褶皱扭曲"
 *  - pompom4-vine：读成平面提花印花，缺压花绒光泽层次 → 强化"天鹅绒短绒面、压花凹凸明暗"
 * 场景/机位与 seedream-duvet-v7-samples.js 完全一致，仅改面料描述。
 * v7c 追加：床上只允许纯白色枕头，禁止出现任何与被套同花纹/条纹的枕套、抱枕、靠垫。
 * 输出：public/images/staging/main-c-duvet-<name>-v7c.jpg（1536x2048）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

const PRODUCTS = [
  {
    asin: 'PERCALEJAC-HAZE-DUVET',
    name: 'percalejac-haze',
    fabric:
      '雾蓝/奶白宽条纹提花贡缎被套（haze，灰调雾蓝与奶白相间的宽条纹、提花织物质感），条纹与颜色与参考图 1:1 一致。' +
      '条纹要求（最高优先级）：所有条纹必须横平竖直、走向与床的长轴平行、每条宽度完全均匀一致、间距规律；' +
      '条纹是织在布面上的平面织纹，必须严格保持直线，绝对不能随布面褶皱扭曲、弯折、变形或断续。',
  },
  {
    asin: 'POMPOM4-VINE-DUVET',
    name: 'pompom4-vine',
    fabric:
      '藤蔓纹压花天鹅绒被套（embossed velvet），颜色纹样与参考图 1:1 一致。' +
      '质感要求（最高优先级）：这是真正的天鹅绒面料——布面覆盖细密短绒，绒毛在侧光下有柔和的丝绒光泽和明暗渐变；' +
      '藤蔓纹样是压花工艺在绒面上压出的凹凸纹理，凹陷处绒光变暗、凸起处绒光发亮，形成立体的明暗光泽层次；' +
      '绝对不是平面印花、不是普通棉布的提花图案——必须一眼看出绒面质感；' +
      '绒毛要短而密，有明显的倒顺毛光泽变化（同一块布上因绒毛倒向不同呈现明暗差异）。',
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
  '其余床品：白色床单、两个纯白色枕头；床上不要出现任何毯子、盖毯或毛毯；' +
  '严格禁止出现任何与被套同花纹/同条纹/同颜色的枕套、抱枕、靠垫或装饰枕——全床只有被套有图案，枕头必须纯白。' +
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
    const out = path.join(ROOT, 'public', 'images', 'staging', `main-c-duvet-${p.name}-v7c.jpg`);
    fs.writeFileSync(out, buf);
    fs.copyFileSync(out, path.join(ROOT, 'out', 'images', 'staging', `main-c-duvet-${p.name}-v7c.jpg`));
    console.log(`[${p.name}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
