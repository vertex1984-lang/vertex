/**
 * seedream-main-blanket-bc-samples.js — Blanket 主图方案B/方案C样图（2026-11-10）
 * 同一产品 RABBITFUR-CAMEL（驼色仿兔毛长毛绒），与方案A样图对照。
 * 方案B：沙发/休闲椅场景（脱离卧室签名，生活感）
 * 方案C：正俯拍平铺 + 折角（中性背景，电商风）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'staging', 'ref-rabbitfur-camel.jpg');

const FABRIC =
  '以参考图中的毯子面料为准：驼色（camel，温暖中性的浅棕驼色，不偏黄不偏红）仿兔毛长毛绒毯子，' +
  '绒毛细密蓬松、柔软有光泽，绒面质感与颜色同参考图 1:1 一致，不改色、不改变绒毛细度。';

const PROMPT_B =
  FABRIC +
  '场景：现代简约客厅一角，一张浅燕麦色亚麻布艺休闲单人沙发椅，浅原木边几，' +
  '边几上放一杯咖啡和一本翻开的书，旁边一盆琴叶榕绿植，背景是干净的米白色墙面和一小条浅原木踢脚线。' +
  '毯子的搭法：毯子随意自然地搭在沙发椅的扶手和座面上——一端搭过扶手垂落，' +
  '中段在座面形成柔软蓬松的自然褶皱，另一端垂到座面前沿，展示长毛绒的垂坠感和厚度。' +
  '毯子是画面中唯一的彩色商品元素，占画面 40% 左右，是绝对视觉主体。' +
  '清晨低角度自然光从画面左侧白纱帘透入，在毯面上形成柔和 directional 光影，绒面有细腻的光泽明暗变化。' +
  '白平衡中性准确：毯子颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/亚麻道具。' +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考毯子的颜色和材质。' +
  '镜头机位：斜前方 45° 中高位视角竖构图，看清座面与扶手上毯子的垂坠走向；' +
  '画面下方可见一小条浅原木色地板。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

const PROMPT_C =
  FABRIC +
  '电商产品平铺图：毯子完整平铺在干净的中性暖白色背景上（细腻米白亚麻质感底布，不是纯白冷底），' +
  '毯子大致呈长方形竖向摆放，占画面 70-80%；' +
  '毯子右下角的一角向内侧翻折，露出反面同色系略短的绒面，展示正反面质感差异；' +
  '毯面保留自然柔和的使用褶皱，不刻意拉平，边缘轮廓清晰完整不被裁切。' +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考毯子的颜色和材质。' +
  '镜头机位：正上方 90° 垂直俯拍，相机与毯面平行，无透视变形。' +
  '光线：左上方柔和均匀的 daylight，轻微 directional 阴影让绒面立体感可见，无强烈明暗反差。' +
  '白平衡中性准确：毯子颜色与参考图 1:1 一致，不得偏黄。' +
  '画面中只有毯子，无其他任何道具、无手、无文字。' +
  '专业电商产品摄影，照片级真实感，高清细节，无文字无水印无 logo。';

async function gen(prompt, out) {
  const b64 = fs.readFileSync(SRC).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt,
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
  fs.writeFileSync(path.join(ROOT, 'public', 'images', 'staging', out), buf);
  console.log(`已保存 ${out} (${buf.length} bytes)`);
}

(async () => {
  await gen(PROMPT_B, 'main-b-blanket-rabbitfur-camel.jpg');
  await gen(PROMPT_C, 'main-c2-blanket-rabbitfur-camel.jpg');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
