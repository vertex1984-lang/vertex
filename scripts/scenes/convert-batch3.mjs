import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const src = 'D:\\opencode_workspace\\图';
const outDir = path.join(root, 'public', 'images', 'scenes');
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ['361b650e9358ba2dd7025feb8ab20d06.png', 'cottage-check-bedroom', 1600],
  ['36676edf7813c288ed913dcbff15ae1f.png', 'snowy-teahouse-bedroom', 1600],
  ['36f3f706a66d544a8748ac42f03b45f2.png', 'rose-boudoir-corner', 1600],
  ['392f97f61694d9bd28992d123d975c43.png', 'stone-attic-daybed', 1600],
  ['393bdab965f92b506149492095ebef24.png', 'study-in-denim', 1600],
  ['3d369049525e28926cd159b64edb4f78.png', 'amber-panel-room', 1600],
  ['3dada3c27a3325f90163fb8e16227e3e.png', 'pompom-quilt-morning', 1600],
  ['3fcb0155a0dec783bda08697205100d7.png', 'three-colours-second-light', 1600],
  ['421b1e9dce83faaba0b1c09d5218c650.png', 'zen-sage-tatami', 1600],
  ['4546651e48c0dec4d017ffa6afdafe84.png', 'blush-bobble-bedroom', 2400],
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
