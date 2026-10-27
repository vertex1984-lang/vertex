/**
 * seedream-hero-editorial-ghi.js — 首页 Hero 暗调大片候选 G/H/I（seedream 5.0 pro，2026-10-27）
 * 用户定：整体颜色深一点但仍暖调不死黑；仅移动端 1152x2048。
 * G 蓝调时刻 / H 琥珀暮光 / I 炭灰影棚。
 * 硬约束：暗调暖色、无人物无文字、中上部或中部留文案可读区（深色底配白字）。
 * 输出：public/images/staging/hero-editorial-{g,h,i}-mobile.jpg
 * 用法: ARK_API_KEY=$(cat scripts/.ark-api-key-2) node scripts/seedream-hero-editorial-ghi.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const SEED = 73100;

const QUALITY =
  '专业家居生活摄影，杂志大片级画质，8K 超高清，超写实真实物理材质，布料褶皱、亚麻纹理、木与石的肌理细节清晰；光线是画面主角之一。' +
  '无人物、无文字、无水印、无 logo、无图标按钮界面元素；规避高饱和色彩、塑料 CGI 质感、平涂死黑阴影（暗部必须保留层次与细节）、扭曲透视、凌乱脏感。';

const M_COMP = '竖幅 9:16 竖版构图（独立重新构图，不是横版裁切）：取景紧凑，床体占画面约 75%-85%，画面中上部为低细节的深色柔和区域（墙面、夜色或光影渐变）供后期压白色文字，画面丰满有氛围。';

const SCENES = {
  g: M_COMP + 'G方向·蓝调时刻：傍晚天刚黑的"蓝调时刻"，一整面落地窗外是深邃的蓝灰色暮色与朦胧远山/城市微光，室内只开一盏暖琥珀色落地灯，光晕温柔地落在床上。纯白色床品在暖光里微微发金，被子掀开一半褶皱慵懒，床尾搭深燕麦色针织毯。深蓝暮色与暖黄灯光的强烈冷暖对比，木地板沉在暗部。氛围安静治愈、像电影静帧，"夜晚回家钻进被窝"的归属感。',
  h: M_COMP + 'H方向·琥珀暮光：夕阳最后十分钟，一道浓郁的金琥珀色阳光透过百叶或高窗斜切进深色卧室，在暖赭石色墙面和床品上投下长长的条状光影，明暗对比强烈如伦勃朗用光。床上是奶油白+驼色多层床品，受光处金亮、背光处沉进暖褐阴影。深色胡桃木地板，空气里有细微光尘。电影感、油画感、浓郁而克制，像时尚杂志的秋日大片。',
  i: M_COMP + 'I方向·炭灰影棚：影棚级暗调布景——床像艺术装置置于深炭灰褐（dark greige）无缝背景前，无窗无墙线，只有一束大型柔光从顶侧打下，把床品的褶皱雕出丰富的明暗雕塑感。床品是燕麦色、炭灰、奶白多层叠搭（蓬松羽绒被、粗针织毯、亚麻枕）。旁边一把深色木质单椅随意搭着亚麻衣物。氛围克制高级、神秘安静，像 The Row 或 Jil Sander 的暗调时尚 campaign 主视觉。',
};

async function gen(prompt, size, dest, seed) {
  console.log(`调用 seedream 5.0 pro: ${path.basename(dest)}（${size}）`);
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed,
      prompt,
      response_format: 'url',
      size,
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const imgUrl = data.data?.[0]?.url;
  if (!imgUrl) throw new Error('无结果图: ' + JSON.stringify(data).slice(0, 500));
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) throw new Error(`结果图下载失败: HTTP ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 (${buf.length} bytes), size=${data.data[0].size}, seed=${seed}`);
}

(async () => {
  let s = SEED;
  for (const k of ['g', 'h', 'i']) {
    await gen(SCENES[k] + QUALITY, '1152x2048', path.join(OUT, `hero-editorial-${k}-mobile.jpg`), s++);
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
