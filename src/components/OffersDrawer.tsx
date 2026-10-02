"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ComboFlyer, discountPercent, isOnOffer } from "@/data/admin";
import { MenuItem } from "@/data/types";
import DishImage from "./DishImage";

/** Slide-in panel listing discounted dishes and uploaded combo flyers. */
export default function OffersDrawer({
  open,
  offers,
  flyers,
  onClose,
  onSelect,
}: {
  open: boolean;
  offers: MenuItem[];
  flyers: ComboFlyer[];
  onClose: () => void;
  onSelect: (item: MenuItem) => void;
}) {
  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[160] flex justify-end bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={close}
        >
          <motion.aside
            className="no-scrollbar relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-emerald-400/20 bg-[#04190f]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-emerald-400/10 bg-[#04190f]/95 px-6 py-5 backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-300/70">
                  Cafe Umbrella
                </p>
                <h2 className="font-display mt-1 text-xl font-bold text-[#eafbe6]">
                  Today&apos;s <span className="text-gradient-fire">Offers</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close offers"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#eafbe6] transition hover:border-emerald-400/40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 px-6 py-5">
              {/* Combo packages */}
              {flyers.length > 0 && (
                <section className="mb-7">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
                    Combo packages
                  </h3>
                  <div className="mt-3 flex flex-col gap-4">
                    {flyers.map((flyer) => (
                      <figure
                        key={flyer.id}
                        className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-white/[0.02] shadow-[0_18px_45px_-20px_rgba(57,255,136,0.45)]"
                      >
                        {/* Flyers are operator-uploaded artwork of any aspect ratio. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={flyer.image}
                          alt={flyer.title}
                          loading="lazy"
                          className="w-full object-cover"
                        />
                        <figcaption className="px-4 py-3">
                          <p className="text-sm font-semibold text-[#eafbe6]">{flyer.title}</p>
                          {flyer.detail && (
                            <p className="mt-1 text-xs leading-relaxed text-[#a1d99b]">{flyer.detail}</p>
                          )}
                          {typeof flyer.price === "number" && flyer.price > 0 && (
                            <p className="text-gradient-fire font-display mt-2 text-lg font-extrabold">
                              Rs. {flyer.price.toLocaleString("en-LK")}
                            </p>
                          )}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {/* Discounted dishes */}
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
                Dishes on offer
              </h3>
              {offers.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-dashed border-emerald-400/20 px-4 py-10 text-center text-xs text-[#8dc389]">
                  No dish offers running right now. Check back soon!
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-3">
                  {offers.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(item)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-emerald-400/15 bg-white/[0.02] p-3 text-left transition hover:border-emerald-400/45 hover:bg-emerald-400/[0.06]"
                      >
                        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                          <DishImage src={item.image} alt={item.name} className="object-cover" sizes="64px" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-[#eafbe6]">{item.name}</span>
                          <span className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-gradient-fire font-display text-base font-extrabold">
                              Rs. {Number(item.offerPrice ?? item.price).toLocaleString("en-LK")}
                            </span>
                            {isOnOffer(item) && (
                              <>
                                <span className="text-xs text-[#6ba273] line-through">
                                  Rs. {Number(item.price).toLocaleString("en-LK")}
                                </span>
                                <span className="rounded-full bg-[#39ff88]/15 px-2 py-0.5 text-[10px] font-bold text-[#7cf7b0]">
                                  −{discountPercent(item)}%
                                </span>
                              </>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
