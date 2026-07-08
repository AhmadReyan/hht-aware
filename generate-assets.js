import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, r, g, b) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // IDAT (Pixel data)
  // Each row has 1 filter byte (0) + width * 3 bytes (RGB)
  const rowSize = 1 + width * 3;
  const pixelData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    pixelData[y * rowSize] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      const idx = y * rowSize + 1 + x * 3;
      pixelData[idx] = r;
      pixelData[idx + 1] = g;
      pixelData[idx + 2] = b;
    }
  }
  
  const compressed = zlib.deflateSync(pixelData);
  const idatChunk = createChunk('IDAT', compressed);
  
  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length, 0);
  
  const typeBuf = Buffer.from(type, 'ascii');
  
  const crcInput = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcInput);
  
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  
  return Buffer.concat([lengthBuf, typeBuf, data, crcBuf]);
}

// CRC32 implementation
const crcTable = [];
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Main execution
const iconsDir = './public/icons';
const screenshotsDir = './public/screenshots';

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Write PWA icons
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
iconSizes.forEach(size => {
  const png = createPng(size, size, 192, 57, 43); // #C0392B (HHT Red)
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png`);
});

// Write default favicon / apple touch
fs.writeFileSync('./public/favicon.ico', createPng(32, 32, 192, 57, 43));
fs.writeFileSync('./public/apple-touch-icon.png', createPng(180, 180, 192, 57, 43));
fs.writeFileSync('./public/masked-icon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#C0392B"/></svg>`);

// Write screenshots
fs.writeFileSync(path.join(screenshotsDir, 'screenshot-1.png'), createPng(1080, 1920, 28, 28, 30)); // #1C1C1E Dark background
fs.writeFileSync(path.join(screenshotsDir, 'screenshot-2.png'), createPng(1920, 1080, 28, 28, 30));

console.log('All assets generated successfully!');
