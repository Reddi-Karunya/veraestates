import {
  fetchPublishedProperties,
  fetchPropertyBySlug,
  fetchAllSlugsFromDb,
} from "@/lib/data/properties";
import type { PropertyFilters } from "@/lib/data/search-params";
import { properties as mockProperties, type Property, type PropertyListItem } from "@/lib/mock-properties";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export {
  parseSearchParams,
  type PropertyFilters,
  type PropertySearchParams,
} from "@/lib/data/search-params";

export async function getAllProperties(
  filters?: PropertyFilters
): Promise<PropertyListItem[]> {
  return fetchPublishedProperties(filters);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return fetchPropertyBySlug(slug);
}

export async function getAllSlugs(): Promise<string[]> {
  const mockSlugs = mockProperties.map((p) => p.slug);
  if (!isSupabaseConfigured()) {
    return mockSlugs;
  }
  const slugs = await fetchAllSlugsFromDb();
  return slugs.length > 0 ? slugs : mockSlugs;
}
