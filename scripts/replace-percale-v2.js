// One-off: replace percale coconut/nude/euca/lavender main images (1.webp) with v2 staging PNGs.
// Backs up originals to scripts/image-backup/, writes to both public/ and out/.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const colors = ['COCONUT', 'NUDE', 'EUCA', 'LAVENDER'];
const sizes = ['TWIN', 'FULL', 'QUEEN', 'KING'];
const backupDir = path.join(__dirname, 'image-backup');

(async () => {
  for (const color of colors) {
    const src = path.join(root, 'public/images/staging', `percale-${color.toLowerCase()}-v2-1x1.png`);
    if (!fs.existsSync(src)) { console.error('MISSING staging:', src); continue; }
    const buf = await sharp(src).resize(1200, 1200).webp({ quality: 82 }).toBuffer();
    for (const size of sizes) {
      const rel = path.join('images/products', `PERCALE-${color}-${size}`, '1.webp');
      const pubPath = path.join(root, 'public', rel);
      const outPath = path.join(root, 'out', rel);
      if (fs.existsSync(pubPath)) {
        const bak = path.join(backupDir, `PERCALE-${color}-${size}-1-v1-backup.webp`);
        if (!fs.existsSync(bak)) fs.copyFileSync(pubPath, bak);
      }
      fs.writeFileSync(pubPath, buf);
      if (fs.existsSync(path.dirname(outPath))) fs.writeFileSync(outPath, buf);
      console.log('replaced:', rel);
    }
  }
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
