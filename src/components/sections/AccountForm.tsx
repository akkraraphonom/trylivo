"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/format";

/** Demo sign-in / register form — hook it to your auth provider (Shopify customer accounts, NextAuth, Clerk…). */
export function AccountForm() {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl bg-surface p-8 text-center" role="status">
        <p className="text-2xl tracking-[-0.03em]">{mode === "signin" ? "Welcome back" : "Account created"}</p>
        <p className="mt-2 text-sm text-muted">Accounts are a demo in this build — no data was sent anywhere.</p>
        <Link href="/shop/collection/all" className="btn-dark mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 rounded-full bg-surface p-1 text-sm" role="tablist">
        {(["signin", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn("rounded-full py-2 transition-colors", mode === m ? "bg-white shadow-sm" : "text-muted")}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        {mode === "register" && <input name="name" required placeholder="Full name" aria-label="Full name" className="input" />}
        <input name="email" type="email" required placeholder="Email address" aria-label="Email address" className="input" />
        <input name="password" type="password" required minLength={6} placeholder="Password" aria-label="Password" className="input" />
        <button type="submit" className="btn-dark mt-2 w-full py-3.5">
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
