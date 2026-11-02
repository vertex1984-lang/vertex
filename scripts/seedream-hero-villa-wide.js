/**
 * seedream-hero-villa-wide.js — 地中海小屋 hero 桌面端高清横版（seedream 5.0 pro 图生图，2026-10-28）
 * 用户定：以竖版拱廊图为底，扩展生成高清横版，画面风格/元素/色彩/摆件尽量保持。
 * 输入: public/images/brand/hero-villa-desktop.webp（竖版 1344x1792）
 * 输出: public/images/staging/hero-villa-desktop-wide.jpg（横版，确认后再转正）
 * 用法: ARK_API_KEY=$(cat scripts/.ark-api-key-2) node scripts/seedream-hero-villa-wide.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'brand', 'hero-villa-desktop.webp');
const DEST = path.join(ROOT, 'public', 'images', 'staging', 'hero-villa-desktop-wide.jpg');

const PROMPT =
  '以这张地中海乡村卧室照片为基础，扩展成宽幅横版构图：保持画面风格、元素、色彩、摆件完全一致——' +
  '白色拱形墙壁与深色木梁、黑色铁艺吊灯、拱形壁龛里的陶罐和彩釉盘、绿色瓷砖腰线、' +
  '白色床头板配鼠尾草绿条纹棉缎床品、灰褐色搭毯、床尾针织毯、陶土地砖、白色毛绒地毯、' +
  '藤编长凳上的草帽和布袋、木百叶窗和窗外的橘子树、床头柜上的陶罐台灯、书籍和橘子。' +
  '左右两侧自然延展房间（左侧延续拱廊和边桌，右侧延续窗户和藤椅区域），床体保持完整、居中偏左，' +
  '上午阳光从右侧窗户洒入的光影不变。照片级真实感，色调温暖自然，画面中不要出现任何文字。';

async function generate(size) {
  const b64 = fs.readFileSync(SRC).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed: 84510,
      prompt: PROMPT,
      image: `data:image/webp;base64,${b64}`,
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
  fs.writeFileSync(DEST, buf);
  console.log(`已保存 (${buf.length} bytes), size=${data.data[0].size}`);
}

(async () => {
  console.log('调用 seedream 5.0 pro（图生图横版扩展）');
  try {
    await generate('2560x1440');
  } catch (e) {
    console.log('2560x1440 失败，回退 2048x1152:', e.message.slice(0, 200));
    await generate('2048x1152');
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
