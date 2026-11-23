/**
 * seedream-main-c-blanket-2more.js — Blanket 方案A再出 2 款样图（2026-11-10）
 * 同一变体组不同尺寸共用一张主图，每变体组只生成一张。
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

const SCENE =
  '现代简约卧室，浅原木+藤编床头板，床头两侧浅原木床头柜。' +
  '床的铺法（本分类的关键识别）：床面全部中性白——白色床笠包床垫，白色床单铺平，' +
  '没有被套、没有蓬松被体；两个套着纯白色枕套的枕头立靠床头板，只作背景不是主体。' +
  '毯子是画面中唯一的彩色商品元素：斜向搭在床尾约三分之一处，横向覆盖床面宽度的大半，' +
  '毯子的一角自然垂落到床沿之外，展示柔软的垂坠感；毯面保持半整理的自然褶皱。' +
  '道具站位固定：画面左下角一盆琴叶榕绿植；一侧床头柜上放一杯咖啡和一本翻开的书。' +
  '清晨低角度自然光从左侧白纱帘透入，在白色床面和毯面上形成柔和 directional 光影。' +
  '白平衡中性准确：毯子颜色与参考图 1:1 一致，画面整体不得偏黄；温暖感只来自晨光方向和原木/藤编道具。' +
  '构图要求（最高优先级）：忽略参考图的构图和机位，仅参考毯子的颜色和材质。' +
  '镜头机位：55° 高机位纵向俯拍——相机位于床尾右上方高处，沿床身长度方向朝床头俯拍，接近垂直俯视床面。' +
  '方向锁定：床头板在画面左上方、只占顶部一条边，床尾在画面右下方，床身从左上向右下对角延伸（与系列其他主图完全同向，不得镜像）。' +
  '枕头从高位俯视看到完整枕面；看不到墙面、窗户和壁灯。' +
  '床面和毯面占画面 75% 以上，其中毯面约占画面 25-35%；画面底部可见一小条地板。' +
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
      prompt: p.fabric + SCENE,
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
  const out = `main-c-blanket-${p.name}.jpg`;
  fs.writeFileSync(path.join(STAGING, out), buf);
  console.log(`已保存 ${out} (${buf.length} bytes)`);
}

(async () => {
  for (const p of PRODUCTS) await gen(p);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
