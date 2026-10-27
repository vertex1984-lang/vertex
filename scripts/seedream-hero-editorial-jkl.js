/**
 * seedream-hero-editorial-jkl.js — 首页 Hero 简洁明快大片候选 J/K/L（seedream 5.0 pro，2026-10-27）
 * 用户定：简洁明快风格，高调通透；仅移动端 1152x2048。
 * J 柔白纱帘 / K 北欧原木清晨 / L 几何光影白墙。
 * 硬约束：明亮高调、奶油暖白、无人物无文字、上部或中部留文案可读区。
 * 输出：public/images/staging/hero-editorial-{j,k,l}-mobile.jpg
 * 用法: ARK_API_KEY=$(cat scripts/.ark-api-key-2) node scripts/seedream-hero-editorial-jkl.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const SEED = 84500;

const QUALITY =
  '专业家居生活摄影，杂志大片级画质，8K 超高清，超写实真实物理材质，布料褶皱、亚麻纹理、木与石的肌理细节清晰；高调明亮、通透干净，低饱和暖白调，光线是画面主角之一。' +
  '无人物、无文字、无水印、无 logo、无图标按钮界面元素；规避高饱和色彩、浓重阴影、昏暗氛围、塑料 CGI 质感、扭曲透视、凌乱脏感、过曝死白（高光必须保留布料层次）。';

const M_COMP = '竖幅 9:16 竖版构图（独立重新构图，不是横版裁切）：取景紧凑，床体占画面约 75%-85%，画面明亮通透，视觉重心落在床与光影上，构图简洁、元素克制。';

const SCENES = {
  j: M_COMP + 'J方向·柔白纱帘：一整面落地窗挂着半透明的白色亚麻纱帘，清晨阳光透过纱帘变成一整面柔光，整个房间沐浴在发光的白色里。窗前一张床，纯白色棉质床品被柔光照得微微发亮，被子掀开一角褶皱自然，两个白色枕头。浅橡木地板。画面几乎是单色的高调白，只有纱帘的细腻褶皱和床品的柔和阴影给出层次。极简、通透、会呼吸，像 Muji 的早春海报。',
  k: M_COMP + 'K方向·北欧原木清晨：明亮的北欧日式（Japandi）卧室，白墙上什么都没有，浅橡木地板，一张矮脚原木床架上是奶白色床品——蓬松的被子、两个亚麻枕、床尾一条浅燕麦色棉毯叠得整齐。清晨阳光从右侧窗外洒进来铺满半张床，光影边界柔和。床头小木凳上一只素白陶瓷杯，墙角一枝绿植（吊钟或马醉木）插在高瓶里，是画面唯一的绿色点缀。清新、干净、有生活气，像 HAY 或北欧家居品牌的型录封面。',
  l: M_COMP + 'L方向·几何光影白墙：纯白色的极简卧室，上午的阳光透过一扇拱形窗（窗在画面外），在白墙和白色床品上投下一个完整、边缘柔和的拱形光影，光影是画面唯一也是绝对的主角。床品纯白微皱，枕头松软，构图极其克制——白墙、白床、一道拱形光。浅橡木地板给出一点暖色。极简几何感、明亮通透，像 Kinfolk 或 HAY 的海报大片。',
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
  for (const k of ['j', 'k', 'l']) {
    await gen(SCENES[k] + QUALITY, '1152x2048', path.join(OUT, `hero-editorial-${k}-mobile.jpg`), s++);
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
