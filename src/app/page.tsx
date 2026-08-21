import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Steps } from "@/components/sections/Steps";
import { Showcase } from "@/components/sections/Showcase";
import { WhyBarcodesQR } from "@/components/sections/WhyBarcodesQR";
import { Reviews } from "@/components/sections/Reviews";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { ReadyCta } from "@/components/sections/ReadyCta";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Header user={session?.user} />
      <main>
        <Hero />
        <TrustBar />
        <Steps />
        <Showcase />
        <WhyBarcodesQR />
        <Reviews />
        <Pricing />
        <Faq />
        <ReadyCta />
      </main>
      <Footer />
    </>
  );
}
