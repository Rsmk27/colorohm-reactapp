import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const assets = path.resolve('assets');
await mkdir(assets, { recursive: true });

const bg = '#0F0F0F';
const amber = '#F59E0B';
const cream = '#E7D6A8';

function logoSvg(size, extra = '') {
  const stroke = Math.max(8, Math.round(size * 0.06));
  const radius = Math.round(size * 0.31);
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bg}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${amber}" stroke-width="${stroke}"/>
    <text x="50%" y="53%" text-anchor="middle" font-family="Consolas, monospace" font-size="${Math.round(size * 0.28)}" font-weight="700" fill="${amber}">Ω</text>
    ${extra}
  </svg>`;
}

function adaptiveBackgroundSvg() {
  return `
  <svg width="432" height="432" viewBox="0 0 432 432" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bg}"/>
    <rect x="86" y="171" width="260" height="90" rx="45" fill="${cream}"/>
    <rect x="176" y="171" width="20" height="90" fill="${amber}"/>
    <rect x="210" y="171" width="20" height="90" fill="${amber}"/>
    <rect x="244" y="171" width="20" height="90" fill="${amber}"/>
  </svg>`;
}

function monochromeSvg() {
  return `
  <svg width="432" height="432" viewBox="0 0 432 432" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="black"/>
    <circle cx="216" cy="216" r="130" fill="none" stroke="white" stroke-width="28"/>
    <text x="50%" y="54%" text-anchor="middle" font-family="Consolas, monospace" font-size="110" font-weight="700" fill="white">Ω</text>
  </svg>`;
}

function splashSvg() {
  return `
  <svg width="1242" height="2436" viewBox="0 0 1242 2436" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0F0F0F"/>
        <stop offset="100%" stop-color="#201405"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <circle cx="621" cy="980" r="260" fill="none" stroke="${amber}" stroke-width="54"/>
    <text x="50%" y="42%" text-anchor="middle" font-family="Consolas, monospace" font-size="270" font-weight="700" fill="${amber}">Ω</text>
    <text x="50%" y="62%" text-anchor="middle" font-family="Consolas, monospace" font-size="72" font-weight="700" fill="${amber}">COLOROHM</text>
  </svg>`;
}

async function writeSvgPng(svg, out, width, height) {
  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(path.join(assets, out));
}

await writeSvgPng(logoSvg(1024), 'icon.png', 1024, 1024);
await writeSvgPng(logoSvg(432), 'android-icon-foreground.png', 432, 432);
await writeSvgPng(adaptiveBackgroundSvg(), 'android-icon-background.png', 432, 432);
await writeSvgPng(monochromeSvg(), 'android-icon-monochrome.png', 432, 432);
await writeSvgPng(logoSvg(48), 'favicon.png', 48, 48);
await writeSvgPng(splashSvg(), 'splash-icon.png', 1242, 2436);

console.log('Branding assets generated in /assets');
