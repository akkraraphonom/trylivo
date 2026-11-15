/** Static copy and media that lived in the Framer pages (not in the CMS). */

export const site = {
  name: "TRYLIVO",
  title: "TRYLIVO – Everyday Apparel",
  description:
    "Modern apparel designed for everyday wear, combining timeless style, premium quality, and versatile comfort.",
  phone: "(123) 456 789",
  location: "California, USA",
  instagram: "Instagram",
  instagramUrl: "https://www.instagram.com/instagram",
};

export const announcement = ["NEW SEASON SALE", "UP TO 30% OFF"];

export const mainNav = [
  { label: "Shop", href: "/shop/collection/all", dropdown: true },
  { label: "Compare", href: "/compare" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const megaMenu = {
  categories: [
    { label: "All", href: "/shop/category/all" },
    { label: "Jackets", href: "/shop/category/jacket" },
    { label: "T-Shirts", href: "/shop/category/t-shirt" },
    { label: "Hoodies", href: "/shop/category/hoodie" },
    { label: "Sweaters", href: "/shop/category/sweater" },
  ],
  collections: [
    { label: "Men", slug: "men", image: "/images/category-men-2x.webp" },
    { label: "Women", slug: "women", image: "/images/category-women-2x.webp" },
    { label: "Kids", slug: "kid", image: "/images/category-kids-2x.webp" },
    { label: "Best Sellers", slug: "best-sellers", image: "/images/seasonal-relaxed-fit-cardigan-2x.webp" },
  ],
};

export const popup = {
  /** fraction of the page scrolled before the offer opens (template: 25%) */
  scrollTrigger: 0.25,
  storageKey: "ecom.popup.dismissed.v1",
  image: "/images/editorial-gallery-wrap-knit-2x.webp",
  title: "Unlock 30% Off",
  text: "Subscribe and receive an exclusive 30% discount on your first purchase.",
  cta: "Subscribe & Save",
  legal: "By subscribing, you agree to receive updates, promotions, and exclusive fashion news.",
};

export const footerNav = [
  {
    title: "Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop/collection/all" },
      { label: "Compare", href: "/compare" },
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/contact#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Men's collection", href: "/shop/collection/men" },
      { label: "Women's collection", href: "/shop/collection/women" },
      { label: "Kid's collection", href: "/shop/collection/kid" },
      { label: "Best sellers", href: "/shop/collection/best-sellers" },
      { label: "Seasonal Drop", href: "/shop/collection/seasonal-drop" },
      { label: "New arrivals", href: "/shop/collection/new-arrivals" },
    ],
  },
  {
    title: "Legals",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of service", href: "/terms-of-service" },
      { label: "Return & Refund Policy", href: "/return-and-refund-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "X/Twitter", href: "https://x.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
    ],
  },
];

export const heroSlides = [
  {
    image: "/images/hero-style-in-motion-2x.webp",
    position: "59% top",
    title: "Style in Motion",
    text: "New-season pieces made for everyday confidence.",
    href: "/shop/collection/all",
    card: { title: "Popular T-shirts", image: "/images/new-arrival-oversized-graphic-tee-2x.webp", href: "/shop/category/t-shirt" },
  },
  {
    image: "/images/hero-made-to-stand-out-2x.webp",
    position: "47% top",
    title: "Made to Stand Out",
    text: "Modern layers made for days that keep moving.",
    href: "/shop/collection/all",
    card: { title: "Popular Jackets", image: "/images/new-arrival-lightweight-jacket-hem-retouched.webp", href: "/shop/category/jacket" },
  },
  {
    image: "/images/hero-the-style-reset-2x.webp",
    position: "61% top",
    title: "The Style Reset",
    text: "Clean silhouettes, soft textures, standout ease.",
    href: "/shop/collection/all",
    card: { title: "Popular Hoodies", image: "/images/new-arrival-everyday-hoodie-2x.webp", href: "/shop/category/hoodie" },
  },
];

/** Product order used by the home sliders (as published in the template). */
export const newArrivalsOrder = ["everyday-hoodie", "lightweight-jacket", "oversized-graphic-tee", "kids-puffer-jacket"];
export const bestSellersOrder = [
  "everyday-hoodie",
  "lightweight-jacket",
  "zipper-jacket",
  "relaxed-fit-cardigan",
  "kids-graphic-t-shirt",
  "classic-hoodie",
  "oversized-graphic-tee",
  "graphic-sweatshirt",
  "kids-puffer-jacket",
  "soft-knit-sweater",
  "kids-everyday-hoodie",
];
export const bestSellerTabs = ["All", "Jacket", "Sweater", "Hoodie", "T-Shirt", "Cardigan"];

export const tickerWords = ["DESIGNED TO MOVE", "MADE TO LAST"];

export const seasonalDrop = {
  title: "Seasonal Drop",
  image: "/images/seasonal-banner-2x.webp",
  href: "/shop/collection/seasonal-drop",
  products: ["zipper-jacket", "relaxed-fit-cardigan", "kids-puffer-jacket", "kids-everyday-hoodie"],
};

export const shopByCategory = [
  {
    eyebrow: "FOR MEN",
    title: "Built For Daily Confidence",
    image: "/images/category-men-2x.webp?v=2",
    href: "/shop/collection/men",
  },
  {
    eyebrow: "FOR WOMEN",
    title: "Designed For Modern Living",
    image: "/images/category-women-2x.webp?v=2",
    href: "/shop/collection/women",
  },
  {
    eyebrow: "FOR KIDS",
    title: "Comfort For Every Adventure",
    image: "/images/category-kids-2x.webp?v=2",
    href: "/shop/collection/kid",
  },
];

export const videoShowcase = {
  video: "/videos/trylivo-everywhere-film-v7.mp4",
  poster: "/videos/trylivo-everywhere-film-v7-poster.jpg",
  tabs: [
    { label: "Jacket", href: "/shop/category/jacket" },
    { label: "Tees", href: "/shop/category/t-shirt" },
    { label: "Hoodies", href: "/shop/category/hoodie" },
  ],
  featured: ["zipper-jacket", "lightweight-jacket"],
};

export const usps = [
  {
    icon: "truck",
    title: "Worldwide Shipping",
    text: "We ship to over 100 countries with fast and reliable delivery. Track your order and get it wherever you are.",
  },
  {
    icon: "leaf",
    title: "Sustainable Cloths",
    text: "Every piece is made from responsibly sourced materials. Wear with purpose, live with less impact.",
  },
  {
    icon: "return",
    title: "Free 30 Days Returns",
    text: "Not satisfied? Return within 30 days for a full refund. No questions asked, totally hassle-free.",
  },
  {
    icon: "shield",
    title: "Secure Payments",
    text: "Shop safely with encrypted checkout. We support all major payment methods for your convenience.",
  },
] as const;

export const testimonials = [
  { name: "Ethan", quote: "Simple designs, great comfort, and fast delivery. Exactly what I was looking for.", video: "/videos/fIRtnbwFlD9Y6pZZ8MAUTABvY.mp4" },
  { name: "Noah", quote: "Clean styles that work anywhere. The quality and attention to detail stand out.", image: "/images/yS3zAxCDS2t35sHImxYjH0I80k.png" },
  { name: "Olivia", quote: "The quality exceeded my expectations. Every piece feels premium and fits perfectly.", video: "/videos/mGyMPeNKazzDaaM9N2V0nzb0gM.mp4" },
  { name: "Sophia", quote: "The fabric feels amazing and the fit is effortless. I wear it every week.", image: "/images/oFPyUntJXJlP9WAtwWoebObkPAM.png" },
  { name: "Mason", quote: "Modern, comfortable, and easy to style. Every order has been worth it.", video: "/videos/KzclN8qp4qDFuA0ccuMFd3pI5rE.mp4" },
  { name: "Liam", quote: "Great everyday essentials with a premium feel. I've already ordered again.", image: "/images/8nTAzqEU3n809ltXhD7254Kw.png" },
];

export const instagramImages = [
  "/images/RAbxLERWjB7Ep1afXpX04h7te4.png",
  "/images/1uAtXN5ElYg2SO1XEmtxkVLtD3o.png",
  "/images/qVBzzhw0q9OVQJ5Y2fsh5uFDI.png",
  "/images/0GgZqZEvOcWUPld2LxlNBnPAyKM.png",
  "/images/2Ov9AWslDuXwplH5crscxYv1I.png",
  "/images/nIbc02Cny4vQkZ5NMys2AEc1WA.png",
];

export const newsletter = {
  image: "/images/fittavue-newsletter.webp",
  title: "Join Our Newsletter",
  text: "Be the first to discover new arrivals, exclusive offers, and style inspiration delivered to your inbox.",
};


export const productPerks = [
  {
    title: "Free Shipping Worldwide",
    text: "We offer reliable worldwide shipping on eligible orders, making it easier to shop your favorite styles no matter where you are located.",
  },
  {
    title: "Easy Returns & Exchanges",
    text: "If your purchase isn't quite right, you can request a return or exchange within our return period, subject to our policy terms.",
  },
  {
    title: "Premium Quality Materials",
    text: "Every piece is thoughtfully crafted using carefully selected materials, delivering lasting comfort, durability, and a premium feel for everyday wear.",
  },
];

export const contact = {
  title: "Get in Touch",
  text: "Have a question about an order, product, or partnership? We'd love to hear from you and will get back soon.",
  image: "/images/trylivo-contact-sunglasses.webp",
};

export const faqs = [
  { q: "How long does shipping take?", a: "Orders are typically processed within 1–2 business days and delivered based on your selected shipping method." },
  { q: "Do you offer international shipping?", a: "Yes, we ship to many countries worldwide. Shipping rates and delivery times vary by location." },
  { q: "What is your return policy?", a: "Eligible items can be returned within the specified return window if they are unworn and in original condition." },
  { q: "How do I choose the right size?", a: "Use our size guide on each product page to find the best fit based on your measurements." },
  { q: "Can I track my order?", a: "Yes, once your order ships, you'll receive a tracking link by email to follow its progress." },
  { q: "How can I contact support?", a: "You can reach our support team through the contact form or by using the contact details provided on this page." },
];

export const pageHeroes = {
  journal: {
    image: "/images/ZKB4fWu4waKQDEeUJuY7xYwOsY0.png",
    title: "Journal",
    text: "Explore style guides, seasonal trends, and fashion insights designed to inspire your everyday wardrobe.",
  },
  search: {
    image: "/images/ZKB4fWu4waKQDEeUJuY7xYwOsY0.png",
    title: "Search",
    text: "Find the pieces you're looking for across every collection.",
  },
  wishlist: {
    image: "/images/trylivo-wishlist-hero-retouched.webp",
    title: "Your Favorites",
    text: "A curated collection of the pieces you've saved for later, ready whenever inspiration strikes.",
  },
};
