import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const body = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const width = 1600;
const height = 900;
const raw = Buffer.alloc(height * (1 + width * 4));

for (let y = 0; y < height; y++) {
  const row = y * (1 + width * 4);
  raw[row] = 0;
  for (let x = 0; x < width; x++) {
    const offset = row + 1 + x * 4;
    const roll = Math.random();
    if (roll > 0.93) {
      const value = 170 + Math.floor(Math.random() * 85);
      raw[offset] = value;
      raw[offset + 1] = value;
      raw[offset + 2] = value;
      raw[offset + 3] = 255;
    } else {
      raw[offset] = 0;
      raw[offset + 1] = 0;
      raw[offset + 2] = 0;
      raw[offset + 3] = 255;
    }
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync(new URL("../public/texture.png", import.meta.url), png);
