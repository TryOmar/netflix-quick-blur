import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve('../userscript/dist/netflix-quick-blur.user.js');
const targetDir = path.resolve('public/downloads');
const dest = path.join(targetDir, 'netflix-quick-blur.user.js');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log(`✅ Copied userscript to ${dest}`);
} else {
  console.warn(`⚠️ Warning: ${src} not found. Build userscript first.`);
}
