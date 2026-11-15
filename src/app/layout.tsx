import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { CurrencyProvider } from "@/lib/currency";
import { StoreProvider } from "@/lib/store";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { EditorialCarousel } from "@/components/sections/EditorialCarousel";
import { Newsletter } from "@/components/sections/Newsletter";
import { NewsletterPopup } from "@/components/sections/NewsletterPopup";
import { EntryLoader } from "@/components/layout/EntryLoader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "TRYLIVO – Everyday Apparel", template: "%s – TRYLIVO" },
  description: site.description,
  icons: { icon: { url: "/trylivo-tab-icon.svg", type: "image/svg+xml" } },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/GeneralSans-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="min-h-dvh">
        <CurrencyProvider>
        <StoreProvider>
          <EntryLoader>
          <SmoothScroll />
          <div className="fixed inset-x-0 top-0 z-40">
            <AnnouncementBar />
            <Header />
          </div>
          {/* announcement (32px) + nav (88 / 96 / 100px) = --hdr; hero sections pull themselves up under both */}
          <main className="pt-[var(--hdr)]">{children}</main>
          <EditorialCarousel />
          <Newsletter />
          <Footer />
          <CartDrawer />
          <NewsletterPopup />
          </EntryLoader>
        </StoreProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
