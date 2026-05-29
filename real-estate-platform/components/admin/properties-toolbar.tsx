"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  listingStatusOptions,
  propertyTypeOptions,
  verificationStatusOptions,
} from "@/lib/constants/property-options";

export function PropertiesToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const listingStatus = searchParams.get("listing_status") ?? "";
  const verificationStatus = searchParams.get("verification_status") ?? "";
  const propertyType = searchParams.get("type") ?? "";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`/admin/properties?${params.toString()}`);
    });
  }

  const selectClass =
    "h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold/20";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl text-navy">Properties</h1>
        <Button
          className="bg-gold text-navy hover:bg-gold-light"
          render={<Link href="/admin/properties/new" />}
        >
          <Plus data-icon="inline-start" />
          Add property
        </Button>
      </div>

      <div
        className={`flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 lg:flex-row lg:items-center ${isPending ? "opacity-70" : ""}`}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search title, city, locality..."
            className="pl-9"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                update("search", (e.target as HTMLInputElement).value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value !== search) update("search", e.target.value);
            }}
          />
        </div>
        <select
          value={listingStatus}
          onChange={(e) => update("listing_status", e.target.value)}
          className={selectClass}
        >
          <option value="">All statuses</option>
          {listingStatusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={verificationStatus}
          onChange={(e) => update("verification_status", e.target.value)}
          className={selectClass}
        >
          <option value="">All verification</option>
          {verificationStatusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={propertyType}
          onChange={(e) => update("type", e.target.value)}
          className={selectClass}
        >
          <option value="">All types</option>
          {propertyTypeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
