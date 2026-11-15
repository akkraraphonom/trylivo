// Offline inventory only: never imports the Decart SDK or calls the session endpoint.
import { readFileSync, writeFileSync } from 'node:fs';
import { buildTryOnPrompt } from '../src/lib/try-on.ts';

const root = new URL('../', import.meta.url);
const products = ['products', 'editorial-products'].flatMap(name =>
  JSON.parse(readFileSync(new URL(`src/data/${name}.json`, root), 'utf8')));
const entries = products.flatMap(product =>
  (product.options.find(option => option.name === 'Color')?.values ?? []).map(color => ({
    slug: product.slug, title: product.title, color, prompt: buildTryOnPrompt(product, color),
  })));
const header = `# TRYLIVO try-on prompt inventory\n\n${products.length} products; ${entries.length} product/color combinations.\n\nGenerated offline from src/lib/try-on.ts. These prompts are prepared and wired into Try-ons, but this revision has not been tested on Decart and makes no guarantee of artifact-free output. No API request or credits are needed to regenerate this document. Pair each prompt with the selected color's garment-only gallery image.\n\n`;
writeFileSync(new URL('docs/try-on-prompts.md', root), header + entries.map(entry =>
  `## ${entry.title} — ${entry.color}\n\nProduct: \`${entry.slug}\`\n\n${entry.prompt}\n`).join('\n'));
console.log(`Exported ${entries.length} prompts for ${products.length} products without API calls.`);
