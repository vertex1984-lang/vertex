const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImage(inputPath, outputPath, options = {}) {
  const {
    width = 800,
    quality = 80,
    format = 'webp',
  } = options;

  const buffer = await sharp(inputPath)
    .resize(width, null, { withoutEnlargement: true })
    .toFormat(format, { quality })
    .toBuffer();

  fs.writeFileSync(outputPath, buffer);

  const originalSize = fs.statSync(inputPath).size;
  const newSize = buffer.length;
  const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

  console.log(`${path.basename(inputPath)}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% saved)`);
}

async function main() {
  // Compress featured images
  const featuredDir = path.join(__dirname, '../public/images/featured');
  const featuredFiles = fs.readdirSync(featuredDir).filter(f => f.endsWith('.png'));

  console.log('=== Featured Images ===');
  for (const file of featuredFiles) {
    const inputPath = path.join(featuredDir, file);
    const outputPath = path.join(featuredDir, file.replace('.png', '.webp'));
    await compressImage(inputPath, outputPath, { width: 600, quality: 85, format: 'webp' });
  }

  // Compress banner images
  const brandDir = path.join(__dirname, '../public/images/brand');
  const bannerFiles = ['collection-banner-new.png', 'about-banner-new.png'];

  console.log('\n=== Banner Images ===');
  for (const file of bannerFiles) {
    const inputPath = path.join(brandDir, file);
    if (fs.existsSync(inputPath)) {
      const outputPath = path.join(brandDir, file.replace('.png', '.webp'));
      await compressImage(inputPath, outputPath, { width: 1920, quality: 85, format: 'webp' });
    }
  }
}

main().catch(console.error);
