"use client";

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
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[100] flex justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="no-scrollbar relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-[#121212] sm:my-6 sm:h-[calc(100%-3rem)] sm:rounded-[2rem] sm:border sm:border-white/10"
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            {/* Hero */}
            <div className="grain-bg relative flex min-h-[340px] shrink-0 items-center justify-center overflow-hidden bg-[#171310] pt-10 pb-8 sm:min-h-[380px] sm:rounded-t-[2rem]">
              <FloatingBits variant="hero" />

              <div className="relative aspect-square w-[68%] max-w-[320px]">
                <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(255,138,26,0.45),transparent_70%)] blur-2xl" />
                <motion.div
                  layoutId={`plate-${item.id}`}
                  className="absolute inset-[6%] overflow-hidden rounded-full border-2 border-orange-300/20 shadow-[0_0_0_1px_rgba(255,178,71,0.12),0_30px_60px_-15px_rgba(0,0,0,0.75)]"
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
                </motion.div>

                {item.special && (
                  <span className="animate-pulse-glow absolute -right-1 top-2 z-20 rounded-full bg-gradient-to-r from-[#ffd27a] to-[#ff7a1a] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1a1200] shadow-lg">
                    ✦ Special Offer
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 -mt-6 flex flex-1 flex-col rounded-t-[1.75rem] bg-[#161513] px-5 pb-28 pt-6 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange-300/60">
                {item.category}
              </p>
              <h2 className="font-display mt-1.5 text-2xl font-bold leading-tight text-white sm:text-3xl">
                {item.name}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="text-gradient-gold font-display text-2xl font-extrabold sm:text-3xl">
                  Rs. {item.price.toLocaleString("en-LK")}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
                  🕒 {item.prepTime}
                </span>
                {item.spiceLevel && (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
                    🌶️ {spiceLabels[item.spiceLevel]}
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                {item.description}
              </p>

              <div className="mt-6">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-orange-200/80">
                  Ingredients
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky order bar */}
            <div className="sticky bottom-0 z-20 border-t border-white/8 bg-[#161513]/95 px-5 py-4 backdrop-blur-xl sm:rounded-b-[2rem] sm:px-8">
              <button
                onClick={() => onOrder(item)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffb347] via-[#ff9a2e] to-[#ff7a1a] py-3.5 text-sm font-bold uppercase tracking-wide text-[#1a1200] shadow-[0_10px_30px_-8px_rgba(255,122,26,0.65)] transition active:scale-[0.98] sm:text-base"
              >
                Order Now — Rs. {item.price.toLocaleString("en-LK")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
