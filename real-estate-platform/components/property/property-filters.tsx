"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  bhkOptions,
  priceRangeOptions,
  propertyTypeOptions,
} from "@/lib/constants/property-options";
import { getCities } from "@/lib/cities";
import { cn } from "@/lib/utils";

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const city = searchParams.get("city") ?? "";
  const type = searchParams.get("type") ?? "";
  const bhk = searchParams.get("bhk") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const priceKey = searchParams.get("price") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      startTransition(() => {
        router.push(`/properties?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    startTransition(() => {
      router.push("/properties", { scroll: false });
    });
  };

  const hasActiveFilters = city || type || bhk || priceKey || sort !== "newest";
  const cities = getCities();

  const selectClass =
    "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-6 shadow-sm",
        isPending && "opacity-70"
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-navy">
          <SlidersHorizontal className="size-4 text-gold" />
          <span className="font-medium">Filter properties</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-navy"
          >
            <X data-icon="inline-start" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="filter-city">City</Label>
          <select
            id="filter-city"
            value={city}
            onChange={(e) => updateParams({ city: e.target.value || null })}
            className={selectClass}
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-type">Property type</Label>
          <select
            id="filter-type"
            value={type}
            onChange={(e) => updateParams({ type: e.target.value || null })}
            className={selectClass}
          >
            <option value="">All types</option>
            {propertyTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-price">Price range</Label>
          <select
            id="filter-price"
            value={priceKey}
            onChange={(e) => {
              const key = e.target.value;
              if (!key) {
                updateParams({ price: null, min_price: null, max_price: null });
                return;
              }
              const range = priceRangeOptions.find((r) => r.label === key);
              if (range) {
                updateParams({
                  price: key,
                  min_price: range.min != null ? String(range.min) : null,
                  max_price: range.max != null ? String(range.max) : null,
                });
              }
            }}
            className={selectClass}
          >
            <option value="">Any price</option>
            {priceRangeOptions.slice(1).map((range) => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-bhk">BHK (apartments)</Label>
          <select
            id="filter-bhk"
            value={bhk}
            onChange={(e) => updateParams({ bhk: e.target.value || null })}
            className={selectClass}
          >
            <option value="">Any BHK</option>
            {bhkOptions.map((n) => (
              <option key={n} value={String(n)}>
                {n} BHK
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-sort">Sort by</Label>
          <select
            id="filter-sort"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className={selectClass}
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
