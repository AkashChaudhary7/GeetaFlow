import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const standardSvgPath = path.resolve('public/icon.svg');
const maskableSvgPath = path.resolve('public/icon-maskable.svg');

const standardSvgBuffer = fs.readFileSync(standardSvgPath);
const maskableSvgBuffer = fs.existsSync(maskableSvgPath) 
  ? fs.readFileSync(maskableSvgPath) 
  : standardSvgBuffer;

async function generate() {
  console.log('Generating high-res Sacred Chariot PWA icons...');

  // 1. Standard PWA 192x192 PNG (purpose: any)
  await sharp(standardSvgBuffer)
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.resolve('public/pwa-192x192.png'));
  console.log('✓ Generated public/pwa-192x192.png (192x192)');

  // 2. Standard PWA 512x512 PNG (purpose: any)
  await sharp(standardSvgBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.resolve('public/pwa-512x512.png'));
  console.log('✓ Generated public/pwa-512x512.png (512x512)');

  // 3. Apple Touch Icon 180x180 PNG
  await sharp(standardSvgBuffer)
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log('✓ Generated public/apple-touch-icon.png (180x180)');

  // 4. W3C Maskable Icon 512x512 PNG (purpose: maskable) with full-bleed cosmic background and 80% safe-zone centering
  await sharp(maskableSvgBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));
  console.log('✓ Generated public/pwa-maskable-512x512.png (512x512 Maskable)');

  // 5. Favicon 64x64 PNG
  await sharp(standardSvgBuffer)
    .resize(64, 64)
    .png({ quality: 100 })
    .toFile(path.resolve('public/favicon.png'));
  console.log('✓ Generated public/favicon.png (64x64)');
}

generate()
  .then(() => console.log('All GeetaFlow PWA icons generated successfully!'))
  .catch(err => {
    console.error('Error generating icons:', err);
    process.exit(1);
  });
