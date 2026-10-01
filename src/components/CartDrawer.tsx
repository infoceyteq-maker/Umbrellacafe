"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MenuItem } from "@/data/types";
import { buildWhatsAppOrderLink } from "@/data/config";

export default function CartDrawer({
  open,
  items,
  quantities,
  onClose,
  onSetQty,
  onClear,
}: {
  open: boolean;
  items: MenuItem[];
  quantities: Record<string, number>;
  onClose: () => void;
  onSetQty: (id: string, qty: number) => void;
  onClear: () => void;
}) {
  const lines = items.map(
    (i) =>
      `${quantities[i.id]} × ${i.name} — Rs. ${(
        i.price * quantities[i.id]
      ).toLocaleString("en-LK")}`
  );
  const total = items.reduce((s, i) => s + i.price * quantities[i.id], 0);
  const waLink = buildWhatsAppOrderLink(lines, total);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-[1.75rem] border border-orange-400/15 bg-[#120607] sm:rounded-[1.75rem]"
            initial={{ y: 70, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-orange-400/10 px-6 py-4">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Your <span className="text-gradient-fire">Order</span>
                </h2>
                <p className="text-[11px] uppercase tracking-[0.25em] text-orange-300/60">
                  Cafe Umbrella · Ella
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close order"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition hover:border-orange-400/40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <span className="text-4xl">🍽️</span>
                  <p className="mt-3 text-sm text-zinc-400">
                    Your order is empty.
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Tap “Order Now” on any dish to add it here.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-orange-400/10 bg-white/[0.02] p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-100">
                          {item.name}
                        </p>
                        <p className="text-xs text-orange-300/70">
                          Rs. {(item.price * quantities[item.id]).toLocaleString("en-LK")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSetQty(item.id, quantities[item.id] - 1)}
                          aria-label={`Remove one ${item.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition hover:border-orange-400/50 hover:text-orange-200"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-white">
                          {quantities[item.id]}
                        </span>
                        <button
                          onClick={() => onSetQty(item.id, quantities[item.id] + 1)}
                          aria-label={`Add one more ${item.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb347] to-[#e6202e] text-sm font-bold text-[#2b0500] transition active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-orange-400/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Total</span>
                  <span className="text-gradient-fire font-display text-xl font-extrabold">
                    Rs. {total.toLocaleString("en-LK")}
                  </span>
                </div>

                {waLink ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffb347] via-[#ff540f] to-[#e6202e] py-3.5 text-sm font-bold uppercase tracking-wide text-[#2b0500] shadow-[0_10px_30px_-8px_rgba(230,32,46,0.7)] transition active:scale-[0.98]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.3.3c-.1.1-.2.3-.1.5.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.2.1.4.1.5-.1l.8-1c.2-.2.3-.2.5-.1l1.9.9c.2.1.4.2.4.3.1.1.1.5-.1 1.1Z" />
                    </svg>
                    Order via WhatsApp
                  </a>
                ) : (
                  <p className="mt-3 rounded-2xl border border-orange-400/15 bg-white/[0.02] px-4 py-3 text-center text-xs leading-relaxed text-zinc-400">
                    🙋 Show this screen to your waiter to place the order.
                  </p>
                )}

                <button
                  onClick={onClear}
                  className="mt-2 w-full rounded-full border border-white/10 py-2.5 text-xs font-medium text-zinc-400 transition hover:border-red-400/40 hover:text-red-300"
                >
                  Clear order
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
