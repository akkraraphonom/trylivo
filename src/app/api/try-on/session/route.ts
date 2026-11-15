import { createDecartClient } from '@decartai/sdk';
import { getProduct } from '@/lib/data';
import { productImagesForColor } from '@/lib/product-preview';
import { buildTryOnPrompt, TRY_ON_MODEL, TRY_ON_SECONDS, validateTryOnRequest } from '@/lib/try-on';

export const dynamic = 'force-dynamic';
const response = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
// This trial endpoint is intentionally unavailable on a deployed site.
function isLocal(request: Request) {
  return process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1', '[::1]'].includes(new URL(request.url).hostname);
}
export async function GET(request: Request) {
  return response({ configured: isLocal(request) && Boolean(process.env.DECART_API_KEY), localOnly: true });
}
export async function POST(request: Request) {
  if (!isLocal(request) || request.headers.get('origin') !== new URL(request.url).origin) return response({ error: 'Local try-on only.' }, 403);
  let input;
  try { input = await request.json(); } catch { return response({ error: 'Invalid request.' }, 400); }
  const product = typeof input?.slug === 'string' ? getProduct(input.slug) : undefined;
  if (!product || !validateTryOnRequest(product, input.color)) return response({ error: 'Please select a valid product and color.' }, 400);
  const garment = productImagesForColor(product, input.color)[1];
  if (!garment) return response({ error: 'A garment reference is not available for this color.' }, 400);
  const apiKey = process.env.DECART_API_KEY;
  if (!apiKey) return response({ error: 'Local setup needed: add DECART_API_KEY to .env.local and restart the dev server.' }, 503);
  let prompt: string;
  try { prompt = buildTryOnPrompt(product, input.color); }
  catch { return response({ error: 'A reviewed try-on prompt is not available for this product and color.' }, 400); }
  try {
    const token = await createDecartClient({ apiKey }).tokens.create({
      expiresIn: 60, allowedModels: [TRY_ON_MODEL], allowedOrigins: [new URL(request.url).origin],
      constraints: { realtime: { maxSessionDuration: TRY_ON_SECONDS } },
    });
    return response({ apiKey: token.apiKey, expiresAt: token.expiresAt, image: garment.src, prompt, duration: TRY_ON_SECONDS });
  } catch {
    return response({ error: 'Decart could not start a session. Check the API key and available credits.' }, 502);
  }
}
