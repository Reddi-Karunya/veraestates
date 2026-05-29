import { CtaSection } from "@/components/home/cta-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { HeroSection } from "@/components/home/hero-section";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TrustSection } from "@/components/home/trust-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <SiteHeader variant="home" />
      <main id="main-content">
        <HeroSection />
        <FeaturedProperties />
        <TrustSection />
        <WhyChooseUs />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
