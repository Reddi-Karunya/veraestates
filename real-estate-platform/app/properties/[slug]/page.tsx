import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadCaptureForm } from "@/components/lead/lead-capture-form";
import { PropertyDetailMobileBar } from "@/components/property/property-detail-mobile-bar";
import { PropertyDetailSidebar } from "@/components/property/property-detail-sidebar";
import { CostTransparencySection } from "@/components/property/cost-transparency-section";
import { TrustCenter } from "@/components/property/trust-center";
import { TrustScoreBadge } from "@/components/property/trust-score-badge";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertySpecs } from "@/components/property/property-specs";
import { formatPriceINR } from "@/lib/format-price";
import {
  getAllSlugs,
  getPropertyBySlug,
} from "@/lib/properties";
import type { PropertyType } from "@/lib/mock-properties";

const typeLabels: Record<PropertyType, string> = {
  apartment: "Apartment",
  land: "Land",
  villa: "Villa",
};

type PropertyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const APPROVAL_AUTHORITY_LABELS: Record<string, string> = {
  rera: "RERA",
  vmrda: "VMRDA",
  dtcp: "DTCP",
  gvmc: "GVMC",
  panchayat: "Panchayat",
  municipal: "Municipal",
  hmda: "HMDA",
  other: "Other",
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };

  return {
    title: `${property.title} | VeraEstates`,
    description: property.shortDescription,
    openGraph: {
      title: property.title,
      description: property.shortDescription,
      images: [{ url: property.image }],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <>
      <article id="main-content" className="pb-28 lg:pb-16">
        <div className="border-b border-border/60 bg-navy/5 pt-24 pb-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              <ArrowLeft className="size-4" />
              Back to listings
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge className="border-0 bg-navy text-cream">
                {typeLabels[property.propertyType]}
              </Badge>
              {property.specs.reraId && (
                <Badge variant="outline" className="border-gold/40 text-navy">
                  RERA: {property.specs.reraId}
                </Badge>
              )}
              {(property.trustScore ?? 0) > 0 && (
                <TrustScoreBadge
                  score={property.trustScore ?? 0}
                  isVerified={property.isVerified}
                  size="md"
                />
              )}
            </div>

            <h1 className="font-display mt-4 text-4xl tracking-tight text-navy sm:text-5xl">
              {property.title}
            </h1>

            <p className="mt-3 flex items-center gap-1.5 text-lg text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-gold" />
              {property.locality}, {property.city}, {property.state}
              {property.location.pincode && (
                <span className="text-muted-foreground/70">
                  · {property.location.pincode}
                </span>
              )}
            </p>

            <p className="mt-2 font-display text-2xl text-gold lg:hidden">
              {formatPriceINR(property.priceInr)}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-10 lg:col-span-2">
              <PropertyGallery images={property.images} title={property.title} />

              <div>
                <h2 className="font-display text-2xl text-navy">Overview</h2>
                <p className="mt-2 text-muted-foreground">{property.specsLabel}</p>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/90">
                  {property.description.split("\n\n").map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <PropertySpecs property={property} />

              {property.approvalType && (
                <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                  <h2 className="font-display text-xl text-navy">Approval Authority</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {APPROVAL_AUTHORITY_LABELS[property.approvalType] ?? property.approvalType} Approved
                  </p>
                </div>
              )}

              {property.costBreakdown && (
                <CostTransparencySection
                  propertyId={property.id}
                  propertyTitle={property.title}
                  breakdown={property.costBreakdown}
                />
              )}

              {property.verificationChecks &&
                property.verificationChecks.length > 0 && (
                  <TrustCenter
                    trustScore={property.trustScore ?? 0}
                    checks={property.verificationChecks}
                  />
                )}

              {property.location.landmark && (
                <div className="rounded-2xl border border-border/60 bg-card p-6">
                  <h2 className="font-display text-xl text-navy">Location</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-navy">Landmark:</span>{" "}
                    {property.location.landmark}
                  </p>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <PropertyDetailSidebar property={property} />
            </div>
          </div>

          <div className="mt-10 lg:hidden">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="font-display text-lg text-navy">Request a callback</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll reach out within 2 hours.
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
          </div>
        </div>
      </article>

      <PropertyDetailMobileBar property={property} />
    </>
  );
}
