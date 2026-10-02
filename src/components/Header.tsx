"use client";

import Image from "next/image";

export default function Header({
  cartCount,
  onCartOpen,
}: {
  cartCount: number;
  onCartOpen: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#06120e]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo/logo.png"
            alt="Umbrella Art Cafe"
            width={110}
            height={100}
            priority
            className="h-8 w-auto drop-shadow-[0_0_10px_rgba(45,155,119,0.45)] sm:h-9"
          />
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold tracking-wide text-white sm:text-lg">
              Cafe <span className="text-gradient-fire font-bold">Umbrella</span>
            </p>
            <p className="-mt-0.5 text-[9px] font-medium uppercase tracking-[0.35em] text-emerald-300/70 sm:text-[10px]">
              Ella
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/admin"
            aria-label="Open staff admin"
            className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.04] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-300/70 transition hover:border-emerald-400/45 hover:bg-emerald-400/10 hover:text-emerald-200 sm:px-3"
          >
            Admin
          </a>
          <button
            type="button"
            aria-label="View your order"
          onClick={onCartOpen}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/25 bg-white/[0.03] text-emerald-200 transition hover:border-emerald-400/60 hover:bg-white/[0.06] sm:h-10 sm:w-10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="21" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="17" cy="21" r="1.4" fill="currentColor" stroke="none" />
          </svg>
          {cartCount > 0 && (
            <span className="animate-flame absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-[#b9e5bd] via-[#2d9b77] to-[#b98b55] px-1 text-[10px] font-bold text-[#061a13] shadow shadow-emerald-700/50">
              {cartCount}
            </span>
          )}
        </button>
        </div>
      </div>
    </header>
  );
}
