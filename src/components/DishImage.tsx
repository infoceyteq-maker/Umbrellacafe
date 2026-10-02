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
  const [failed, setFailed] = useState(false);

  // Admin-added dishes can carry a pasted remote URL or a base64 data URL.
  // next/image only handles local (/public) paths unless every host is
  // configured, so anything else is rendered with a plain <img> instead.
  const isOptimizable = Boolean(src && src.startsWith("/"));

  if (failed || !src) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#2a120c,transparent_60%),linear-gradient(135deg,#1c0a07,#0d0405)] ${className}`}
      >
        <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(45deg,rgba(255,84,15,0.07)_0,rgba(255,84,15,0.07)_2px,transparent_2px,transparent_10px)]" />
        <span className="relative text-5xl opacity-70">🍽️</span>
        <span className="absolute bottom-3 text-[10px] uppercase tracking-[0.2em] text-orange-200/50">
          Photo coming soon
        </span>
      </div>
    );
  }

  if (!isOptimizable) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
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
