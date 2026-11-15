"use client";

import { useState } from "react";

const field =
  "h-[47px] w-full rounded-full md:h-[49px] bg-white px-5 text-[16px] text-ink outline-none inset-ring inset-ring-muted transition-shadow placeholder:text-muted focus:inset-ring-ink";

/** Client-side form. Wire `onSubmit` to a route handler / Formspree / Resend to actually send. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="flex flex-col gap-9 pt-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        e.currentTarget.reset();
      }}
    >
      <div className="flex flex-col gap-6">
        <Label text="Name">
          <input name="name" placeholder="Your full name" required className={field} />
        </Label>
        <Label text="Email">
          <input name="email" type="email" placeholder="Your email address" required className={field} />
        </Label>
        <Label text="Phone">
          <input name="phone" type="tel" placeholder="Your phone number" required className={field} />
        </Label>
        <Label text="Message">
          <textarea
            name="message"
            required
            placeholder="Write your message here"
            className="h-[133px] w-full resize-none rounded-xl bg-white px-5 py-3.5 text-[16px] text-ink outline-none inset-ring md:py-[15px] inset-ring-muted placeholder:text-muted focus:inset-ring-ink"
          />
        </Label>
      </div>
      <button type="submit" className="h-[46px] w-full rounded-full bg-ink md:h-[50px] text-[16px] leading-[1.2] tracking-[-0.02em] text-white">
        {sent ? "Thank you! We'll be in touch." : "Submit"}
      </button>
    </form>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-4 text-[14px] leading-[1.2] tracking-[-0.02em] md:gap-5 md:text-[16px]">
      {text}
      {children}
    </label>
  );
}
