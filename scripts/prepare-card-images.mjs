import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const dir = path.join(root, 'public/images');
const output = path.join(dir, 'cards');
await fs.mkdir(output, { recursive: true });
const sources = new Set();
function collect(value) {
  if (typeof value === 'string' && value.startsWith('/images/')) sources.add(value);
  else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
}
for (const file of ['products.json', 'editorial-products.json', 'product-color-images.json']) {
  collect(JSON.parse(await fs.readFile(path.join(root, 'src/data', file), 'utf8')));
}
for (const file of await fs.readdir(dir)) {
  if (/^(seasonal-(?!banner)|new-arrival-|best-seller-).*\.webp$/.test(file)) sources.add('/images/' + file);
}
const manifest = {};
let before = 0, after = 0;
for (const src of sources) {
  const original = path.join(root, 'public', src.split('?')[0]);
  const detail = path.join(dir, 'detail', path.basename(original));
  const input = await fs.readFile(await fs.access(detail).then(() => detail).catch(() => original));
  const hash = crypto.createHash('sha256').update(input).update('card-1024-q92-v1').digest('hex').slice(0, 16);
  const name = hash + '.webp';
  const dest = path.join(output, name);
  try { await fs.access(dest); } catch {
    await sharp(input).rotate().resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true }).webp({ quality: 92, effort: 5 }).toFile(dest);
  }
  manifest[src] = '/images/cards/' + name;
  before += input.length;
  after += (await fs.stat(dest)).size;
}
await fs.writeFile(path.join(root, 'src/data/card-images.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ images: sources.size, sourceBytes: before, cardBytes: after, reduction: Math.round((1 - after / before) * 100) + '%' }));
