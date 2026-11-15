# TRYLIVO

Fashion storefront built with Next.js 15, React 19, TypeScript and Tailwind CSS 4.

Live site: https://trylivo.malysmadson.workers.dev

## Development

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Storefront media is included. The legacy asset-copy script skips copying when images are present.

## Features

- Categories, collections, search, filters and sorting
- Color-specific galleries and hover previews
- Local cart and wishlist
- Responsive layout, entry loader and Lenis smooth scrolling
- Artist editorial collection and silent promotional film
- Try-ons using the selected garment and color

## Try-ons

Decart sessions are restricted to local development. Set DECART_API_KEY in .env.local to enable them. Opening the dialog does not start a paid session. Starting a preview sends video to Decart, with a 30-second limit. Production sessions are disabled. Never commit API keys.

See [local setup](docs/try-on-local.md) and [garment prompts](docs/try-on-prompts.md).

## Validation and deployment

```sh
npm run typecheck
node --test tests/try-on.test.mjs
npm run build
```

Cloudflare deployment uses OpenNext and Wrangler. Authenticate with your own account and update wrangler.jsonc for your deployment. Set SERVE_STATIC_IMAGES=true before npm run deploy.

Checkout, newsletter and contact submission are demonstration flows, not a connected commerce backend.

## Structure

- src/app: routes and local try-on API
- src/components: storefront and fitting-room UI
- src/data and src/lib: catalog, variants, prompts and state
- public: images, fonts and video
- scripts: asset preparation utilities
- tests: offline validation

## Origin and assets

Started as a Next.js rewrite of the ECOM Framer template by Soyeb, followed by TRYLIVO styling, catalog media and feature work. Some template content and third-party assets remain. Public repository visibility does not grant a license to reuse those assets; their original terms apply. No blanket asset license is asserted here.
