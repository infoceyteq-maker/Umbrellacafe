"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MenuItem } from "@/data/types";
import DishImage from "./DishImage";
import FloatingBits from "./FloatingBits";

const spiceLabels: Record<number, string> = {
  1: "Mild",
  2: "Medium",
  3: "Spicy",
};

export default function DishModal({
  item,
  onClose,
  onOrder,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onOrder: (item: MenuItem) => void;
}) {
  // Escape closes the dish sheet; the page behind it stays put while open.
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[100] flex justify-center bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="no-scrollbar relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-[#02120b] sm:my-6 sm:h-[calc(100%-3rem)] sm:rounded-[2rem] sm:border sm:border-emerald-400/15"
            initial={{ opacity: 0, scale: 0.92, y: 40, rotateX: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            style={{ transformPerspective: 1200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#eafbe6] backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-black/60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            {/* Hero */}
            <div className="grain-bg relative flex min-h-[340px] shrink-0 items-center justify-center overflow-hidden bg-[#05241a] pt-10 pb-8 sm:min-h-[380px] sm:rounded-t-[2rem]">
              <FloatingBits variant="hero" />

              <div className="relative aspect-square w-[68%] max-w-[320px]">
                <div className="animate-flame absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(45,226,138,0.5),rgba(5,150,105,0.25)_60%,transparent_75%)] blur-2xl" />
                <motion.div
                  layoutId={`plate-${item.id}`}
                  className="absolute inset-[6%] overflow-hidden rounded-full border-2 border-emerald-400/20 shadow-[0_0_0_1px_rgba(45,226,138,0.14),0_30px_60px_-15px_rgba(0,0,0,0.8)]"
                >
                  <div className="animate-slow-rotate absolute inset-[-6%]">
                    <DishImage
                      src={item.image}
                      alt={item.name}
                      className="object-cover"
                      sizes="360px"
                      priority
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_50%,rgba(0,0,0,0.5)_100%)]" />
                  <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_24px_rgba(45,226,138,0.25)]" />
                </motion.div>

                {item.special && (
                  <span className="animate-pulse-glow absolute -right-1 top-2 z-20 rounded-full bg-gradient-to-r from-[#7cf7b0] via-[#22c77e] to-[#059669] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#03291b] shadow-lg shadow-emerald-600/40">
                    ✦ Special Offer
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 -mt-6 flex flex-1 flex-col rounded-t-[1.75rem] bg-[#04190f] px-5 pb-28 pt-6 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-300/60">
                {item.category}
              </p>
              <h2 className="font-display mt-1.5 text-2xl font-bold leading-tight text-[#eafbe6] sm:text-3xl">
                {item.name}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="text-gradient-fire font-display text-2xl font-extrabold sm:text-3xl">
                  Rs. {Number(item.price ?? 0).toLocaleString("en-LK")}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[#c7e9c0]">
                  🕒 {item.prepTime}
                </span>
                {item.spiceLevel && (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[#c7e9c0]">
                    🌶️ {spiceLabels[item.spiceLevel]}
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-[#a1d99b]">
                {item.description}
              </p>

              <div className="mt-6">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
                  Ingredients
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(item.ingredients ?? []).map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-emerald-400/15 bg-white/[0.03] px-3 py-1.5 text-xs text-[#c7e9c0]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky order bar */}
            <div className="sticky bottom-0 z-20 border-t border-emerald-400/10 bg-[#04190f]/95 px-5 py-4 backdrop-blur-xl sm:rounded-b-[2rem] sm:px-8">
              <button
                onClick={() => onOrder(item)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7cf7b0] via-[#22c77e] to-[#059669] py-3.5 text-sm font-bold uppercase tracking-wide text-[#03291b] shadow-[0_10px_30px_-8px_rgba(5,150,105,0.7)] transition active:scale-[0.98] sm:text-base"
              >
                Order Now — Rs. {Number(item.price ?? 0).toLocaleString("en-LK")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
