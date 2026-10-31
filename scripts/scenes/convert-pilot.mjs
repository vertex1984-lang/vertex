import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const src = 'D:\\opencode_workspace\\图';
const outDir = path.join(root, 'public', 'images', 'scenes');
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ['03c0f57f89e1f58c05c966d60c51d320.png', 'cottage-patchwork-bedroom', 1600],
  ['0481ec764b2a49d24013d93df0609e1a.png', 'attic-blue-linen-bedroom', 1600],
  ['0622804f484b5e36347e0fd6264982f8.png', 'lilac-pompom-bedroom', 1600],
  ['099993958af7e105520544e1e689a979.png', 'corduroy-bench-trio', 2400],
  ['0f8d044bce38c5f0ff23cf8a0ac51172.png', 'lavender-cottage-bedroom', 1600],
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
