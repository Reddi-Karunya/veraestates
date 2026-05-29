import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-navy">
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85"
        alt="Luxury residence exterior at dusk"
        fill
        priority
        className="object-cover opacity-40"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/70 to-navy" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.15),transparent)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-24 pt-32 lg:px-8">
        <Badge
          variant="outline"
          className="mb-8 w-fit border-gold/50 bg-gold/10 px-4 py-1 text-gold"
        >
          <ShieldCheck className="size-3.5" data-icon="inline-start" />
          AI-Verified Indian Real Estate
        </Badge>

        <h1 className="font-display max-w-4xl text-5xl leading-[1.1] tracking-tight text-cream sm:text-6xl lg:text-7xl">
          Premium properties.
          <br />
          <span className="text-gold">Verified</span> before you visit.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream/70 sm:text-xl">
          Discover hand-curated apartments and land across India — every listing
          backed by title checks, RERA validation, and on-ground site visits.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            size="lg"
            className="h-12 bg-gold px-8 text-base text-navy hover:bg-gold-light"
            render={<Link href="/properties" />}
          >
            Explore Properties
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 border-cream/20 bg-transparent px-8 text-base text-cream hover:border-gold/50 hover:bg-gold/5 hover:text-gold"
            render={<Link href="#trust" />}
          >
            How We Verify
          </Button>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-8 border-t border-cream/10 pt-10 sm:grid-cols-4">
          {[
            { label: "Verified Listings", value: "120+" },
            { label: "Cities Covered", value: "18" },
            { label: "Avg. Response", value: "< 2 hrs" },
            { label: "Buyer Satisfaction", value: "98%" },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs uppercase tracking-widest text-cream/50">
                {stat.label}
              </dt>
              <dd className="font-display mt-1 text-3xl text-gold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
