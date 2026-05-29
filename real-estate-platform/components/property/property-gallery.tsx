"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PropertyGalleryProps = {
  images: string[];
  title: string;
};

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={activeImage}
          alt={`${title} — image ${activeIndex + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-cream transition-all",
                index === activeIndex
                  ? "ring-gold"
                  : "ring-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
