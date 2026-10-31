import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const publicDir = path.join(root, 'public');
const reportDir = path.join(root, 'report', 'scenes');

const [name, pattern, extraType] = process.argv.slice(2);
if (!name || !pattern) {
  console.error('usage: node make-contact-sheet.mjs <name> <regex> [productType]');
  process.exit(1);
}

const idx = JSON.parse(fs.readFileSync(path.join(reportDir, 'product-index.json'), 'utf8'));
const re = new RegExp(pattern, 'i');
const items = idx.filter(
  (p) =>
    (!extraType || p.productType === extraType) &&
    (re.test(p.title) || re.test(p.fullTitle) || re.test(p.productType) || p.colors.some((c) => re.test(c)))
);

function resolveImage(p) {
  const candidates = [p.image, `/images/products/${p.asin}/1.webp`].filter(Boolean);
  for (const c of candidates) {
    const rel = c.replace(/^\//, '').replace(/\\/g, '/');
    const abs = path.join(publicDir, rel);
    if (fs.existsSync(abs)) return { abs, rel };
  }
  return null;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const cols = 6;
const tile = 200;
const labelH = 62;
const gap = 8;
const rows = Math.ceil(items.length / cols);
const margin = 16;
const width = margin * 2 + cols * tile + (cols - 1) * gap;
const height = margin * 2 + rows * (tile + labelH + gap);

const layers = [];
const listing = [];

for (let i = 0; i < items.length; i++) {
  const p = items[i];
  const col = i % cols;
  const row = Math.floor(i / cols);
  const x = margin + col * (tile + gap);
  const y = margin + row * (tile + labelH + gap);
  const n = i + 1;
  listing.push({ n, asin: p.asin, handle: p.handle, title: p.title, productType: p.productType, colors: p.colors, price: p.price, shopify: p.shopifyAvailable });
  const img = resolveImage(p);
  if (img) {
    try {
      const buf = await sharp(img.abs).resize(tile - 10, tile - 10, { fit: 'contain', background: '#ffffff' }).toBuffer();
      layers.push({ input: buf, left: x + 5, top: y + 5 });
    } catch {
      /* ignore */
    }
  }
  const label = `<svg width="${tile}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f5f1ea"/>
    <text x="5" y="16" font-family="Arial" font-size="14" font-weight="bold" fill="#1f2937">${n}. ${esc(p.asin)}</text>
    <text x="5" y="32" font-family="Arial" font-size="11" fill="#374151">${esc(p.title.slice(0, 42))}</text>
    <text x="5" y="46" font-family="Arial" font-size="11" fill="#374151">${esc(p.title.slice(42, 84))}</text>
    <text x="5" y="58" font-family="Arial" font-size="10" fill="#6b7280">${esc((p.colors || []).join('/'))} ${p.shopifyAvailable ? '$' + p.price : 'coming soon'}</text>
  </svg>`;
  layers.push({ input: Buffer.from(label), left: x, top: y + tile });
}

const canvas = sharp({ create: { width, height, channels: 3, background: '#ffffff' } });
const out = path.join(reportDir, `sheet-${name}.jpg`);
await canvas.composite(layers).jpeg({ quality: 88 }).toFile(out);
fs.writeFileSync(path.join(reportDir, `sheet-${name}.json`), JSON.stringify(listing, null, 2));
console.log(`items=${items.length} -> ${out}`);
