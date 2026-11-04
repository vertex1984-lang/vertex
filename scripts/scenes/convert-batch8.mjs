import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const src = 'D:\\opencode_workspace\\图';
const outDir = path.join(root, 'public', 'images', 'scenes');
fs.mkdirSync(outDir, { recursive: true });

// #68 cffe6870 / #75 e5f58dca / #81 f8f90dca skipped: portrait/wide duplicates of online scenes
const files = [
  ['ccbd64cb69d86c3c6e688b0136278e3e.png', 'golden-swirl-suite', 1600],
  ['d0c72a84279532e6040ceb28480b3e83.png', 'artist-attic-studio', 1600],
  ['d0d7296f3ffc5b1ec6c3c73ce05f283e.png', 'dusk-rose-loft', 1600],
  ['d3e4d35fdbbd0e21e037dd5b0e0c8643.png', 'terracotta-chaise-patio', 2400],
  ['d57147c3a2471bb97b63ae5cb10a8422.png', 'academy-ivory-study', 1600],
  ['d6e6434bec31a7c34d6dc76f7146992c.png', 'retro-sunset-room', 1600],
  ['e11d82a4229894c4983383e9c7ffb97d.png', 'riad-oat-towels', 1600],
  ['f0189718578fc3a52f067486055d599e.png', 'santorini-blue-pool', 1600],
  ['f0da47589175192d69ce74aeb4484060.png', 'sage-pink-morning', 1600],
  ['f0fefb2b2951b88df87f3663b0e01098.png', 'tropic-sunroom-patio', 1600],
  ['f1eca13cb32e7d8f7e6358f81caf5907.png', 'sage-minimal-bath', 1600],
  ['f7d3ee4e02001585a9e75692d22cc868.png', 'nordic-white-loft', 1600],
  ['fe47c0a8ba11db4c94c7d93bf6c25c69.png', 'alpine-cabin-bath', 1600],
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
