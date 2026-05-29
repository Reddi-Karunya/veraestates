import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VerificationPanel } from "@/components/admin/verification-panel";
import { getAdminPropertyById } from "@/lib/data/admin";
import {
  ensurePropertyChecksInitialized,
  getPropertyVerificationChecks,
} from "@/lib/data/verification";

type VerifyPropertyPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: VerifyPropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getAdminPropertyById(id);
  return {
    title: property
      ? `Verify ${property.title} | VeraEstates Admin`
      : "Verification",
  };
}

export default async function VerifyPropertyPage({
  params,
}: VerifyPropertyPageProps) {
  const { id } = await params;
  const property = await getAdminPropertyById(id);

  if (!property) notFound();

  await ensurePropertyChecksInitialized(id);
  const checks = await getPropertyVerificationChecks(id);

  const sorted = [...checks].sort(
    (a, b) => (a.check_types?.sort_order ?? 0) - (b.check_types?.sort_order ?? 0)
  );

  return (
    <div>
      <Link
        href={`/admin/properties/${id}/edit`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
      >
        <ArrowLeft className="size-4" />
        Back to property
      </Link>

      <h1 className="font-display mt-4 text-3xl text-navy">
        Trust & Verification Center
      </h1>
      <p className="mt-1 text-muted-foreground">
        Review and approve verification checks for this property
      </p>

      <div className="mt-8">
        <VerificationPanel
          propertyId={id}
          propertyTitle={property.title}
          trustScore={property.trust_score ?? 0}
          checks={sorted}
        />
      </div>
    </div>
  );
}
