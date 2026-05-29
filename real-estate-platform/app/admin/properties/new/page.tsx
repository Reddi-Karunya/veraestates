import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";
export const metadata: Metadata = {
  title: "Add Property | VeraEstates Admin",
};

export default async function NewPropertyPage() {
  return (
    <div>
      <Link
        href="/admin/properties"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
      >
        <ArrowLeft className="size-4" />
        Back to properties
      </Link>
      <h1 className="font-display mt-4 text-3xl text-navy">Add property</h1>
      <p className="mt-1 text-muted-foreground">
        Create a new listing. You can upload images after saving.
      </p>
      <div className="mt-8">
        <PropertyForm />
      </div>
    </div>
  );
}
