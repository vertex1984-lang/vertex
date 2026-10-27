/**
 * seedream-hero-editorial-ef.js — 首页 Hero 大片候选 E/F（seedream 5.0 pro，2026-10-27）
 * E 雨天窗边（赖床感种草）/ F 天窗流云（概念大片）；仅移动端 1152x2048。
 * 硬约束：奶油暖调、无人物无文字、中下部留文案区。
 * 输出：public/images/staging/hero-editorial-{e,f}-mobile.jpg
 * 用法: node scripts/seedream-hero-editorial-ef.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const SEED = 61930;

const QUALITY =
  '专业家居生活摄影，杂志大片级画质，8K 超高清，超写实真实物理材质，布料褶皱、亚麻纹理、木与石的肌理细节清晰；低饱和暖奶油调，光线是画面主角之一。' +
  '无人物、无文字、无水印、无 logo、无图标按钮界面元素；规避高饱和色彩、塑料 CGI 质感、平涂死黑阴影、扭曲透视、凌乱脏感。';

const M_COMP = '竖幅 9:16 竖版构图（独立重新构图，不是横版裁切）：取景紧凑，床体占画面约 80%-85%，中下部为床品或地面等低细节区域供后期排版，视觉重心落在床与光影上，画面丰满无大面积空白。';

const SCENES = {
  e: M_COMP + 'E方向·雨天窗边：一整面落地玻璃窗，窗外是下雨的清晨——玻璃上布满细腻雨滴和缓缓滑落的水痕，窗外是灰蓝色的雨幕和虚化朦胧的绿色树影。窗前一张床，纯白色亚麻与棉质床品蓬松柔软，被子掀开一半堆出自然慵懒的褶皱，枕头微微凹陷，像周末刚睡醒赖床的早晨。床头一盏暖黄色小灯散出柔和光晕，室内暖光与窗外冷灰蓝雨幕形成治愈系的冷暖对比。木地板，床尾搭一条燕麦色针织毯。电影感氛围，浅景深，安静治愈，像 Cereal/Kinfolk 杂志的雨天专题大片。',
  f: '竖幅 9:16 竖版构图（独立重新构图）：仰视视角的概念构图——画面下方约三分之一是一张床的上缘：纯白色蓬松床品、枕头与被子的柔软边缘入镜，质感细腻。画面主体是上方一整扇朝天的矩形大天窗，天窗框住流动的白云和淡淡的蓝，云层有缓慢流动感与层次。天窗四周是暖白色微水泥吊顶，边缘一圈柔和的晨光环晕。极简、安静、超现实的梦境氛围，像杂志封面或品牌 campaign 主视觉；画面下方床品区域为低细节留白供后期排版。',
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
  for (const k of ['e', 'f']) {
    await gen(SCENES[k] + QUALITY, '1152x2048', path.join(OUT, `hero-editorial-${k}-mobile.jpg`), s++);
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
