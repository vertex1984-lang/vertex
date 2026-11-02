import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const src = 'D:\\opencode_workspace\\图';
const outDir = path.join(root, 'public', 'images', 'scenes');
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ['895a363d36df3e3764d86326ec65da5c.png', 'tuscan-swirl-suite', 1600],
  ['8963c05746b13238911e5b57cc9342ce.png', 'ryokan-plaid-dawn', 1600],
  ['8968458bc0995d5f9c78051704e9ae79.png', 'mauve-towel-spa', 1600],
  ['89ab80d3fc9223988b74e850f45d7bc2.png', 'ink-floral-loft', 1600],
  ['94ecd4532cbbf728c2d99107e8777755.jpg', 'boho-mauve-hearth', 1600],
  ['94f7dca4000cafb14f21fcfc94100e2a.png', 'sky-blue-mono-suite', 1600],
  ['971e49d662529f7a402a88afed2de31f.png', 'marrakech-rose-suite', 1600],
  ['9ad8ee880cf3cd3b116c0be5f9bf8b51.png', 'sundown-persian-lounge', 2400],
  ['9f2675dbb0c844a4226f7ef0e9fdb01a.png', 'sage-bath-ritual', 1600],
  ['9f9dcb52ebd64b5c9890263bd79851f8.png', 'parisian-cream-suite', 1600],
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
