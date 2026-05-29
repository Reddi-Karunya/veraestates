import { formatPriceINR } from "@/lib/format-price";
import type { Property } from "@/lib/mock-properties";
import { LeadCaptureForm } from "@/components/lead/lead-capture-form";
import { TrustScoreBadge } from "@/components/property/trust-score-badge";
import { WhatsAppCTA } from "@/components/property/whatsapp-cta";

type PropertyDetailSidebarProps = {
  property: Property;
};

export function PropertyDetailSidebar({ property }: PropertyDetailSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <p className="font-display text-3xl text-gold">
          {formatPriceINR(property.priceInr)}
        </p>
        {(property.trustScore ?? 0) > 0 && (
          <div className="mt-4">
            <TrustScoreBadge
              score={property.trustScore ?? 0}
              isVerified={property.isVerified}
              size="md"
            />
          </div>
        )}

        <div className="mt-6 space-y-3">
          <WhatsAppCTA property={property} fullWidth className="h-12 w-full" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg text-navy">Request a callback</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your details and we&apos;ll reach out within 2 hours.
        </p>
        <div className="mt-6">
          <LeadCaptureForm
            propertyId={property.id}
            propertyTitle={property.title}
            propertyCity={property.city}
            propertyLocality={property.locality}
          />
        </div>
      </div>
    </aside>
  );
}
