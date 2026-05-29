import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { CostBreakdownForm } from "@/components/admin/cost-breakdown-form";
import { PropertyForm } from "@/components/admin/property-form";
import { getAdminPropertyById } from "@/lib/data/admin";
import {
  getCostBreakdownByPropertyId,
  getCostBreakdownViewCount,
  getMockCostBreakdown,
} from "@/lib/data/cost-breakdown";

type EditPropertyPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export async function generateMetadata({
  params,
}: EditPropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getAdminPropertyById(id);
  return {
    title: property
      ? `Edit ${property.title} | VeraEstates Admin`
      : "Edit Property",
  };
}

export default async function EditPropertyPage({
  params,
  searchParams,
}: EditPropertyPageProps) {
  const { id } = await params;
  const { created } = await searchParams;

  const property = await getAdminPropertyById(id);

  if (!property) notFound();

  const basePrice = Number(property.price_inr);
  const costBreakdown =
    (await getCostBreakdownByPropertyId(property.id, basePrice)) ??
    getMockCostBreakdown(property.id, basePrice);
  const costViewCount = await getCostBreakdownViewCount(property.id);

  return (
    <div>
      <Link
        href="/admin/properties"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
      >
        <ArrowLeft className="size-4" />
        Back to properties
      </Link>
      <h1 className="font-display mt-4 text-3xl text-navy">Edit property</h1>
      <p className="mt-1 text-muted-foreground">{property.title}</p>

      {created === "1" && (
        <p className="mt-4 rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-navy">
          Property created. Upload images below.
        </p>
      )}

      <div className="mt-8 space-y-10">
        <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg text-navy">Images</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload multiple images. Set one as the cover photo.
          </p>
          <div className="mt-6">
            <ImageUploader
              propertyId={property.id}
              images={property.property_images ?? []}
            />
          </div>
        </section>

        <CostBreakdownForm
          propertyId={property.id}
          breakdown={costBreakdown}
          viewCount={costViewCount}
          propertySlug={property.slug}
        />

        <PropertyForm property={property} />
      </div>
    </div>
  );
}
