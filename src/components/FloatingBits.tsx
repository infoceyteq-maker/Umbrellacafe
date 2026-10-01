"use client";

const LEAF = (
  <path d="M2 14C2 6 8 2 15 2c0 7-4 13-12 13-.5 0-1-.4-1-1Z" />
);

type Bit = {
  kind: "leaf" | "spice" | "steam";
  top: string;
  left: string;
  size: number;
  delay: string;
  rotate: number;
  variant?: "a" | "b";
};

const defaultBits: Bit[] = [
  { kind: "leaf", top: "6%", left: "8%", size: 16, delay: "0s", rotate: -20 },
  { kind: "spice", top: "12%", left: "82%", size: 6, delay: "0.6s", rotate: 0 },
  { kind: "leaf", top: "78%", left: "88%", size: 14, delay: "1.1s", rotate: 40, variant: "b" },
  { kind: "spice", top: "70%", left: "6%", size: 5, delay: "1.6s", rotate: 0 },
  { kind: "spice", top: "40%", left: "92%", size: 4, delay: "0.3s", rotate: 0 },
  { kind: "spice", top: "88%", left: "40%", size: 5, delay: "2s", rotate: 0 },
];

export default function FloatingBits({
  variant = "card",
}: {
  variant?: "card" | "hero";
}) {
  const bits = defaultBits;
  const steamCount = variant === "hero" ? 3 : 1;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
      {bits.map((b, i) => (
        <span
          key={i}
          className={`absolute ${
            b.kind === "leaf" ? "animate-float-y" : "animate-float-y-rev"
          }`}
          style={{
            top: b.top,
            left: b.left,
            animationDelay: b.delay,
            transform: `rotate(${b.rotate}deg)`,
          }}
        >
          {b.kind === "leaf" ? (
            <svg
              width={b.size * (variant === "hero" ? 1.8 : 1)}
              height={b.size * (variant === "hero" ? 1.8 : 1)}
              viewBox="0 0 17 16"
              fill={b.variant === "b" ? "#e6202e" : "#ff540f"}
              opacity={variant === "hero" ? 0.9 : 0.55}
            >
              {LEAF}
            </svg>
          ) : (
            <span
              className="block rounded-full"
              style={{
                width: b.size * (variant === "hero" ? 1.6 : 1),
                height: b.size * (variant === "hero" ? 1.6 : 1),
                background:
                  "radial-gradient(circle, #ffd27a 0%, #ff540f 60%, rgba(230,32,46,0.9) 85%, transparent 100%)",
                opacity: variant === "hero" ? 0.85 : 0.5,
              }}
            />
          )}
        </span>
      ))}

      {Array.from({ length: steamCount }).map((_, i) => (
        <span
          key={`steam-${i}`}
          className="animate-steam absolute block rounded-full bg-orange-100/25 blur-[6px]"
          style={{
            bottom: variant === "hero" ? "10%" : "14%",
            left: `${38 + i * 12}%`,
            width: variant === "hero" ? 18 : 10,
            height: variant === "hero" ? 36 : 20,
            animationDelay: `${i * 0.9}s`,
          }}
        />
      ))}
    </div>
  );
}
