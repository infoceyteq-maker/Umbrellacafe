"use client";

export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cafe Umbrella Ella logo"
    >
      <defs>
        <linearGradient id="umbrellaGreen" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f1dfad" />
          <stop offset="45%" stopColor="#2d9b77" />
          <stop offset="100%" stopColor="#b98b55" />
        </linearGradient>
        <radialGradient id="umbrellaGlow" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#42b58c" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#42b58c" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="#061812" stroke="url(#umbrellaGreen)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="44" fill="url(#umbrellaGlow)" />

      {/* umbrella canopy */}
      <path
        d="M14 46 C14 25 30 12 50 12 C70 12 86 25 86 46 C79 41 71 38 63.5 41 C60 42.5 58 46 50 46 C42 46 40 42.5 36.5 41 C29 38 21 41 14 46 Z"
        fill="none"
        stroke="url(#umbrellaGreen)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* ribs */}
      <path d="M50 12 V46" stroke="url(#umbrellaGreen)" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 12 C42 22 40 34 40 46" stroke="url(#umbrellaGreen)" strokeWidth="1.4" opacity="0.7" />
      <path d="M50 12 C58 22 60 34 60 46" stroke="url(#umbrellaGreen)" strokeWidth="1.4" opacity="0.7" />
      {/* pole */}
      <path d="M50 46 V78" stroke="url(#umbrellaGreen)" strokeWidth="3" strokeLinecap="round" />
      {/* handle */}
      <path
        d="M50 78 C50 86 58 86 58 78"
        stroke="url(#umbrellaGreen)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* little flame wisps */}
      <path
        d="M28 62 C24 58 30 56 27 51"
        stroke="url(#umbrellaGreen)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M72 62 C76 58 70 56 73 51"
        stroke="url(#umbrellaGreen)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
