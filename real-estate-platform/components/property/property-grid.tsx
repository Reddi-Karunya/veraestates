import { Building2 } from "lucide-react";
import { PropertyCard } from "@/components/property/property-card";
import type { PropertyListItem } from "@/lib/mock-properties";

type PropertyGridProps = {
  properties: PropertyListItem[];
};

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-8 py-20 text-center">
        <Building2 className="size-12 text-muted-foreground/50" />
        <h3 className="font-display mt-4 text-xl text-navy">No properties found</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Try adjusting your filters — we&apos;re adding verified listings across
          India every week.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
