import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const src = 'D:\\opencode_workspace\\图';
const outDir = path.join(root, 'public', 'images', 'scenes');
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ['11acfdd4c30fa0a175296426debfbd71.png', 'sunrise-oat-linen-room', 2400],
  ['1439a58a2718ade451de8f9db4e60c3b.png', 'book-nook-window-seat', 1600],
  ['1b666ebb9f1ac6ffc4051a172df9709c.png', 'art-deco-gold-suite', 1600],
  ['1d8728984dd6f818a5b884353dd8a500.png', 'japandi-sage-suite', 1600],
  ['1db8691a3c6182557951cd5e386d39bb.png', 'shabby-lavender-tea', 1600],
  ['25932d567cf46696d932e00a03775b64.png', 'boho-terracotta-dusk', 1600],
  ['279ec5042263234337f94253265bc9a9.png', 'spanish-courtyard-sage', 1600],
  ['2cc23cf9566bc2ad9c13d95c38bffbeb.png', 'manor-cream-suite', 1600],
  ['3005088f7ada57351988dfecd65c3218.png', 'bali-canopy-dusk', 1600],
  ['31f31619982d3f27b241e71f06e0f9bb.png', 'library-oat-hour', 1600],
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
