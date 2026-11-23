/**
 * seedream-main-a2-blanket-sample.js — Blanket 主图改进方案 A2 样图（2026-11-10）
 * 产品：RABBITFUR-CAMEL（驼色仿兔毛长毛绒）
 * A2 与 B 的区别：沙发椅为主场，毯子从靠背顶端搭入（非扶手斜搭），
 * 毯面占图比 ≥50%（B 为 40%），机位定死斜前方 45° 中高位竖构图。
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'staging', 'ref-rabbitfur-camel.jpg');

const FABRIC =
  '以参考图中的毯子面料为准：驼色（camel，温暖中性的浅棕驼色，不偏黄不偏红）仿兔毛长毛绒毯子，' +
  '绒毛细密蓬松、柔软有光泽，绒面质感与颜色同参考图 1:1 一致，不改色、不改变绒毛细度。';

const PROMPT_A2 =
  FABRIC +
  '场景：现代简约客厅一角，一张浅燕麦色亚麻布艺单人沙发椅（带扶手），' +
  '画面右边缘只露出浅原木边几的一小角（上面一杯咖啡和一本翻开的书各只露出一半），' +
  '画面最右边缘露出琴叶榕的一两片叶子，背景上方只留一小条干净的米白色墙面。' +
  '毯子的搭法（最高优先级）：毯子从沙发椅靠背顶端搭入——毯子覆盖整个靠背正面，' +
  '在座面上形成柔软蓬松的自然大褶皱，一端垂过一侧扶手或座面前沿，' +
  '充分展示长毛绒毯子的厚度、垂坠感和绒面光泽；半整理状态，不刻意拉平。' +
  '占图比要求（最高优先级）：近景特写构图，毯子铺满画面的 75% 以上，是画面的绝对主体；' +
  '沙发椅只在毯子边缘露出少量扶手和框架，环境元素（边几、绿植、墙面）全部退到画面边缘，只占很小比例；' +
  '参考电商爆款主图的满屏毯子构图。' +
  '清晨低角度自然光从画面左侧白纱帘透入，在毯面上形成柔和 directional 光影，绒面有细腻的光泽明暗变化。' +
  '白平衡中性准确：毯子颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/亚麻道具。' +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考毯子的颜色和材质。' +
  '镜头机位：斜前方 45° 中近距离视角竖构图，镜头贴近沙发椅，同时看清靠背、座面上的毯子走向和垂坠；' +
  '画面下方可见一小条浅原木色地板。' +
  '专业室内家居摄影，照片级真实感，高清细节，无文字无水印无 logo。';

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
  await gen(PROMPT_A2, 'main-a2b-blanket-rabbitfur-camel.jpg');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
