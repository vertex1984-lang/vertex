/**
 * seedream-duvet-v8-lighting.js — Duvet Covers 主图 v8：光线 v2 首批 2 款（2026-11-01）
 * 变更：废"晨光右侧低角度斜射"→ 大面积柔光均匀铺床面 + 极轻微暖调方向性（无强反差）。
 *   禁止局部过曝高亮、大片投影、阳光光斑——产品任何区域颜色质感清晰可辨。
 * POMPOM4-VINE 特别要求（用户定）：
 *   A面 = 奶白底藤蔓压花天鹅绒 + 棕色绒球（pom-pom）镶边；B面 = 墨绿色纯色天鹅绒。
 *   翻折/垂落处露出的反面必须是墨绿色，不是 A 面藤蔓纹；必须看出绒面质感。
 * 输出：public/images/staging/main-c-duvet-<name>-v8c.jpg（1536x2048）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');

const PRODUCTS = [
  {
    asin: 'POMPOM4-VINE-DUVET',
    name: 'pompom4-vine',
    ref: '1-3x4.webp',
    fabric:
      '藤蔓纹压花天鹅绒被套，AB 双面不同色（最高优先级，严格区分）：' +
      'A面（朝上主面）= 奶白/象牙色底的藤蔓压花天鹅绒——细密短绒面，压花凹凸在柔光下有柔和的丝绒明暗光泽层次，绒毛细密有倒顺毛光泽变化，绝不是平面印花棉布；' +
      '被套边缘缝有棕色绒球（pom-pom）镶边，绒球小而密、沿边缘整齐排列；' +
      'B面（反面/朝下面）= 墨绿色纯色天鹅绒——与 A 面完全不同：凡是被套翻折、边缘掀起、垂落床沿处露出的反面，都必须是纯墨绿色绒面，绝不能出现藤蔓纹或奶白色反面；' +
      'B面墨绿色只允许在被套边缘翻折/垂落处以窄条形式露出（不超过被套可见面积的 15%），' +
      '严格禁止形成任何枕形、方形、独立的块状结构——床上只允许有两个纯白色枕头，绝不能出现墨绿色或带绒球的枕头/抱枕/靠垫；' +
      '特别注意：参考图中出现的墨绿色绒球枕头仅用于展示 B 面的颜色和绒感，' +
      '生成画面中绝对不要复制这个枕头——不要任何墨绿色枕形物体，墨绿色只能是被套布料翻折露出的反面；' +
      '绒面质感（最高优先级）：A 面必须是明显的天鹅绒——短密绒毛覆盖、压花凹陷处绒光变暗、凸起处发亮、倒顺毛产生明暗光泽变化，一眼看出是绒不是棉；' +
      '颜色纹样与参考图 1:1 一致。',
  },
  {
    asin: 'PERCALE-SKY-DUVET',
    name: 'percale-sky',
    ref: '1.webp',
    fabric:
      '天空蓝（sky blue，干净的浅天蓝不偏灰不偏紫）纯棉贡缎被套，布面平滑干爽有细腻棉感，颜色与参考图 1:1 一致。',
  },
];

const scenePrompt = (fabric) =>
  '以参考图中的被套面料为准：' + fabric +
  '构图要求（最高优先级，必须严格遵守）：忽略参考图的构图和机位，仅参考被套的颜色和材质。' +
  '机位：相机固定在床尾右角高处，约 55° 斜向朝床头俯拍；' +
  '床的长轴沿画面对角线——床尾在画面左下方、床头在画面上方；' +
  '画面顶部露出一条浅原木色床头板边，两个套着纯白色枕套的枕头在画面上方、俯视见完整枕面；' +
  '一盆绿植固定在画面右上角的地板上；画面右缘和左下角可见少量木地板；看不到窗户/壁灯/床头柜。' +
  '主体（核心——一床"布套+被芯"的被子，不是绗缝被）：' +
  '被套是一层平整的布料外壳，被芯的蓬松从布套里面把布面柔和地撑起来——' +
  '被面整体平整微鼓，中段和四角有自然的饱满鼓胀，被体边缘带重量感垂落床沿；' +
  '被子必须有清晰的厚度和体积感（像装了大豆被/羽绒被芯的被套），绝不能平贴床面像一条薄毯子或盖毯；' +
  '布面绝对没有绗缝、没有分块车线、没有羽绒被的格子纹路；' +
  '布面与被芯之间有轻微的松动——表面有几道自然的大波浪褶和柔和垂坠；' +
  '被套四周可见整齐的缝线包边，四个角被被芯撑起、角部轮廓分明。' +
  '整体状态：半整理、有生活感——表面平整微蓬、边缘垂坠自然；' +
  '不要把被子揉成一团，不要刻意翻折被面，不要露出床单被芯的夹层。' +
  '其余床品：白色床单、两个纯白色枕头；床上不要出现任何毯子、盖毯或毛毯；' +
  '严格禁止出现任何与被套同花纹/同颜色的枕套、抱枕、靠垫——全床只有被套有图案，枕头必须纯白。' +
  '被子 + 枕头占画面 75% 以上，是绝对主体。' +
  '光线（本版核心变更）：大面积柔光（阴天北向窗光/柔光箱质感）从上方均匀铺满整张床，' +
  '床面各处照度基本一致——被子中央与四角、枕头与床尾没有强烈明暗差；' +
  '只允许极轻微的暖调方向性，不产生强反差；' +
  '严格禁止：局部过曝高亮、大片投影、阳光光斑、窗框影子落在床品上；' +
  '产品任何区域的颜色和面料质感都必须清晰可辨，褶皱明暗只来自布料自身形态；' +
  '白平衡中性准确，被套颜色与参考图 1:1 一致，画面整体不偏黄，暖调只来自木地板等暖色道具。' +
  '专业家居纺织品质感摄影，照片级真实感，高清细节，无文字无水印无 logo。';

(async () => {
  for (const p of PRODUCTS) {
    const src = path.join(ROOT, 'public', 'images', 'products', p.asin, p.ref);
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
    const out = path.join(ROOT, 'public', 'images', 'staging', `main-c-duvet-${p.name}-v8c.jpg`);
    fs.writeFileSync(out, buf);
    fs.copyFileSync(out, path.join(ROOT, 'out', 'images', 'staging', `main-c-duvet-${p.name}-v8c.jpg`));
    console.log(`[${p.name}] 已保存 (${buf.length} bytes)`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
