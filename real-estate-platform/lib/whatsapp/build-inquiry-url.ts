import type { Property } from "@/lib/mock-properties";
import { formatPriceINR } from "@/lib/format-price";

const DEFAULT_WHATSAPP_NUMBER = "919876543210";

type BuildInquiryUrlOptions = {
  property: Pick<
    Property,
    "title" | "locality" | "city" | "priceInr" | "slug"
  >;
  siteUrl?: string;
  phoneNumber?: string;
};

export function buildWhatsAppInquiryUrl({
  property,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP_NUMBER,
}: BuildInquiryUrlOptions): string {
  const link = `${siteUrl}/properties/${property.slug}`;
  const message = [
    "Hi, I'm interested in:",
    property.title,
    `Location: ${property.locality}, ${property.city}`,
    `Price: ${formatPriceINR(property.priceInr)}`,
    `Link: ${link}`,
  ].join("\n");

  const digits = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
