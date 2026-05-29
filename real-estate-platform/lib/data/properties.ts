import { createClient, createServerClientWithoutCookies } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { mapRowToListItem, mapRowToProperty } from "@/lib/data/map-property";
import type { PropertyFilters } from "@/lib/data/search-params";
import {
  getMockVerificationChecks,
  checksToDisplayBadges,
  resolveTrustScore,
  type VerificationCheckWithType,
} from "@/lib/data/verification";
import {
  getMockCostBreakdown,
} from "@/lib/data/cost-breakdown";
import type { CostBreakdownComputed } from "@/lib/cost/types";
import type { PropertyCostBreakdownRow } from "@/types/database";
import { isFullyVerified } from "@/lib/trust/score";
import {
  properties as mockProperties,
  type Property,
  type PropertyListItem,
} from "@/lib/mock-properties";
import type { PropertyRow, PropertyImageRow } from "@/types/database";

export function filterMockProperties(filters: PropertyFilters) {
  let result = [...mockProperties];
  if (filters.city) {
    result = result.filter(
      (p) => p.city.toLowerCase() === filters.city!.toLowerCase()
    );
  }
  if (filters.type) result = result.filter((p) => p.propertyType === filters.type);
  if (filters.minPrice != null && !Number.isNaN(filters.minPrice)) {
    result = result.filter((p) => p.priceInr >= filters.minPrice!);
  }
  if (filters.maxPrice != null && !Number.isNaN(filters.maxPrice)) {
    result = result.filter((p) => p.priceInr <= filters.maxPrice!);
  }
  if (filters.bhk != null && !Number.isNaN(filters.bhk)) {
    result = result.filter((p) => p.specs.bhk === filters.bhk);
  }
  const sort = filters.sort ?? "newest";
  result.sort((a, b) => {
    if (sort === "price-asc") return a.priceInr - b.priceInr;
    if (sort === "price-desc") return b.priceInr - a.priceInr;
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
  return result;
}

function mockToListItem(p: Property): PropertyListItem {
  const checks = getMockVerificationChecks(p.id);
  const trustScore = resolveTrustScore(p.trustScore, checks);
  const costBreakdown = getMockCostBreakdown(p.id, p.priceInr);
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    locality: p.locality,
    city: p.city,
    state: p.state,
    priceInr: p.priceInr,
    propertyType: p.propertyType,
    specsLabel: p.specsLabel,
    image: p.image,
    badges: checksToDisplayBadges(checks).slice(0, 2),
    trustScore,
    isVerified: isFullyVerified(trustScore, checks.length),
    costBreakdown,
  };
}

const PUBLIC_SELECT = `
  *,
  property_images (*),
  property_verification_checks (
    *,
    check_types:verification_check_types (*)
  ),
  property_cost_breakdowns (*)
`;

type PropertyRowWithRelations = PropertyRow & {
  property_images: PropertyImageRow[];
  property_verification_checks: VerificationCheckWithType[];
  property_cost_breakdowns: PropertyCostBreakdownRow | null;
};

function mapCostRow(
  row: PropertyCostBreakdownRow | null,
  propertyId: string,
  basePrice: number
): CostBreakdownComputed | null {
  if (!row) return getMockCostBreakdown(propertyId, basePrice);
  return {
    property_id: row.property_id,
    base_price: Number(row.base_price),
    registration_cost: Number(row.registration_cost),
    legal_verification_cost: Number(row.legal_verification_cost),
    platform_fee: Number(row.platform_fee),
    miscellaneous_cost: Number(row.miscellaneous_cost),
    estimated_market_price:
      row.estimated_market_price != null
        ? Number(row.estimated_market_price)
        : null,
    total_cost: Number(row.total_cost),
    estimated_savings: Number(row.estimated_savings),
    has_savings: Number(row.estimated_savings) > 0,
  };
}

export async function fetchPublishedProperties(
  filters?: PropertyFilters
): Promise<PropertyListItem[]> {
  if (!isSupabaseConfigured()) {
    const list = filters ? filterMockProperties(filters) : mockProperties;
    return list.map(mockToListItem);
  }

  const supabase = await createClient();
  let query = supabase
    .from("properties")
    .select(PUBLIC_SELECT)
    .eq("is_published", true)
    .in("listing_status", ["available", "sold", "reserved"]);

  if (filters?.city) query = query.ilike("city", filters.city);
  if (filters?.type) query = query.eq("property_type", filters.type);
  if (filters?.minPrice != null) query = query.gte("price_inr", filters.minPrice);
  if (filters?.maxPrice != null) query = query.lte("price_inr", filters.maxPrice);

  const sort = filters?.sort ?? "newest";
  if (sort === "price-asc") query = query.order("price_inr", { ascending: true });
  else if (sort === "price-desc") query = query.order("price_inr", { ascending: false });
  else query = query.order("published_at", { ascending: false });

  const { data, error } = await query;
  if (error || !data) {
    console.error("[fetchPublishedProperties]", error);
    return [];
  }

  let items = (data as PropertyRowWithRelations[]).map((row) =>
    mapRowToListItem(
      row,
      row.property_images ?? [],
      row.property_verification_checks ?? [],
      mapCostRow(
        row.property_cost_breakdowns,
        row.id,
        Number(row.price_inr)
      )
    )
  );

  if (filters?.bhk != null) {
    items = items.filter((item) => {
      const row = (data as PropertyRow[]).find((r) => r.id === item.id);
      const specs = row?.specs as { bhk?: number } | undefined;
      return specs?.bhk === filters.bhk;
    });
  }

  return items;
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured()) {
    const mock = mockProperties.find((p) => p.slug === slug);
    if (!mock) return null;
    const checks = getMockVerificationChecks(mock.id);
    const trustScore = resolveTrustScore(undefined, checks);
    const costBreakdown = getMockCostBreakdown(mock.id, mock.priceInr);
    return {
      ...mock,
      badges: checksToDisplayBadges(checks),
      trustScore,
      isVerified: isFullyVerified(trustScore, checks.length),
      verificationChecks: checks.map((c) => ({
        checkType: c.check_type,
        label: c.check_types.label,
        status: c.status,
        verifiedAt: c.verified_at,
      })),
      costBreakdown,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PUBLIC_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;

  const row = data as PropertyRowWithRelations;

  return mapRowToProperty(
    row,
    row.property_images ?? [],
    row.property_verification_checks ?? [],
    mapCostRow(
      row.property_cost_breakdowns,
      row.id,
      Number(row.price_inr)
    )
  );
}

export async function fetchAllSlugsFromDb(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return mockProperties.map((p) => p.slug);
  }

  const supabase = createServerClientWithoutCookies();
  const { data } = await supabase
    .from("properties")
    .select("slug")
    .eq("is_published", true);

  return data?.map((r) => r.slug) ?? [];
}
