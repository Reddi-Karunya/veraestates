import { formatPriceINR } from "@/lib/format-price";
import type { Property } from "@/lib/mock-properties";
import { WhatsAppCTA } from "@/components/property/whatsapp-cta";

type PropertyDetailMobileBarProps = {
  property: Property;
};

export function PropertyDetailMobileBar({ property }: PropertyDetailMobileBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-cream/95 p-4 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-navy">{property.title}</p>
          <p className="font-display text-lg text-gold">
            {formatPriceINR(property.priceInr)}
          </p>
        </div>
        <WhatsAppCTA property={property} className="h-11 shrink-0 px-4" />
      </div>
    </div>
  );
}
