import type { Metadata } from "next";
import { AccountForm } from "@/components/sections/AccountForm";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <section className="container-site flex min-h-[70vh] flex-col items-center py-16 md:py-24">
      <SplitText as="h1" text="My Account" className="h-section block text-center" from="x" stagger={0.05} />
      <SplitText
        as="p"
        text="Sign in to track orders, save your details and check out faster."
        className="mt-3 block max-w-sm text-center text-muted"
        from="y"
        stagger={0.008}
        startDelay={0.4}
      />
      <Reveal y={30} delay={0.3} className="mt-10 w-full max-w-md">
        <AccountForm />
      </Reveal>
    </section>
  );
}
