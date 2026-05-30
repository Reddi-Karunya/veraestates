"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  approvalTypeOptions,
  areaUnitOptions,
  commonAmenities,
  listingStatusOptions,
  ownershipStatusOptions,
  propertyTypeOptions,
  verificationStatusOptions,
} from "@/lib/constants/property-options";
import {
  createPropertyAction,
  updatePropertyAction,
} from "@/app/admin/actions/properties";
import type { PropertyRow } from "@/types/database";

type PropertyFormProps = {
  property?: PropertyRow;
};

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold/20";

export function PropertyForm({ property }: PropertyFormProps) {
  const isEdit = Boolean(property);
  const action = isEdit
    ? updatePropertyAction.bind(null, property!.id)
    : createPropertyAction;

  const [state, formAction, isPending] = useActionState(action, {});

  const loc = (property?.location ?? {}) as {
    landmark?: string;
    pincode?: string;
  };
  const specs = (property?.specs ?? {}) as { bhk?: number };
  const selectedAmenities = new Set(property?.amenities ?? []);

  return (
    <form action={formAction} className="space-y-8">
      {state?.errors?.form && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.errors.form}
        </p>
      )}

      <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg text-navy">Basic information</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={property?.title}
              required
              aria-invalid={!!state?.errors?.title}
            />
            {state?.errors?.title && (
              <p className="text-xs text-destructive">{state.errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={property?.slug}
              placeholder="auto-generated if empty"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property_type">Property type *</Label>
            <select
              id="property_type"
              name="property_type"
              defaultValue={property?.property_type ?? "apartment"}
              className={selectClass}
              required
            >
              {propertyTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="short_description">Short description</Label>
            <Input
              id="short_description"
              name="short_description"
              defaultValue={property?.short_description ?? ""}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={property?.description}
              required
            />
            {state?.errors?.description && (
              <p className="text-xs text-destructive">{state.errors.description}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg text-navy">Pricing & location</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price_inr">Price (INR) *</Label>
            <Input
              id="price_inr"
              name="price_inr"
              type="number"
              min={0}
              defaultValue={property?.price_inr}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bhk">BHK (apartments)</Label>
            <Input
              id="bhk"
              name="bhk"
              type="number"
              min={1}
              defaultValue={specs.bhk ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locality">Locality *</Label>
            <Input
              id="locality"
              name="locality"
              defaultValue={property?.locality}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input id="city" name="city" defaultValue={property?.city} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input id="state" name="state" defaultValue={property?.state} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" name="pincode" defaultValue={loc.pincode ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="landmark">Landmark</Label>
            <Input id="landmark" name="landmark" defaultValue={loc.landmark ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="google_maps_url">Google Maps URL</Label>
            <Input
              id="google_maps_url"
              name="google_maps_url"
              type="url"
              defaultValue={property?.google_maps_url ?? ""}
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg text-navy">Area & legal</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="area_value">Area value</Label>
            <Input
              id="area_value"
              name="area_value"
              type="number"
              min={0}
              defaultValue={property?.area_value ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area_unit">Area unit</Label>
            <select
              id="area_unit"
              name="area_unit"
              defaultValue={property?.area_unit ?? "sqft"}
              className={selectClass}
            >
              {areaUnitOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="area_label">Area display label</Label>
            <Input
              id="area_label"
              name="area_label"
              defaultValue={property?.area_label ?? ""}
              placeholder="e.g. 3 BHK · 1,450 sq ft"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="approval_type">Approval authority</Label>
            <select
              id="approval_type"
              name="approval_type"
              defaultValue={property?.approval_type ?? ""}
              className={selectClass}
            >
              <option value="">Select</option>
              {approvalTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownership_status">Ownership status</Label>
            <select
              id="ownership_status"
              name="ownership_status"
              defaultValue={property?.ownership_status ?? ""}
              className={selectClass}
            >
              <option value="">Select</option>
              {ownershipStatusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg text-navy">Amenities</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {commonAmenities.map((amenity) => (
            <label
              key={amenity}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm has-checked:border-gold has-checked:bg-gold/5"
            >
              <input
                type="checkbox"
                name="amenity"
                value={amenity}
                defaultChecked={selectedAmenities.has(amenity)}
                className="accent-gold"
              />
              {amenity}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg text-navy">Status & verification</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="listing_status">Listing status</Label>
            <select
              id="listing_status"
              name="listing_status"
              defaultValue={property?.listing_status ?? "available"}
              className={selectClass}
            >
              {listingStatusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="verification_status">Overall verification</Label>
            <select
              id="verification_status"
              name="verification_status"
              defaultValue={property?.verification_status ?? "pending"}
              className={selectClass}
            >
              {verificationStatusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isEdit && property && (
          <div className="mt-6 rounded-lg border border-gold/30 bg-gold/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-navy">Trust score</p>
                <p className="font-display text-2xl text-gold">
                  {property.trust_score ?? 0}/100
                </p>
              </div>
              <Button
                variant="outline"
                className="border-gold/40"
                render={
                  <Link href={`/admin/properties/${property.id}/verify`} />
                }
              >
                <Shield data-icon="inline-start" />
                Manage verification
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={property?.is_published}
              className="accent-gold"
            />
            Published on public site
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={property?.is_featured}
              className="accent-gold"
            />
            Featured on homepage
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          className="bg-gold text-navy hover:bg-gold-light"
          disabled={isPending}
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create property"}
        </Button>
      </div>
    </form>
  );
}
