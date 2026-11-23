/**
 * seedream-main-a2b-blanket-2more.js — Blanket 主图 A2b 方案再出 2 款样图（2026-11-10）
 * 同一变体组不同尺寸共用一张主图，每变体组只生成一张。
 * 场景与 main-a2b-blanket-rabbitfur-camel.jpg 完全一致（沙发椅近景、毯面 ≥75%）。
 * 本批：SPRUCE-GREEN（云杉绒绿）/ WAFFLEFL-LILAC（淡紫华夫格绒）
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key-2', 'utf8').trim();
const ROOT = path.join(__dirname, '..');
const STAGING = path.join(ROOT, 'public', 'images', 'staging');

const PRODUCTS = [
  {
    name: 'spruce-green',
    ref: 'https://cbu01.alicdn.com/img/ibank/O1CN013gEUyT1kvioIhg3DW_!!2217862214746-0-cib.jpg',
    fabric:
      '以参考图中的毯子面料为准：云杉绿色（spruce green，低饱和灰调深绿，不偏蓝不偏黄）天鹅绒短绒毯子，' +
      '绒毛短密平整、有细腻的丝绒光泽，绒面质感与颜色同参考图 1:1 一致，不改色。',
  },
  {
    name: 'wafflefl-lilac',
    ref: 'https://cbu01.alicdn.com/img/ibank/O1CN01u19FTf1E6MhNseL9z_!!2219766850302-0-cib.jpg',
    fabric:
      '以参考图中的毯子面料为准：淡紫丁香色（lilac，低饱和浅紫，不偏粉不偏灰）华夫格绒毯，' +
      '表面是规则立体的华夫格（小方格）织纹，格纹间距与参考图 1:1 一致，不扭曲格纹、不改色。',
  },
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

async function fetchBuf(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://detail.1688.com/' } });
  if (!res.ok) throw new Error(`下载参考图失败 ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function gen(p) {
  const refBuf = await fetchBuf(p.ref);
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
  for (const p of PRODUCTS) await gen(p);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
