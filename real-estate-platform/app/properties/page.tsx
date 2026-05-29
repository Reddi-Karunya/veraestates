import { Suspense } from "react";
import type { Metadata } from "next";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGrid } from "@/components/property/property-grid";
import {
  getAllProperties,
  parseSearchParams,
  type PropertySearchParams,
} from "@/lib/properties";

export const metadata: Metadata = {
  title: "Properties | VeraEstates",
  description:
    "Browse verified apartments, villas, and land across India. Filter by city, type, price, and BHK.",
};

type PropertiesPageProps = {
  searchParams: Promise<PropertySearchParams>;
};

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params = await searchParams;
  const filters = parseSearchParams(params);
  const listings = await getAllProperties(filters);

  return (
    <main id="main-content">
      <section className="border-b border-border/60 bg-navy pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            Verified Listings
          </p>
          <h1 className="font-display mt-3 text-4xl tracking-tight text-cream sm:text-5xl">
            Properties for sale
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-cream/60">
            Every listing is reviewed for title clarity, compliance, and
            on-ground authenticity before it reaches you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <Suspense fallback={<FiltersSkeleton />}>
          <PropertyFilters />
        </Suspense>

        <p className="mt-8 text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-navy">{listings.length}</span>{" "}
          {listings.length === 1 ? "property" : "properties"}
        </p>

        <div className="mt-8">
          <PropertyGrid properties={listings} />
        </div>
      </section>
    </main>
  );
}

function FiltersSkeleton() {
  return (
    <div className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
  );
}
