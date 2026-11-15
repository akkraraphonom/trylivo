# Local virtual try-on

The product page Try-ons button uses the selected color's garment-only image (the second gallery image), with a product/color-specific reference prompt.

Detailed garment construction and color profiles are maintained in `src/lib/try-on.ts`. All 19 products and 34 product/color pairs have reviewed descriptions based on the current garment images. See `docs/try-on-prompts.md` for the full offline inventory; regenerate with `node scripts/export-try-on-prompts.mjs`. This detailed prompt revision has not been run against Decart. Tests check catalog coverage and prompt selection without making network calls.

- SDK: @decartai/sdk, model lucy-vton-3.6.
- Secret: DECART_API_KEY in .env.local, never NEXT_PUBLIC_ and never committed.
- GET /api/try-on/session checks configuration without exposing credentials.
- POST /api/try-on/session validates product/color, requires a matching Origin, and issues a model/origin-scoped token valid for 60 seconds with a 30-second maximum realtime session.
- The endpoint only works in development on localhost/127.0.0.1/::1. Production intentionally returns 403 until authentication, quotas and deployment secret configuration are added.
- Camera mode uses no audio. Video upload supports MP4/WebM up to 50 MB in browsers with HTMLVideoElement.captureStream (Chrome/Edge).
- Start is explicit. Stop, dialog close, unmount, tab hiding and the 30-second timer release tracks and disconnect. Input video is not saved by this app.
- The account watermark is retained. Reference-image generation is an approximate visual preview, not a size guarantee or exact reproduction of fine artwork.

Validation: node --test tests/try-on.test.mjs; npm run typecheck. Browser trial on localhost successfully streamed the selected Beige Everyday Hoodie through Decart using a sample video. Garment details, particularly cuffs and artwork, can still vary.
