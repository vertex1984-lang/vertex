import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const report = path.join(root, 'report', 'scenes');
const src = 'D:\\opencode_workspace\\\u56fe';
const matchesPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(report, 'pilot-matches.json');
const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

const W = 620;
const H = 1000;
const PANEL = 780;
const ROW = 320;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

for (const scene of matches) {
  const overlay = path.join(report, `overlay-${path.basename(scene.scene).slice(0, 8)}.jpg`);
  const scenePath = fs.existsSync(overlay) ? overlay : path.join(src, scene.scene);
  const meta = await sharp(scenePath).metadata();
  const scale = Math.min(W / meta.width, H / meta.height);
  const sw = Math.round(meta.width * scale);
  const sh = Math.round(meta.height * scale);
  const sceneBuf = await sharp(scenePath).resize(sw, sh).toBuffer();
  const stem = path.basename(scene.scene).replace(/\.[a-z]+$/i, '');
  const spotsPath = [
    path.join(report, `spots4-${stem}.json`),
    path.join(report, `spots3-${stem}.json`),
    path.join(report, `spots2-${stem}.json`),
    path.join(report, `spots2-${stem.slice(0, 8)}.json`),
    path.join(report, `spots-${stem.slice(0, 8)}.json`),
  ].find((p) => fs.existsSync(p));
  const spots = spotsPath ? JSON.parse(fs.readFileSync(spotsPath, 'utf8').replace(/^\uFEFF/, '')) : null;
  const canvasH = Math.max(sh + 60, 3 * ROW + 110);
  const layers = [{ input: sceneBuf, left: 10, top: 40 }];
  const header = `<svg width="${PANEL}" height="40" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="26" font-family="Arial" font-size="18" font-weight="bold" fill="#1f2937">Matched products</text>
  </svg>`;
  layers.push({ input: Buffer.from(header), left: W + 20, top: 40 });
  const cropHeader = `<svg width="220" height="40" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="26" font-family="Arial" font-size="18" font-weight="bold" fill="#1f2937">Scene crop</text>
  </svg>`;
  layers.push({ input: Buffer.from(cropHeader), left: W + 220, top: 40 });

  for (let i = 0; i < scene.items.length; i++) {
    const it = scene.items[i];
    const y = 90 + i * ROW;
    const imgPath = path.join(root, 'public', 'images', 'products', it.asin, '1.webp');
    if (fs.existsSync(imgPath)) {
      const buf = await sharp(imgPath).resize(190, 190, { fit: 'contain', background: '#ffffff' }).toBuffer();
      layers.push({ input: buf, left: W + 20, top: y });
    }
    if (spots && spots[i]) {
      const side = Math.round(0.3 * Math.min(meta.width, meta.height));
      const cx = Math.min(Math.max(Math.round((meta.width * spots[i].x) / 100 - side / 2), 0), meta.width - side);
      const cy = Math.min(Math.max(Math.round((meta.height * spots[i].y) / 100 - side / 2), 0), meta.height - side);
      const crop = await sharp(scenePath).extract({ left: cx, top: cy, width: side, height: side }).resize(190, 190).toBuffer();
      layers.push({ input: crop, left: W + 220, top: y });
    }
    const label = `<svg width="380" height="330" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="4" height="190" fill="${it.conf === 'High' ? '#15803d' : '#b45309'}"/>
      <text x="14" y="24" font-family="Arial" font-size="19" font-weight="bold" fill="#1f2937">${i + 1}. ${esc(it.title.slice(0, 30))}</text>
      <text x="14" y="46" font-family="Arial" font-size="13" fill="#4b5563">${esc(it.title.slice(30, 68))}</text>
      <text x="14" y="66" font-family="Arial" font-size="13" fill="#4b5563">${esc(it.title.slice(68, 106))}</text>
      <text x="14" y="92" font-family="Arial" font-size="14" font-weight="bold" fill="${it.conf === 'High' ? '#15803d' : '#b45309'}">${it.conf} confidence</text>
      <text x="14" y="114" font-family="Arial" font-size="12" fill="#6b7280">${esc(it.note.slice(0, 52))}</text>
      <text x="14" y="132" font-family="Arial" font-size="12" fill="#6b7280">${esc(it.note.slice(52, 104))}</text>
      <text x="14" y="152" font-family="Arial" font-size="12" fill="#6b7280">${esc(it.price)}</text>
    </svg>`;
    layers.push({ input: Buffer.from(label), left: W + 420, top: y + 6 });
  }

  const title = `<svg width="${W + PANEL + 50}" height="40" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="26" font-family="Arial" font-size="18" font-weight="bold" fill="#1f2937">${esc(scene.slug)}</text>
  </svg>`;
  layers.push({ input: Buffer.from(title), left: 10, top: 0 });

  const canvas = sharp({
    create: { width: W + PANEL + 50, height: canvasH, channels: 3, background: '#ffffff' },
  });
  const out = path.join(report, `verify-${scene.slug}.jpg`);
  await canvas.composite(layers).jpeg({ quality: 88 }).toFile(out);
  console.log(out);
}
