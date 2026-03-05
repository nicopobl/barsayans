"use client";

import { useState } from "react";

interface CourseImageProps {
  src?: string | null;
  alt: string;
}

/**
 * Handles broken / missing course thumbnails gracefully.
 * Shows a branded placeholder when the image fails to load.
 */
export function CourseImage({ src, alt }: CourseImageProps) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-zinc-800/60">
        <span className="text-5xl select-none">⚡</span>
        <span className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">Sin vista previa</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
    />
  );
}
