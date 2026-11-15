import Link from "next/link";
import Image from "next/image";
import { footerNav, site } from "@/lib/site";
import { NewsletterForm } from "@/components/sections/NewsletterForm";

const payments = ["visa", "mastercard", "amex", "paypal", "diners", "discover"];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const cls = "group relative inline-block py-0.5 text-[16px] leading-[1.2] font-medium tracking-[-0.03em]";
  const line = null;
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {children}
      {line}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
      {line}
    </Link>
  );
}

export function Footer() {
  return (
    <footer data-section="Footer" className="overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-[1360px] px-5 pt-[72px] pb-[42px] md:px-[30px] md:pb-[52px] lg:px-[50px] lg:pb-[72px]">
        <div className="flex flex-col gap-[53px] md:gap-[57px] lg:flex-row lg:justify-between lg:gap-[72px]">
          <div className="grid grid-cols-[193px_1fr] gap-y-10 md:flex md:justify-between lg:max-w-[832px] lg:flex-1">
            {footerNav.map((col, i) => (
              <div key={col.title} className="flex flex-col gap-3 pr-5" style={{ minWidth: [97, 157, 177, 91][i] }}>
                <p className="text-[12px] leading-[1.2] font-medium tracking-[-0.02em]">{col.title}</p>
                <ul className="flex flex-col gap-1">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink href={l.href}>{l.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-9 pt-5 md:gap-12 md:pt-0 lg:w-[356px] lg:pt-5">
            <div className="flex max-w-[288px] flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-[14px] leading-[1.2] font-medium tracking-[-0.02em] md:text-[15px] lg:text-[16px]">Subscribe to Newsletter</p>
                <p className="max-w-[260px] text-[14px] leading-[1.2] font-medium tracking-[-0.02em]">
                  Get early access to new arrivals, exclusive discounts, and seasonal style updates.
                </p>
              </div>
              <NewsletterForm variant="footer" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[12px] leading-[1.2] tracking-[-0.02em]">Payment secured by</p>
              <ul className="flex gap-2">
                {payments.map((p) => (
                  <li key={p}>
                    <img src={`/icons/pay-${p}.svg`} alt={p} width={38} height={24} className="block h-6 w-[38px]" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-28 flex max-w-[1059px] flex-col gap-[11px]">
          <div className="flex flex-wrap items-center gap-x-9 gap-y-2 text-[12px] leading-[1.2] tracking-[-0.02em]">
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          </div>
          <div className="select-none [mask-image:linear-gradient(0deg,transparent_0%,#000_81%)]">
            <Image src="/images/trylivo-footer-wordmark.svg" alt={site.name} width={1059} height={130} unoptimized className="h-auto w-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}
