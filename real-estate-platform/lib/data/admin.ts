import { createClient } from "@/lib/supabase/server";
import type {
  LeadRow,
  PropertyImageRow,
  PropertyRow,
  PropertyVerificationRow,
  VerificationTypeRow,
} from "@/types/database";

export type DashboardStats = {
  totalProperties: number;
  totalInquiries: number;
  publishedCount: number;
  verificationCounts: Record<string, number>;
  listingCounts: Record<string, number>;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [propertiesRes, leadsRes] = await Promise.all([
    supabase.from("properties").select("id, is_published, listing_status, verification_status"),
    supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);

  const properties = propertiesRes.data ?? [];
  const verificationCounts: Record<string, number> = {
    pending: 0,
    verified: 0,
    rejected: 0,
    expired: 0,
  };
  const listingCounts: Record<string, number> = {
    available: 0,
    sold: 0,
    reserved: 0,
  };

  for (const p of properties) {
    verificationCounts[p.verification_status] =
      (verificationCounts[p.verification_status] ?? 0) + 1;
    listingCounts[p.listing_status] =
      (listingCounts[p.listing_status] ?? 0) + 1;
  }

  return {
    totalProperties: properties.length,
    totalInquiries: leadsRes.count ?? 0,
    publishedCount: properties.filter((p) => p.is_published).length,
    verificationCounts,
    listingCounts,
  };
}

export async function getRecentLeads(limit = 8): Promise<
  (LeadRow & { properties: { title: string; slug: string } | null })[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*, properties (title, slug)")
    .order("qualification_score", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as (LeadRow & {
    properties: { title: string; slug: string } | null;
  })[];
}

export type AdminPropertyListItem = PropertyRow & {
  property_images: Pick<PropertyImageRow, "public_url" | "is_cover">[];
};

export async function getAdminProperties(filters?: {
  search?: string;
  listingStatus?: string;
  verificationStatus?: string;
  propertyType?: string;
}): Promise<AdminPropertyListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("properties")
    .select("*, property_images (public_url, is_cover, sort_order)")
    .order("updated_at", { ascending: false });

  if (filters?.listingStatus) {
    query = query.eq("listing_status", filters.listingStatus);
  }
  if (filters?.verificationStatus) {
    query = query.eq("verification_status", filters.verificationStatus);
  }
  if (filters?.propertyType) {
    query = query.eq("property_type", filters.propertyType);
  }
  if (filters?.search) {
    const term = filters.search.replace(/[%_]/g, "");
    query = query.or(
      `title.ilike.%${term}%,city.ilike.%${term}%,locality.ilike.%${term}%,slug.ilike.%${term}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("[getAdminProperties]", error);
    return [];
  }

  return (data ?? []) as AdminPropertyListItem[];
}

export async function getAdminPropertyById(id: string): Promise<
  | (PropertyRow & {
      property_images: PropertyImageRow[];
      property_verifications: (PropertyVerificationRow & {
        verification_types: VerificationTypeRow;
      })[];
    })
  | null
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(
      `*,
      property_images (*),
      property_verifications (
        *,
        verification_types (*)
      )`
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as PropertyRow & {
    property_images: PropertyImageRow[];
    property_verifications: (PropertyVerificationRow & {
      verification_types: VerificationTypeRow;
    })[];
  };
}

export async function getVerificationTypes(): Promise<VerificationTypeRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("verification_types")
    .select("*")
    .order("sort_order");

  return (data ?? []) as VerificationTypeRow[];
}
