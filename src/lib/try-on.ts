import type { Product } from './types';

export const TRY_ON_MODEL = 'lucy-vton-3.6';
export const TRY_ON_SECONDS = 30;

export function validateTryOnRequest(product: Pick<Product, 'options'> | undefined, color: unknown) {
  if (!product || (color !== undefined && typeof color !== 'string')) return false;
  const colors = product.options.find(option => option.name === 'Color')?.values ?? [];
  return colors.length ? colors.includes(color as string) : !color;
}

type GarmentProfile = { construction: string; details: string; colors: Record<string, string> };

// Authored against the current garment-only catalog images, not the older editorial photographs.
const garments: Record<string, GarmentProfile> = {
  'lightweight-jacket': {
    construction: 'A relaxed woven overshirt jacket with a pointed fold-down collar, straight center-front button placket, dark round buttons, two rectangular chest patch pockets, long sleeves with buttoned cuffs and a straight hip-length hem.',
    details: 'Keep both pocket outlines and their top openings distinct. Preserve the understated seam stitching, collar tips and overlapping placket. Keep the lower placket flat and aligned with the hem; do not invent a triangular cutout, zipper or hood.',
    colors: { 'Stone Taupe': 'muted warm gray-brown taupe cloth with dark brown buttons', 'Charcoal Gray': 'deep neutral charcoal-gray cloth with dark buttons; no leftover taupe panels at the collar, cuffs or placket' },
  },
  'soft-knit-sweater': {
    construction: 'A plain relaxed long-sleeve pullover with a round crew neck, soft fuzzy knit surface, slightly dropped shoulders, rib-knit neckline, cuffs and straight waistband.',
    details: 'Preserve the fine knit grain and soft volume without making the fabric glossy or plastic. The chest is plain: no flowers, graphics, buttons, pockets or hood. Keep the knit cuffs distinct from exposed wrists.',
    colors: { Brown: 'warm deep chocolate-brown knit throughout, with natural lighter fibers and shadow variation' },
  },
  'kids-everyday-hoodie': {
    construction: 'A relaxed pullover hoodie with a crossover hood opening, long sleeves, a front kangaroo pocket, fitted cuffs and a smooth even lower band. No drawstrings or front zipper.',
    details: 'Reproduce the cream clouds, orange paper airplanes, dotted flight paths and layered blue mountain landscape with cream snowy peaks at the same relative positions as the reference, including sleeve and pocket artwork. Keep the hem continuous rather than jagged or vertically crumpled. Preserve the source person age and proportions; do not turn an adult into a child.',
    colors: { Blue: 'light sky-blue base fabric; keep cream clouds, orange planes and dark-blue mountains separately colored', 'Dark Green': 'deep forest-green base across torso, hood, both sleeves, cuffs and hem; retain the blue mountains, cream clouds and orange planes from this reference', Red: 'muted rich red base across torso, hood, both sleeves, cuffs and hem; retain the blue mountains, cream clouds and orange planes from this reference' },
  },
  'relaxed-fit-cardigan': {
    construction: 'A relaxed soft-knit cardigan with a V-neck, ribbed neckline and button bands, pale round front buttons, long sleeves, ribbed cuffs and a straight ribbed hem.',
    details: 'Preserve scattered small embroidered flowers with pale cream and blush-pink petals and muted green stems, at the reference positions and scale. Keep the V-neck opening as exposed skin or existing visible underlayer, not painted knit. Do not tint the hands, hair or background; carry the knit color all the way to sleeve edges while keeping embroidery separate.',
    colors: { Beige: 'warm oatmeal-beige knit with cream buttons and pastel floral embroidery', 'Sage Green': 'soft muted sage-green knit, including the neckline, button bands, cuffs and hem; preserve pale buttons and pastel floral embroidery without beige gaps in the base knit' },
  },
  'kids-graphic-t-shirt': {
    construction: 'A regular-fit short-sleeve cotton T-shirt with a round crew neck, neat sleeve hems and a straight lower hem.',
    details: 'Keep the small orange smiling comet graphic and surrounding tiny stars on the wearer left chest, matching the reference placement and size. Do not enlarge it into a full-chest print. Sleeves end above the elbows; forearms remain bare. Preserve the source person age and body proportions.',
    colors: { Blue: 'clear light sky-blue fabric with the orange comet artwork unchanged', Beige: 'warm sand-beige fabric, including collar, shoulders, sleeve hems and bottom edge; no blue strips, and keep the orange comet artwork unchanged' },
  },
  'classic-hoodie': {
    construction: 'A plain fleece pullover hoodie with a roomy hood, two tonal drawstrings, long sleeves, a kangaroo pocket, fitted rib cuffs and a straight ribbed lower band.',
    details: 'Keep the chest completely unprinted. Preserve the hood inner folds, pocket openings and drawstring ends. Render cloth shading from the source scene instead of a flat color overlay. The hood rim must sit behind hair and neck, and cuffs must stop cleanly at the wrists.',
    colors: { Black: 'soft near-black fabric with readable folds, not crushed featureless black', Gray: 'dark slate-gray fabric, not pale silver; keep continuous cloth color around hood edges, fingers, pocket and cuffs', 'Dark Green': 'deep forest-green fabric and tonal trims; keep genuine fold shadows dark without black patches from another colorway' },
  },
  'everyday-hoodie': {
    construction: 'A relaxed fleece pullover hoodie with dropped shoulders, a plush hood, two drawstrings, long full-length sleeves, a kangaroo pocket, rib-knit cuffs and a straight ribbed hem.',
    details: 'Reproduce the delicate pale line-art landscape across the upper chest: flowing horizontal lines and one small outlined circle above them. Keep the fine line weight, scale and position; no lettering or extra logos. Keep both sleeves full length down to the wrists, including when arms move. Preserve clean hood edges behind loose hair and below the chin.',
    colors: { Pink: 'muted dusty-rose pink fleece, tonal trims and pale cream chest line art', Lavender: 'soft lavender-purple fleece across the whole hood, sleeves, cuffs and pocket, with pale chest line art; no dusty-pink remnants', Beige: 'warm sandy-beige fleece and trims, with pale cream chest line art; no pink or lavender flecks at the hood rim, under hair or along cuffs' },
  },
  'oversized-graphic-tee': {
    construction: 'An oversized washed-cotton crew-neck T-shirt with dropped shoulders, wide short sleeves reaching toward the elbows, stitched sleeve edges and a loose straight hem.',
    details: 'Preserve the large central vintage sun-and-moth artwork: warm rusty sun disk and rays above spread moth wings with distressed brown detailing. Keep its reference proportions and worn texture. No text, pockets or new symbols. Keep the sleeve underside part of the shirt, while preserving bare arms and separating the lower hem from trousers.',
    colors: { Black: 'washed charcoal-black cotton with warm distressed sun-and-moth artwork', Blue: 'washed medium denim-blue cotton with the warm brown and rust artwork retained; no original black fabric wedges on sleeves', Beige: 'washed sandy-beige cotton with brown and rust artwork retained; do not tint the trousers or arms beige' },
  },
  'graphic-sweatshirt': {
    construction: 'A relaxed long-sleeve crew-neck sweatshirt with dropped shoulders, fitted cuffs and even smooth neckline and lower waistband contours.',
    details: 'Copy the large pale abstract chest composition: one circular disk and flowing curved geometric shapes, preserving their negative spaces, scale and position. Keep the collar and hem smooth rather than serrated, torn or vertically rippled. No hood, strings, pockets, text or additional motifs.',
    colors: { 'Charcoal Gray': 'very dark charcoal fabric with pale warm cream abstract artwork', Yellow: 'muted golden mustard-yellow fabric with pale cream artwork; no charcoal borders or patches in the base cloth', 'Steel Blue': 'muted medium steel-blue fabric with pale cream artwork; preserve natural highlights instead of a translucent blue overlay' },
  },
  'kids-puffer-jacket': {
    construction: 'A hooded insulated puffer jacket with horizontal padded channels across torso and sleeves, a center-front zipper, subtle side pocket openings, full-length sleeves and snug elastic cuffs.',
    details: 'Keep each quilted channel continuous around the body with natural rounded padding and consistent seam spacing. Preserve the padded hood rim and zipper track. Fill all garment panels, including the narrow hood areas next to the neck, with the selected cloth color; keep the neck, skin and trousers untouched. Do not flatten padding into paint or turn seam shadows into another fabric color. Preserve the source person age and proportions.',
    colors: { Navy: 'deep navy-blue shell with naturally darker quilting seams', 'Sage Green': 'muted olive-sage shell with coordinated zipper and trims; no navy hood inserts or cuffs unless actually shown in this reference', Orange: 'earthy burnt-orange, rust-brown shell as pictured, not vivid fluorescent orange; coordinated hood, zipper and cuffs' },
  },
  'zipper-jacket': {
    construction: 'A clean lightweight zip-front jacket with a short upright stand collar, a straight central metal zipper, long sleeves, fitted cuffs and a neat lower band.',
    details: 'Keep the simple unprinted front and smooth woven fabric, with subtle folds and the reference seam placement. Follow the reference closure state and silhouette. Do not substitute a pointed shirt collar, oversized chest patch pockets, a hood or bomber sleeve-pocket badges.',
    colors: { 'Charcoal Gray': 'dark charcoal-gray cloth with a contrasting light metal zipper; preserve fabric highlights without making it shiny leather' },
  },
  'gallery-baby-tee': {
    construction: 'A fitted short-sleeve baby tee with a close round crew neck, narrow neck binding, small cap-like sleeves and a neat waist-length hem.',
    details: 'Keep the plain stretch-cotton surface and gentle horizontal shaping folds through the torso. Preserve the fitted silhouette without changing the body underneath. No graphics, buttons, pockets or long sleeves; exposed arms remain skin.',
    colors: { 'Ice Blue': 'very pale cool ice-blue fabric throughout, softly shaded rather than saturated blue or gray' },
  },
  'vermilion-sculpted-knit': {
    construction: 'A fitted rib-knit sweater with a short high round neckline, pronounced sculptural puff shoulders, rounded upper sleeves and long close-fitting ribbed forearm cuffs.',
    details: 'Keep the dramatic gathered shoulder volume and clear transition from voluminous upper sleeves to slim lower sleeves. Preserve vertical knit ribs and the fitted waist. Do not smooth it into an ordinary sweater or inflate the actual arms; no print, buttons or hood.',
    colors: { Vermilion: 'rich warm vermilion-red knit with darker red folds; maintain the same red through shoulders, forearms, neckline and hem' },
  },
  'studio-heavyweight-hoodie': {
    construction: 'A heavyweight plain pullover hoodie with a substantial crossover hood, dropped shoulders, wide long sleeves, a large kangaroo pocket, ribbed cuffs and a straight ribbed lower band.',
    details: 'Keep the dense matte fleece and roomy structured silhouette. The reference has no dangling drawstrings and no chest graphic: do not borrow either from Everyday Hoodie. Preserve pocket topstitching, hood thickness and the clean transition at the wrists.',
    colors: { 'Off White': 'warm off-white cream fleece with tonal seams and trims, not pure luminous white or yellow' },
  },
  'night-studio-jacket': {
    construction: 'An oversized black woven zip jacket with a pointed collar, dropped shoulders, roomy full-length sleeves, gathered cuffs and an elasticated drawcord hem.',
    details: 'Keep the irregular pale paint-splatter pattern and small speckles exactly where the reference shows them, with their varied size and density. Preserve the central metal zipper and loose jacket volume. The garment reference contains the jacket alone: do not import an editorial model or invent a gray hoodie underneath. Splatter stays on the jacket, not skin or trousers.',
    colors: { Black: 'washed near-black shell with off-white and gray paint splashes; preserve the splashes as design, not color leakage' },
  },
  'ivory-cropped-zip-jacket': {
    construction: 'A fitted cropped jacket with a tall stand collar, a full center metal zipper, shaped curved panel seams, long straight sleeves and a clean cropped waistband.',
    details: 'Keep the short body length and sculpted seam geometry without stretching the torso or extending the jacket over the hips. Preserve the zipper from collar to hem and smooth structured cloth. No hood, floral print, patch pockets or dangling cords.',
    colors: { Ivory: 'warm pale ivory cloth with tonal stitching and a light metal zipper; distinguish highlights from the beige background' },
  },
  'pottery-chore-jacket': {
    construction: 'A boxy canvas chore jacket with a pointed fold-down collar, dark round front buttons, one chest patch pocket and two larger lower patch pockets, long sleeves and a straight hem.',
    details: 'Keep the sturdy matte canvas texture, topstitched pocket edges and workwear seams. Preserve the asymmetrical chest-pocket placement from the reference, not two chest pockets from Lightweight Jacket. No zipper, hood, paint splatters or embroidered flowers.',
    colors: { Olive: 'muted dark earthy olive-green canvas with dark buttons and subtle lighter stitching' },
  },
  'rehearsal-rugby-shirt': {
    construction: 'A relaxed long-sleeve rugby shirt with broad horizontal burgundy-and-cream stripes across torso and sleeves, a contrasting ivory pointed collar and short front placket.',
    details: 'Match the stripe order, widths and alignment at the sleeve joins to the reference. Keep the ivory collar and placket separate from the striped body, with burgundy cuffs and hem band as shown. Do not convert the stripes into solid fabric, short sleeves or a full-length button opening.',
    colors: { 'Burgundy & Cream': 'alternating deep wine-burgundy and warm cream bands, ivory collar and placket; preserve both stripe colors instead of recoloring the entire shirt' },
  },
  'gallery-wrap-knit': {
    construction: 'A fitted fine-rib knit top with a diagonal crossover V-neck wrap front, long slim sleeves, small side fastening buttons and a deliberately asymmetric pointed lower hem.',
    details: 'Preserve the diagonal overlap, gathered wrap folds and reference side-button placement. Keep the asymmetric hem as an intentional design; do not straighten it like a hoodie hem. The neckline opening remains skin or existing visible underlayer. No hood, zipper, chest graphic or conventional central button row.',
    colors: { Charcoal: 'deep charcoal-black rib knit with visible diagonal rib texture and small contrasting pale side buttons' },
  },
};

export function buildTryOnPrompt(product: Pick<Product, 'slug' | 'title' | 'type'>, color?: string) {
  const garment = garments[product.slug];
  const colorway = color && garment?.colors[color];
  if (!garment || !colorway) throw new Error(`No reviewed try-on prompt for ${product.slug}/${color ?? ''}`);
  return [
    `Replace only the person's top with ${product.title}, using the supplied garment-only reference image.`,
    `Construction: ${garment.construction}`,
    `Details: ${garment.details}`,
    `Colorway ${color}: ${colorway}. The selected reference image is the final authority for hue, trim and artwork; adapt brightness to the source lighting without importing the reference background.`,
    'Preserve the original face, identity, hair, skin, hands, body proportions, pose, movement, trousers, accessories, camera and background. Fit the garment to the existing person, not the person to the garment. Keep hands and hair naturally in front of the cloth. Confine cloth color to garment boundaries, including underarms, neckline, sleeve openings and hem; no color spill, halos or residual original-clothing fragments. Keep seams and artwork stable across frames and attached to the fabric as it folds. Do not invent lettering, logos, extra limbs or extra layers. Do not alter existing video watermarks.',
  ].join('\n');
}
