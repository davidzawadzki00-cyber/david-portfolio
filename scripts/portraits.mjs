import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const portraits = {
  editorial: { original: '9ECD2D50-8857-4FC8-9CF5-3FE607DCA73D.jpeg', file: 'david-editorial.jpeg', alt: 'David in gray clothing beside a bicycle and violet bike racks.', loading: 'eager', ratio: 0.8 },
  headshot: { original: '04E1A846-D312-432C-8A35-C57442047E2D(2).jpeg', file: 'david-headshot.jpeg', alt: 'David in a navy shirt outdoors in warm sunlight.', loading: 'lazy', ratio: 1 },
};

// Read the encoded dimensions rather than guessing the intrinsic image size.
function jpegSize(data) {
  if (data.readUInt16BE(0) !== 0xffd8) throw new Error('Expected a JPEG portrait.');
  let offset = 2;
  while (offset < data.length - 9) {
    if (data[offset] !== 0xff) throw new Error('Invalid JPEG marker.');
    while (data[offset] === 0xff) offset++;
    const marker = data[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = data.readUInt16BE(offset);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { height: data.readUInt16BE(offset + 3), width: data.readUInt16BE(offset + 5) };
    }
    if (length < 2) break;
    offset += length;
  }
  throw new Error('Could not read JPEG dimensions.');
}

function prepare() {
  const missing = [];
  for (const item of Object.values(portraits)) {
    const source = path.join(root, 'portraits/originals', item.original);
    const target = path.join(root, 'public/portraits', item.file);
    if (fs.existsSync(source)) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target);
    }
    if (!fs.existsSync(target)) { missing.push(item.original); continue; }
    item.size = jpegSize(fs.readFileSync(target));
    const ratio = item.size.width / item.size.height;
    if (Math.abs(ratio - item.ratio) > 0.06) {
      throw new Error(`${item.file}: expected ${item.ratio === 1 ? 'square' : 'approximately 4:5'} framing. Keep the supplied proportions.`);
    }
  }
  return missing;
}

export function portraitPlugin(base) {
  return {
    name: 'supplied-portraits',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const missing = prepare();
        if (missing.length) console.warn(`Portrait files unavailable: ${missing.join(', ')}`);
        for (const [key, item] of Object.entries(portraits)) {
          if (!item.size) continue;
          const { width, height } = item.size;
          const sizes = key === 'editorial' ? '(max-width: 650px) calc(100vw - 44px), 40vw' : '(max-width: 650px) 55vw, 300px';
          const img = `<img src="${base}portraits/${item.file}" alt="${item.alt}" width="${width}" height="${height}" loading="${item.loading}" decoding="async" ${key === 'editorial' ? 'fetchpriority="high"' : ''} sizes="${sizes}" />`;
          const expression = new RegExp(`<!-- PORTRAIT:${key} -->[\\s\\S]*?<!-- /PORTRAIT:${key} -->`);
          html = html.replace(expression, img);
        }
        return html;
      },
    },
  };
}

if (process.argv.includes('--check')) {
  const missing = prepare();
  if (missing.length) {
    console.error(`Missing original portraits:\n${missing.map(name => `  portraits/originals/${name}`).join('\n')}`);
    process.exitCode = 1;
  } else console.log('Both supplied JPEG portraits are present with the intended proportions.');
}
