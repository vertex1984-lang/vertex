import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const src = 'D:\\opencode_workspace\\图';
const outDir = path.join(root, 'public', 'images', 'scenes');
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ['4558a73b0d521cd9ca70557ffa30e8d7.png', 'chateau-pompom-suite', 1600],
  ['461a18ff186745d8e846bccc9febec2c.png', 'rainy-sunroom-check', 1600],
  ['47990e2e06f88de407d20a3a34e8efaa.png', 'retro-vine-panel', 1600],
  ['482aee94598eba0d9ffa23078f7cd4d2.png', 'parisian-lilac-bath', 1600],
  ['4894174ee001b526fc928f7df14ec43f.png', 'adobe-terracotta-room', 1600],
  ['4a9f0ef03743ae7acaf9cb331b46a796.png', 'pom-pom-pink-morning', 1600],
  ['4ca336fad9c8afaf9fefbcbf7ad1cb42.png', 'yacht-taupe-cabin', 1600],
  ['54dcde181315cad2c9b4ac945ab6601b.png', 'stone-bath-grey', 1600],
  ['5bc8d28d46bf7ed81591f3da2a6affee.png', 'lilac-window-seat', 1600],
  ['624ad901d8589f758240e1d19894471b.png', 'palace-ivory-suite', 1600],
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
