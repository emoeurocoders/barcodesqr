import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { PressScroll } from "@/components/sections/PressScroll";
import { Steps } from "@/components/sections/Steps";
import { Showcase } from "@/components/sections/Showcase";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { WhyBarcodesQR } from "@/components/sections/WhyBarcodesQR";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { ReadyCta } from "@/components/sections/ReadyCta";

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
        Flex column so the mobile sequence can differ from the desktop one
        without duplicating a section. The DOM order below IS the designer's
        main_mobile.html order; `md:order-*` on WhyBarcodesQR (1) and on
        Pricing/Faq/ReadyCta (2) lifts the desktop sequence back out of it, so
        main.html still reads Types → Choose → Why → Plans. PressScroll carries
        `hidden md:block` because the mobile mockup drops it outright.
      */}
      <main className="flex flex-col">
        <Hero />
        <PressScroll />
        <Steps />
        <WhyBarcodesQR />
        <Showcase />
        <WhyChoose />
        {/*
          Reviews is deliberately NOT here. The designer's current main.html has
          no reviews section, so it was removed from the homepage on 2026-09-02.
          Reviews.tsx is kept rather than deleted because the header and footer
          both link to /reviews, which is the page it belongs on once that route
          exists — see LAUNCH.md.
        */}
        <Pricing />
        <Faq />
        <ReadyCta />
      </main>
      <Footer />
    </>
  );
}
