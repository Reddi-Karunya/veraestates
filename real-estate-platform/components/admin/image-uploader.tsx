"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deletePropertyImageAction,
  setCoverImageAction,
  uploadPropertyImagesAction,
} from "@/app/admin/actions/images";
import type { PropertyImageRow } from "@/types/database";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  propertyId: string;
  images: PropertyImageRow[];
};

export function ImageUploader({ propertyId, images }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    setError(null);
    startTransition(async () => {
      const result = await uploadPropertyImagesAction(propertyId, formData);
      if (result.error) setError(result.error);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleDelete(imageId: string) {
    startTransition(async () => {
      const result = await deletePropertyImageAction(imageId, propertyId);
      if (result.error) setError(result.error);
    });
  }

  function handleSetCover(imageId: string) {
    startTransition(async () => {
      await setCoverImageAction(imageId, propertyId);
    });
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 transition-colors",
          isPending && "opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <ImagePlus className="size-10 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          JPEG, PNG, WebP up to 10MB each
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImagePlus data-icon="inline-start" />
          )}
          Upload images
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[...images]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image
                  src={image.public_url}
                  alt={image.alt_text ?? "Property"}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                {image.is_cover && (
                  <span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-xs font-medium text-navy">
                    Cover
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy/60 opacity-0 transition-opacity group-hover:opacity-100">
                  {!image.is_cover && (
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="secondary"
                      onClick={() => handleSetCover(image.id)}
                      title="Set as cover"
                    >
                      <Star />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="destructive"
                    onClick={() => handleDelete(image.id)}
                    title="Delete"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
