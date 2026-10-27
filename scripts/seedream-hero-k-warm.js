/**
 * seedream-hero-k-warm.js — K 北欧原木清晨 hero 暖调版（seedream 5.0 pro 图生图，2026-10-27）
 * 用户定：滤镜效果不自然 → 直接生成暖色调版本，场景/构图/摆设完全不变。
 * 输入: public/images/staging/hero-editorial-k-mobile.jpg
 * 输出: public/images/staging/hero-editorial-k-warm-mobile.jpg
 * 用法: ARK_API_KEY=$(cat scripts/.ark-api-key-2) node scripts/seedream-hero-k-warm.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'staging', 'hero-editorial-k-mobile.jpg');
const DEST = path.join(ROOT, 'public', 'images', 'staging', 'hero-editorial-k-warm-mobile.jpg');

const PROMPT =
  '保持这张照片的场景、构图、床、床品、小木凳、陶瓷杯、绿植、光影位置完全不变，只调整色调：' +
  '把整体从偏冷的白色调整为温暖自然的奶油暖色调——清晨阳光更暖更柔和，白墙带一点点暖米色，床品是自然的暖白色，木地板和原木床架更温润。' +
  '要求色调真实自然，像真实暖阳下拍摄的照片，不要偏黄失真、不要改变任何物体的形状和位置、不要添加或移除任何元素、画面中不要出现文字。';

(async () => {
  const b64 = fs.readFileSync(SRC).toString('base64');
  console.log('调用 seedream 5.0 pro（图生图暖调化）');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed: 84500,
      prompt: PROMPT,
      image: `data:image/jpeg;base64,${b64}`,
      response_format: 'url',
      size: '1152x2048',
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
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
