import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Steps } from "@/components/sections/Steps";
import { Customize } from "@/components/sections/Customize";
import { Share } from "@/components/sections/Share";
import { Showcase } from "@/components/sections/Showcase";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { WhyBarcodesQR } from "@/components/sections/WhyBarcodesQR";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { ReadyCta } from "@/components/sections/ReadyCta";
import { MobileCta } from "@/components/sections/MobileCta";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ signin?: string }>;
}) {
  const [session, { signin }] = await Promise.all([auth(), searchParams]);

  return (
    <>
      {/* `?signin=` is how a signed-out visit to a protected page, or a stale
          sign-in link, arrives here. Read on the server so the header does
          not need `useSearchParams` and the page can still be prerendered. */}
      <Header user={session?.user} openLogin={!!signin && !session?.user} />
      {/*
        One sequence for both breakpoints. mainB.html (desktop) and
        main_mobile.html list their sections in the same order, so each
        component below carries its mobile and desktop markup side by side
        under one id. Features, Customize and Share exist only in mainB.html —
        on mobile the hero card and the Steps demos carry that content — so
        they are `hidden md:block` outright.
      */}
      <main>
        <Hero />
        <Features />
        <Steps />
        <Customize />
        <Share />
        <Showcase />
        <WhyBarcodesQR />
        <WhyChoose />
        {/*
          Reviews is deliberately NOT here. The designer's homepage has no
          reviews section, so it was removed on 2026-09-02. Reviews.tsx is kept
          for a /reviews page that does not exist yet — see LAUNCH.md.
        */}
        <Pricing />
        <Faq />
        <ReadyCta />
      </main>
      <Footer />
      {/* main_mobile.html's sticky #mobCta; renders nothing from md: up. */}
      <MobileCta />
    </>
  );
}
