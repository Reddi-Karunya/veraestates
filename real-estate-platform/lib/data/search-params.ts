import type { PropertyType } from "@/types/database";

export type PropertyFilters = {
  city?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bhk?: number;
  sort?: "newest" | "price-asc" | "price-desc";
};

export type PropertySearchParams = {
  city?: string;
  type?: string;
  min_price?: string;
  max_price?: string;
  bhk?: string;
  sort?: string;
};

export function parseSearchParams(
  params: PropertySearchParams
): PropertyFilters {
  const type = params.type;
  const validTypes: PropertyType[] = ["apartment", "land", "villa", "commercial"];

  return {
    city: params.city || undefined,
    type:
      type && validTypes.includes(type as PropertyType)
        ? (type as PropertyType)
        : undefined,
    minPrice: params.min_price ? Number(params.min_price) : undefined,
    maxPrice: params.max_price ? Number(params.max_price) : undefined,
    bhk: params.bhk ? Number(params.bhk) : undefined,
    sort:
      params.sort === "price-asc" ||
      params.sort === "price-desc" ||
      params.sort === "newest"
        ? params.sort
        : "newest",
  };
}
