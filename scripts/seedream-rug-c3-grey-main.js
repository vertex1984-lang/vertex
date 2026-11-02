/**
 * seedream-rug-c3-grey-main.js — 波斯地毯 C3 灰底主图（seedream 5.0 pro 图生图，2026-10-30）
 * v1（1:1，带轻微透视）→ staging/rug-c3-grey-main.jpg
 * v2（2026-10-30 用户定）：3:4、从正上方平拍（flat lay 俯拍，参考用户给的针织毯灰底图效果）、
 *    地毯占图比 85% 以上 → staging/rug-c3-grey-main-34.jpg
 * 输入: public/images/products/745181807454-C3/3.webp（1024x1024 客厅场景图）
 * 用法: node scripts/seedream-rug-c3-grey-main.js
 */
const fs = require('fs');
const path = require('path');
// 2026-10-30：主账号欠费，切备用火山账号（.ark-api-key-2）
const KEY_FILE = __dirname + '/.ark-api-key-2';
const KEY = process.env.ARK_API_KEY || fs.readFileSync(KEY_FILE, 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'products', '745181807454-C3', '3.webp');
const DEST = path.join(ROOT, 'public', 'images', 'staging', 'rug-c3-grey-main-34.jpg');

const PROMPT =
  '以参考图中的地毯为准，生成一张电商灰底主图：纯净的浅灰色无缝摄影棚背景，' +
  '镜头从正上方垂直俯拍（flat lay，完全正对、无透视倾斜），画面中只展示这一张地毯，' +
  '地毯完整平铺、水平垂直居中，占画面面积的 85% 以上，四周只留很窄的一圈均匀浅灰边距。' +
  '地毯的图案、配色（米色底、彩色波斯奖章花纹）、做旧质感、织物质地和边缘细节必须与参考图完全一致，不改色不改花型。' +
  '柔和均匀的棚拍光线，地毯右侧可有一点极浅的自然投影（类似高端家居电商的平拍主图质感）。' +
  '不要出现任何家具、植物、文字、水印或其他物品。照片级真实感，高清细节。';

async function generate(size) {
  const b64 = fs.readFileSync(SRC).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
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
  console.log(`已保存 ${DEST} (${buf.length} bytes), size=${data.data[0].size}`);
}

(async () => {
  console.log('调用 seedream 5.0 pro（图生图：灰底地毯主图 v2，3:4 正上方平拍）');
  // 严格 3:4：宽/高=0.75（1664x2496 是 2:3，勿用）
  const sizes = ['1872x2496', '1536x2048', '1248x1664'];
  for (const size of sizes) {
    try {
      await generate(size);
      return;
    } catch (e) {
      console.log(`${size} 失败:`, e.message.slice(0, 150));
    }
  }
  throw new Error('所有尺寸均失败');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
