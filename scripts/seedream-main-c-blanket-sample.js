/**
 * seedream-main-c-blanket-sample.js — Blanket（毯子）主图方案A样图（2026-11-10）
 * 与其他 bedding 分类同一签名（场景/机位/光线/道具），差异铺法：
 * 床面全部中性白，毯子是画面唯一彩色商品元素——斜搭床尾 1/3，一角垂落床沿。
 * 样图产品：RABBITFUR-CAMEL（驼色仿兔毛长毛绒）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'staging', 'ref-rabbitfur-camel.jpg');

const PROMPT =
  '以参考图中的毯子面料为准：驼色（camel，温暖中性的浅棕驼色，不偏黄不偏红）仿兔毛长毛绒毯子，' +
  '绒毛细密蓬松、柔软有光泽，绒面质感与颜色同参考图 1:1 一致，不改色、不改变绒毛细度。' +
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床的铺法（本分类的关键识别）：床面全部中性白——白色床笠包床垫，白色床单铺平，' +
  '没有被套、没有蓬松被体；两个套着纯白色枕套的枕头立靠床头板，只作背景不是主体。' +
  '毯子是画面中唯一的彩色商品元素：斜向搭在床尾约三分之一处，横向覆盖床面宽度的大半，' +
  '毯子的一角自然垂落到床沿之外，展示柔软的垂坠感；毯面保持半整理的自然褶皱，' +
  '绒面在晨光下有柔和的光泽明暗变化，能看清长毛绒的质感。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；一侧床头柜上放一杯咖啡和一本翻开的书。' +
  '清晨低角度自然光从左侧白纱帘透入，在白色床面和毯面上形成柔和 directional 光影。' +
  '白平衡中性准确：毯子颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编道具。' +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考毯子的颜色和材质。' +
  '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
  '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
  '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
  '床面和毯面占画面 75% 以上，其中毯面约占画面 25-35%；画面底部可见一小条地板。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

(async () => {
  const b64 = fs.readFileSync(SRC).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: PROMPT,
      image: `data:image/jpeg;base64,${b64}`,
      response_format: 'url',
      size: '1536x2048',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const buf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
  fs.writeFileSync(path.join(ROOT, 'public', 'images', 'staging', 'main-c-blanket-rabbitfur-camel.jpg'), buf);
  console.log(`已保存 main-c-blanket-rabbitfur-camel.jpg (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
