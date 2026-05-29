import type {
  ApprovalType,
  AreaUnit,
  ListingStatus,
  OwnershipStatus,
  PropertyType,
  VerificationStatus,
} from "@/types/database";

export type PropertyFormInput = {
  title: string;
  short_description: string;
  description: string;
  property_type: PropertyType;
  price_inr: number;
  city: string;
  state: string;
  locality: string;
  landmark: string;
  pincode: string;
  area_value: number | null;
  area_unit: AreaUnit;
  area_label: string;
  approval_type: ApprovalType | "";
  ownership_status: OwnershipStatus | "";
  amenities: string[];
  google_maps_url: string;
  verification_status: VerificationStatus;
  listing_status: ListingStatus;
  is_published: boolean;
  is_featured: boolean;
  bhk: number | null;
  slug?: string;
};

export function validatePropertyForm(
  input: Partial<PropertyFormInput>
): { success: true; data: PropertyFormInput } | { success: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const title = input.title?.trim() ?? "";
  const description = input.description?.trim() ?? "";
  const city = input.city?.trim() ?? "";
  const state = input.state?.trim() ?? "";
  const locality = input.locality?.trim() ?? "";
  const price_inr = Number(input.price_inr);

  if (!title || title.length < 3) errors.title = "Title must be at least 3 characters";
  if (!description) errors.description = "Description is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!locality) errors.locality = "Locality is required";
  if (!price_inr || price_inr <= 0) errors.price_inr = "Enter a valid price";
  if (!input.property_type) errors.property_type = "Property type is required";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      short_description: input.short_description?.trim() ?? "",
      description,
      property_type: input.property_type as PropertyType,
      price_inr,
      city,
      state,
      locality,
      landmark: input.landmark?.trim() ?? "",
      pincode: input.pincode?.trim() ?? "",
      area_value: input.area_value != null ? Number(input.area_value) : null,
      area_unit: (input.area_unit ?? "sqft") as AreaUnit,
      area_label: input.area_label?.trim() ?? "",
      approval_type: (input.approval_type || "") as ApprovalType | "",
      ownership_status: (input.ownership_status || "") as OwnershipStatus | "",
      amenities: input.amenities ?? [],
      google_maps_url: input.google_maps_url?.trim() ?? "",
      verification_status: (input.verification_status ?? "pending") as VerificationStatus,
      listing_status: (input.listing_status ?? "available") as ListingStatus,
      is_published: Boolean(input.is_published),
      is_featured: Boolean(input.is_featured),
      bhk: input.bhk != null ? Number(input.bhk) : null,
      slug: input.slug?.trim(),
    },
  };
}

export function formDataToPropertyInput(formData: FormData): Partial<PropertyFormInput> {
  const amenitiesRaw = formData.get("amenities");
  const amenities =
    typeof amenitiesRaw === "string" && amenitiesRaw
      ? amenitiesRaw.split(",").map((a) => a.trim()).filter(Boolean)
      : formData.getAll("amenity").map(String);

  return {
    title: String(formData.get("title") ?? ""),
    short_description: String(formData.get("short_description") ?? ""),
    description: String(formData.get("description") ?? ""),
    property_type: String(formData.get("property_type") ?? "") as PropertyType,
    price_inr: Number(formData.get("price_inr")),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    locality: String(formData.get("locality") ?? ""),
    landmark: String(formData.get("landmark") ?? ""),
    pincode: String(formData.get("pincode") ?? ""),
    area_value: formData.get("area_value")
      ? Number(formData.get("area_value"))
      : null,
    area_unit: String(formData.get("area_unit") ?? "sqft") as AreaUnit,
    area_label: String(formData.get("area_label") ?? ""),
    approval_type: String(formData.get("approval_type") ?? "") as ApprovalType | "",
    ownership_status: String(formData.get("ownership_status") ?? "") as OwnershipStatus | "",
    amenities,
    google_maps_url: String(formData.get("google_maps_url") ?? ""),
    verification_status: String(formData.get("verification_status") ?? "pending") as VerificationStatus,
    listing_status: String(formData.get("listing_status") ?? "available") as ListingStatus,
    is_published: formData.get("is_published") === "on" || formData.get("is_published") === "true",
    is_featured: formData.get("is_featured") === "on" || formData.get("is_featured") === "true",
    bhk: formData.get("bhk") ? Number(formData.get("bhk")) : null,
    slug: String(formData.get("slug") ?? ""),
  };
}
