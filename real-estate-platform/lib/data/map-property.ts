import type {
  Property,
  PropertyListItem,
  PropertySpecs,
  PropertyVerificationCheckDisplay,
} from "@/lib/mock-properties";
import {
  checksToDisplayBadges,
  type VerificationCheckWithType,
} from "@/lib/data/verification";
import { isFullyVerified } from "@/lib/trust/score";
import type { CostBreakdownComputed } from "@/lib/cost/types";
import type { PropertyImageRow, PropertyRow } from "@/types/database";

function buildSpecsLabel(row: PropertyRow): string {
  if (row.area_label) return row.area_label;
  const specs = row.specs as PropertySpecs;
  const parts: string[] = [];
  if (specs.bhk) parts.push(`${specs.bhk} BHK`);
  if (row.area_value && row.area_unit) {
    const unit =
      row.area_unit === "sqft"
        ? "sq ft"
        : row.area_unit === "sqyd"
          ? "sq yd"
          : row.area_unit;
    parts.push(`${row.area_value.toLocaleString("en-IN")} ${unit}`);
  }
  return parts.join(" · ") || "—";
}

export function mapChecksToDisplay(
  checks: VerificationCheckWithType[]
): PropertyVerificationCheckDisplay[] {
  return checks.map((c) => ({
    checkType: c.check_type,
    label: c.check_types?.label ?? c.check_type,
    status: c.status,
    verifiedAt: c.verified_at,
  }));
}

export function mapRowToProperty(
  row: PropertyRow,
  images: PropertyImageRow[],
  checks: VerificationCheckWithType[] = [],
  costBreakdown?: CostBreakdownComputed | null
): Property {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const cover = sorted.find((i) => i.is_cover) ?? sorted[0];
  const imageUrls = sorted.map((i) => i.public_url);
  const loc = row.location as { locality?: string; landmark?: string; pincode?: string };
  const trustScore = row.trust_score ?? 0;
  const badges = checksToDisplayBadges(checks);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description ?? "",
    description: row.description,
    locality: row.locality,
    city: row.city,
    state: row.state,
    location: {
      locality: loc.locality ?? row.locality,
      landmark: loc.landmark,
      pincode: loc.pincode,
    },
    priceInr: Number(row.price_inr),
    propertyType: row.property_type as Property["propertyType"],
    specsLabel: buildSpecsLabel(row),
    specs: (row.specs ?? {}) as PropertySpecs,
    image: cover?.public_url ?? "",
    images: imageUrls.length > 0 ? imageUrls : cover ? [cover.public_url] : [],
    badges,
    isFeatured: row.is_featured,
    publishedAt: row.published_at ?? row.created_at,
    listingStatus: row.listing_status,
    verificationStatus: row.verification_status,
    trustScore,
    isVerified: isFullyVerified(trustScore, checks.length),
    verificationChecks: mapChecksToDisplay(checks),
    approvalType: row.approval_type,
    ownershipStatus: row.ownership_status,
    amenities: row.amenities ?? [],
    googleMapsUrl: row.google_maps_url,
    isPublished: row.is_published,
    costBreakdown: costBreakdown ?? undefined,
  };
}

export function mapRowToListItem(
  row: PropertyRow,
  images: PropertyImageRow[],
  checks: VerificationCheckWithType[] = [],
  costBreakdown?: CostBreakdownComputed | null
): PropertyListItem {
  const full = mapRowToProperty(row, images, checks, costBreakdown);
  return {
    id: full.id,
    slug: full.slug,
    title: full.title,
    locality: full.locality,
    city: full.city,
    state: full.state,
    priceInr: full.priceInr,
    propertyType: full.propertyType,
    specsLabel: full.specsLabel,
    image: full.image,
    badges: full.badges,
    trustScore: full.trustScore ?? 0,
    isVerified: full.isVerified ?? false,
    costBreakdown: full.costBreakdown,
  };
}
