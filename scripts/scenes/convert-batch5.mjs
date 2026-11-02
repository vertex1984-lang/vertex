import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const src = 'D:\\opencode_workspace\\图';
const outDir = path.join(root, 'public', 'images', 'scenes');
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ['65c0b2ff28e4456911aea4531fb5ed36.png', 'japandi-taupe-suite', 1600],
  ['691fdb8e0e45cce8cedae7fee176ff7a.png', 'cottage-pompom-garden', 1600],
  ['69d22132a133b47fb04f9709cd25afaf.png', 'lakeside-gingham-cabin', 1600],
  ['7e90c2933aafb8d440be561e6a6b21f8.png', 'olive-terrace-patio', 1600],
  ['7ead9083296968831cd5a267a9319da6.png', 'blush-nude-morning', 1600],
  ['80674875b3a8f7d2e90a01b6271aaee4.png', 'charcoal-loft-evening', 1600],
  ['80928ee6f340766d1fc6fac1e2dc1c16.png', 'onsen-grey-ritual', 1600],
  ['822a21c88f79506be59542792246b198.png', 'provence-terracotta-suite', 1600],
  ['87d0a59dd5936d67b70454c50060677e.png', 'ivory-gothic-library', 1600],
  ['880511fc3f589cd4c306414f1020f792.png', 'rose-towels-soak', 1600],
];

for (const [file, slug, longEdge] of files) {
  const img = sharp(path.join(src, file));
  const meta = await img.metadata();
  const landscape = meta.width > meta.height;
  const edge = landscape ? longEdge : Math.round(longEdge);
  const resized = landscape
    ? { width: edge, height: Math.round((meta.height * edge) / meta.width) }
    : { width: Math.round((meta.width * edge) / meta.height), height: edge };
  const out = path.join(outDir, `${slug}.webp`);
  await img.resize(resized.width, resized.height, { fit: 'fill' }).webp({ quality: 82, effort: 4 }).toFile(out);
  const size = fs.statSync(out).size;
  console.log(`${slug}: ${meta.width}x${meta.height} -> ${resized.width}x${resized.height} ${(size / 1024).toFixed(0)}KB`);
}
