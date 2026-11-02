import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const src = 'D:\\opencode_workspace\\图';
const outDir = path.join(root, 'public', 'images', 'scenes');
fs.mkdirSync(outDir, { recursive: true });

// #60 b3e54d60 skipped: duplicate of boho-mauve-hearth (batch 6)
const files = [
  ['a0704549547070d9e97caa6139a5bb3d.png', 'snowy-pompom-cabin', 1600],
  ['a51dfe54d6aa5f70a17c03f85d7aa5f2.png', 'coastal-blue-spa', 1600],
  ['a7c4f9170eb67198835934b245ca91f4.png', 'rose-check-cabin', 1600],
  ['af5b019f4f21bfa80c6d847579597bf9.png', 'champagne-dark-suite', 1600],
  ['b44cf4cdfac861acd0a4d39a186f98d3.png', 'seaside-sky-suite', 1600],
  ['b4f1b6795924996c2c5ce36a04ae3a0c.png', 'greenhouse-oat-room', 1600],
  ['b8db9f9cb815b2e4ddca471b97db2eb5.png', 'tatami-sage-summer', 1600],
  ['bea46cbbc9f84f2161fe0cfa302e0410.png', 'cream-knit-bench', 2400],
  ['c4241ff487fa90f4e9e2d3897c6374db.png', 'oat-sunset-retreat', 1600],
  ['c9309a29804d5ac8f9c7b378e6703d08.png', 'blush-stripe-room', 1600],
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
