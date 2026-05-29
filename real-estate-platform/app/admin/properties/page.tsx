import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertiesTable } from "@/components/admin/properties-table";
import { PropertiesToolbar } from "@/components/admin/properties-toolbar";
import { getAdminProperties } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Properties | VeraEstates Admin",
};

type AdminPropertiesPageProps = {
  searchParams: Promise<{
    search?: string;
    listing_status?: string;
    verification_status?: string;
    type?: string;
  }>;
};

export default async function AdminPropertiesPage({
  searchParams,
}: AdminPropertiesPageProps) {
  const params = await searchParams;
  const properties = await getAdminProperties({
    search: params.search,
    listingStatus: params.listing_status,
    verificationStatus: params.verification_status,
    propertyType: params.type,
  });

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-muted" />}>
        <PropertiesToolbar />
      </Suspense>
      <PropertiesTable properties={properties} />
    </div>
  );
}
