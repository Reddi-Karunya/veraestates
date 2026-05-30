import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SavingsBadge } from "@/components/property/savings-badge";
import { TrustScoreBadge } from "@/components/property/trust-score-badge";
import { formatPriceINR } from "@/lib/format-price";
import type { PropertyListItem, PropertyType } from "@/lib/mock-properties";

type PropertyCardProps = {
  property: PropertyListItem;
};

const typeLabels: Record<PropertyType, string> = {
  apartment: "Apartment",
  land: "Land",
  villa: "Villa",
};

export function PropertyCard({ property }: PropertyCardProps) {
  const href = `/properties/${property.slug}`;

  return (
    <Card className="group overflow-hidden border-border/60 bg-card py-0 shadow-sm ring-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/5">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <Badge className="w-fit border-0 bg-navy/80 text-cream backdrop-blur-sm">
            {typeLabels[property.propertyType]}
          </Badge>
          {(property.trustScore ?? 0) > 0 && (
            <TrustScoreBadge
              score={property.trustScore ?? 0}
              isVerified={property.isVerified}
            />
          )}
          {property.costBreakdown?.has_savings && (
            <SavingsBadge
              savings={property.costBreakdown.computed_savings}
            />
          )}
        </div>
      </Link>

      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={href}>
              <h3 className="font-display text-xl text-foreground transition-colors group-hover:text-gold">
                {property.title}
              </h3>
            </Link>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-gold" />
              {property.locality}, {property.city}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-lg text-gold">
              {formatPriceINR(property.priceInr)}
            </p>
            {property.costBreakdown?.has_savings && (
              <p className="mt-1 text-xs text-emerald-600">
                Total from {formatPriceINR(property.costBreakdown.total_cost)}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{property.specsLabel}</p>

        {(property.trustScore ?? 0) >= 50 && (
          <p className="text-xs text-muted-foreground">
            {property.badges.length} verification
            {property.badges.length === 1 ? "" : "s"} on file
          </p>
        )}

        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-navy transition-colors group-hover:text-gold"
        >
          View details
          <span className="ml-1 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
