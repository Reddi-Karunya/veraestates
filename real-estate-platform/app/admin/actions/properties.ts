"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { uniqueSlug, slugify } from "@/lib/slug";
import {
  formDataToPropertyInput,
  validatePropertyForm,
} from "@/lib/validations/property";
import { ensurePropertyChecksInitialized } from "@/lib/data/verification";

function toDbPayload(
  data: Extract<ReturnType<typeof validatePropertyForm>, { success: true }>["data"],
  slug: string,
  userId: string,
  publishedAt: string | null
) {
  const specs: Record<string, unknown> = {};
  if (data.bhk) specs.bhk = data.bhk;

  return {
    slug,
    title: data.title,
    short_description: data.short_description || null,
    description: data.description,
    property_type: data.property_type,
    price_inr: data.price_inr,
    city: data.city,
    state: data.state,
    locality: data.locality,
    location: {
      locality: data.locality,
      landmark: data.landmark || undefined,
      pincode: data.pincode || undefined,
    },
    area_value: data.area_value,
    area_unit: data.area_unit,
    area_label: data.area_label || null,
    approval_type: data.approval_type || null,
    ownership_status: data.ownership_status || null,
    amenities: data.amenities,
    google_maps_url: data.google_maps_url || null,
    verification_status: data.verification_status,
    listing_status: data.listing_status,
    is_published: data.is_published,
    is_featured: data.is_featured,
    specs,
    created_by: userId,
    published_at: data.is_published
      ? publishedAt ?? new Date().toISOString()
      : null,
  };
}

export async function createPropertyAction(
  _prev: unknown,
  formData: FormData
): Promise<{ errors?: Record<string, string> }> {
  const { userId } = await requireAdmin();
  const parsed = validatePropertyForm(formDataToPropertyInput(formData));
  if (!parsed.success) return { errors: parsed.errors };

  const slug =
    parsed.data.slug && slugify(parsed.data.slug)
      ? slugify(parsed.data.slug)
      : uniqueSlug(parsed.data.title);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .insert(toDbPayload(parsed.data, slug, userId, null))
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { errors: { slug: "Slug already exists" } };
    }
    return { errors: { form: error.message } };
  }

  await ensurePropertyChecksInitialized(data.id);

  revalidatePath("/properties");
  revalidatePath("/admin");
  redirect(`/admin/properties/${data.id}/edit?created=1`);
}

export async function updatePropertyAction(
  propertyId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ errors?: Record<string, string> }> {
  await requireAdmin();
  const parsed = validatePropertyForm(formDataToPropertyInput(formData));
  if (!parsed.success) return { errors: parsed.errors };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("properties")
    .select("published_at, slug")
    .eq("id", propertyId)
    .single();

  const slug =
    parsed.data.slug && slugify(parsed.data.slug)
      ? slugify(parsed.data.slug)
      : (existing?.slug ?? uniqueSlug(parsed.data.title));

  const publishedAt =
    parsed.data.is_published
      ? existing?.published_at ?? new Date().toISOString()
      : null;

  const payload = toDbPayload(parsed.data, slug, "", publishedAt);
  const { created_by, ...updatePayload } = payload;
  void created_by;

  const { error } = await supabase
    .from("properties")
    .update(updatePayload)
    .eq("id", propertyId);

  if (error) {
    return { errors: { form: error.message } };
  }

  revalidatePath("/properties");
  revalidatePath(`/properties/${slug}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/properties/${propertyId}/edit`);
  return {};
}

export async function deletePropertyAction(propertyId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: images } = await supabase
    .from("property_images")
    .select("storage_path")
    .eq("property_id", propertyId);

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (error) throw new Error(error.message);

  if (images?.length) {
    await supabase.storage
      .from("property-images")
      .remove(images.map((i) => i.storage_path));
  }

  revalidatePath("/properties");
  revalidatePath("/admin");
  redirect("/admin/properties");
}
