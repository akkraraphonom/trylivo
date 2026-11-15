"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/format";

/**
 * Client-only newsletter form. Hook `onSubscribe` up to your ESP
 * (Mailchimp, Klaviyo, Resend…) — right now it just shows a confirmation.
 */
export function NewsletterForm({ variant = "hero", className }: { variant?: "hero" | "footer"; className?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setDone(true);
    setEmail("");
  };

  if (done) {
    return (
      <p className={cn("text-sm", variant === "footer" ? "text-white/80" : "text-white", className)} role="status">
        Thanks for subscribing — check your inbox soon.
      </p>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={onSubmit} className={cn("flex h-[45px] w-full items-center rounded-full border border-[#dedede] bg-ink", className)}>
        <label htmlFor="footer-email" className="sr-only">
          Email
        </label>
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-full min-w-0 flex-1 bg-transparent pt-3 pr-0 pb-[13px] pl-[26px] text-[16px] font-medium tracking-[-0.02em] text-white outline-none placeholder:text-[#dbdbdb]"
        />
        <button type="submit" aria-label="Subscribe" className="grid size-[45px] shrink-0 place-items-center">
          <svg width="13" height="13" viewBox="0 0 8.3 8.3" fill="currentColor" className="rotate-45" aria-hidden>
            <path d="M 0.19 7.19 C -0.063 7.444 -0.063 7.856 0.19 8.11 C 0.444 8.363 0.856 8.363 1.11 8.11 L 0.65 7.65 Z M 8.3 0.65 C 8.3 0.291 8.009 0 7.65 0 L 1.8 0 C 1.441 0 1.15 0.291 1.15 0.65 C 1.15 1.009 1.441 1.3 1.8 1.3 L 7 1.3 L 7 6.5 C 7 6.859 7.291 7.15 7.65 7.15 C 8.009 7.15 8.3 6.859 8.3 6.5 Z M 0.65 7.65 L 1.11 8.11 L 8.11 1.11 L 7.65 0.65 L 7.19 0.19 L 0.19 7.19 Z" />
          </svg>
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex w-full max-w-[486px] items-start rounded-full border-2 border-[#dedede] bg-black/[0.06] p-1.5", className)}
    >
      <label htmlFor="hero-email" className="sr-only">
        Email
      </label>
      <input
        id="hero-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="h-[34px] min-w-0 flex-1 bg-transparent px-5 text-[14px] font-medium tracking-[-0.02em] text-white outline-none placeholder:text-[#ededed] md:h-10 md:text-[16px] lg:h-[45px] lg:text-[18px]"
      />
      <button
        type="submit"
        className="h-[34px] shrink-0 rounded-full bg-white px-[18px] text-[14px] leading-[1.2] font-medium tracking-[-0.02em] text-ink md:h-10 md:text-[16px] lg:h-[45px] lg:text-[18px]"
      >
        Subscribe
      </button>
    </form>
  );
}
