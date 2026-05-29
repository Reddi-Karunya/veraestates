"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "property-images";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadPropertyImagesAction(
  propertyId: string,
  formData: FormData
): Promise<{ error?: string; uploaded?: number }> {
  await requireAdmin();
  const supabase = await createClient();

  const files = formData.getAll("files") as File[];
  if (!files.length) return { error: "No files selected" };

  const { data: existingImages } = await supabase
    .from("property_images")
    .select("sort_order, is_cover")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: false });

  let nextOrder = (existingImages?.[0]?.sort_order ?? -1) + 1;
  const hasCover = existingImages?.some((i) => i.is_cover) ?? false;
  let uploaded = 0;

  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    if (file.size > MAX_FILE_SIZE) {
      return { error: `${file.name} exceeds 10MB limit` };
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { error: `${file.name}: invalid file type` };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const isCover = !hasCover && uploaded === 0;
    const { error: dbError } = await supabase.from("property_images").insert({
      property_id: propertyId,
      storage_path: path,
      public_url: urlData.publicUrl,
      sort_order: nextOrder++,
      is_cover: isCover,
    });

    if (dbError) {
      await supabase.storage.from(BUCKET).remove([path]);
      return { error: dbError.message };
    }

    uploaded++;
  }

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath("/properties");
  return { uploaded };
}

export async function deletePropertyImageAction(imageId: string, propertyId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: image } = await supabase
    .from("property_images")
    .select("storage_path, is_cover")
    .eq("id", imageId)
    .single();

  if (!image) return { error: "Image not found" };

  await supabase.storage.from(BUCKET).remove([image.storage_path]);
  await supabase.from("property_images").delete().eq("id", imageId);

  if (image.is_cover) {
    const { data: next } = await supabase
      .from("property_images")
      .select("id")
      .eq("property_id", propertyId)
      .order("sort_order")
      .limit(1)
      .single();

    if (next) {
      await supabase
        .from("property_images")
        .update({ is_cover: true })
        .eq("id", next.id);
    }
  }

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath("/properties");
  return {};
}

export async function setCoverImageAction(imageId: string, propertyId: string) {
  await requireAdmin();
  const supabase = await createClient();

  await supabase
    .from("property_images")
    .update({ is_cover: false })
    .eq("property_id", propertyId);

  await supabase
    .from("property_images")
    .update({ is_cover: true })
    .eq("id", imageId);

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath("/properties");
  return {};
}
