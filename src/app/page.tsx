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

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Steps />
        <Showcase />
        <WhyBarcodesQR />
        <Reviews />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
