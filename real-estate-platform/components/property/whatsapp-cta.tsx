import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppInquiryUrl } from "@/lib/whatsapp/build-inquiry-url";
import type { Property } from "@/lib/mock-properties";
import { cn } from "@/lib/utils";

type WhatsAppCTAProps = {
  property: Property;
  className?: string;
  fullWidth?: boolean;
};

export function WhatsAppCTA({
  property,
  className,
  fullWidth,
}: WhatsAppCTAProps) {
  const url = buildWhatsAppInquiryUrl({ property });

  return (
    <Button
      size="lg"
      className={cn(
        fullWidth && "w-full",
        className ?? "h-12 bg-[#25D366] text-white hover:bg-[#1fb855]"
      )}
      render={
        <a href={url} target="_blank" rel="noopener noreferrer" />
      }
    >
      <MessageCircle data-icon="inline-start" />
      Chat on WhatsApp
    </Button>
  );
}
