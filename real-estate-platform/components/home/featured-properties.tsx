import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/home/property-card";
import { properties } from "@/lib/mock-properties";

const featuredListings = properties
  .filter((p) => p.isFeatured)
  .map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    locality: p.locality,
    city: p.city,
    state: p.state,
    priceInr: p.priceInr,
    propertyType: p.propertyType,
    specsLabel: p.specsLabel,
    image: p.image,
    badges: p.badges,
  }));

export function FeaturedProperties() {
  return (
    <section id="properties" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Curated Selection
            </p>
            <h2 className="font-display mt-3 text-4xl tracking-tight text-navy sm:text-5xl">
              Featured Properties
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Handpicked apartments, villas, and land parcels — each verified for
              title clarity, compliance, and on-ground authenticity.
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 border-navy/20 text-navy hover:border-gold hover:bg-gold/5 hover:text-navy"
            render={<Link href="/properties" />}
          >
            View All Listings
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredListings.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
