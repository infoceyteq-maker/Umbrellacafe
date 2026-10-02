"use client";

import Image from "next/image";
import { useState } from "react";

export default function DishImage({
  src,
  alt,
  className = "",
  sizes,
  priority,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#143228,transparent_60%),linear-gradient(135deg,#0d271e,#07160f)] ${className}`}
      >
        <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(45deg,rgba(45,155,119,0.07)_0,rgba(45,155,119,0.07)_2px,transparent_2px,transparent_10px)]" />
        <span className="relative text-5xl opacity-70">🍽️</span>
        <span className="absolute bottom-3 text-[10px] uppercase tracking-[0.2em] text-emerald-200/50">
          Photo coming soon
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, 480px"}
      priority={priority}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
