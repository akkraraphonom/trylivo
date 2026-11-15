import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildTryOnPrompt, validateTryOnRequest } from '../src/lib/try-on.ts';

test('selected color is validated and carried into the garment prompt', () => {
  const product = { slug: 'everyday-hoodie', title: 'Everyday Hoodie', type: 'Hoodie', options: [{ name: 'Color', values: ['Pink', 'Beige'] }] };
  assert.equal(validateTryOnRequest(product, 'Beige'), true);
  assert.equal(validateTryOnRequest(product, 'Purple'), false);
  const prompt = buildTryOnPrompt(product, 'Beige');
  assert.match(prompt, /Beige/);
  assert.match(prompt, /reference image/);
  assert.match(prompt, /face/);
});

const catalog = ['products', 'editorial-products'].flatMap(name => JSON.parse(readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8')));

test('every catalog garment and color has its own detailed prompt, generated entirely offline', () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Prompt generation must not use the API'); };
  try {
    const prompts = new Set();
    for (const product of catalog) {
      for (const color of product.options.find(o => o.name === 'Color')?.values ?? []) {
        const prompt = buildTryOnPrompt(product, color);
        assert.ok(prompt.includes(`Construction: `), `${product.slug} lacks garment details`);
        assert.ok(prompt.includes(`Colorway ${color}: `), `${product.slug}/${color} lacks a color profile`);
        assert.ok(prompt.includes('reference image'), `${product.slug} must use the actual garment`);
        assert.ok(prompt.includes('skin'), `${product.slug} must preserve skin`);
        prompts.add(prompt);
      }
    }
    assert.equal(prompts.size, 34);
  } finally { globalThis.fetch = originalFetch; }
});

test('garment-specific construction is not copied from unrelated products', () => {
  const promptFor = slug => { const p = catalog.find(p => p.slug === slug); return buildTryOnPrompt(p, p.options.find(o => o.name === 'Color').values[0]); };
  assert.match(promptFor('rehearsal-rugby-shirt'), /horizontal.*stripes/);
  assert.match(promptFor('kids-everyday-hoodie'), /paper airplanes/);
  assert.match(promptFor('gallery-wrap-knit'), /asymmetric/);
  assert.match(promptFor('vermilion-sculpted-knit'), /puff/);
  assert.match(promptFor('lightweight-jacket'), /two.*chest.*pockets/);
});

test('missing garment/color profiles fail instead of silently making up details', () => {
  assert.throws(() => buildTryOnPrompt({ slug: 'unknown', title: 'Unknown', type: 'Hoodie' }, 'Red'));
  assert.throws(() => buildTryOnPrompt(catalog[0], 'Unsupported color'));
});

test('unknown products and invalid colors never request a paid session', () => {
  assert.equal(validateTryOnRequest(undefined, 'Pink'), false);
  assert.equal(validateTryOnRequest({ options: [] }, { malicious: true }), false);
});
