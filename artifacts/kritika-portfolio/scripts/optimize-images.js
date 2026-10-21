const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/HP/Desktop/kritika-portfolio/artifacts/kritika-portfolio/public';
const images = [
  { name: 'kritika-bhagoria.jpg', w: 1086, h: 1448 },
  { name: 'kritika-bhagoria-about.jpg', w: 1086, h: 1448 },
  { name: 'kritika-bhagoria-og.jpg', w: 1086, h: 1448 },
  { name: 'kritika-bhagoria-blog-cover.png', w: 1200, h: 630 },
  { name: 'kb-logo.png', w: 512, h: 512 },
  { name: 'apple-touch-icon.png', w: 180, h: 180 },
];

async function run() {
  for (const img of images) {
    const input = path.join(dir, img.name);
    if (!fs.existsSync(input)) continue;
    
    const base = img.name.replace(/\.[^.]+$/, '');
    const webpPath = path.join(dir, base + '.webp');
    
    await sharp(input)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    
    const orig = fs.statSync(input).size;
    const webp = fs.statSync(webpPath).size;
    console.log(`${img.name}: ${Math.round(orig/1024)}KB -> ${base}.webp: ${Math.round(webp/1024)}KB (${Math.round(webp/orig*100)}%)`);
  }
}

run().catch(e => { console.error(e); process.exit(1); });
