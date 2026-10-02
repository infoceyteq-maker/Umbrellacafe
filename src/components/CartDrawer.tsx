"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CafeOrder, OrderType, orderTypes } from "@/data/admin";
import { orderToRow, supabase } from "@/lib/supabase";
import { MenuItem } from "@/data/types";

const orderTypeIcons: Record<OrderType, string> = {
  "Dine-in": "🍽️",
  Takeaway: "🥡",
  Delivery: "🛵",
};

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
  const [orderType, setOrderType] = useState<OrderType>("Dine-in");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [tableOrNote, setTableOrNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const total = items.reduce((s, i) => s + i.price * quantities[i.id], 0);

  function closeDrawer() {
    setOrderError(null);
    setSubmittedOrderId(null);
    setSubmitting(false);
    onClose();
  }

  function clearOrder() {
    setOrderError(null);
    setSubmittedOrderId(null);
    onClear();
  }

  async function submitOrder() {
    setOrderError(null);
    if (!customerName.trim() || !customerContact.trim()) {
      setOrderError("Please add your name and phone number before confirming.");
      return;
    }
    if (!supabase) {
      setOrderError("Online ordering is not connected yet. Please try again after the backend is configured.");
      return;
    }

    setSubmitting(true);
    const now = new Date();
    // This runs only after the customer presses Confirm order.
    // eslint-disable-next-line react-hooks/purity
    const orderId = String(Date.now()).slice(-8);
    const order: CafeOrder = {
      id: orderId,
      customer: customerName.trim(),
      contact: customerContact.trim(),
      email: customerEmail.trim() || undefined,
      items: items.map((item) => ({
        name: item.name,
        quantity: quantities[item.id],
        price: item.price,
      })),
      total,
      status: "Preparing",
      orderType,
      payment: "Cash",
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" }),
      table: tableOrNote.trim() || undefined,
    };

    const { error } = await supabase.from("orders").insert(orderToRow(order));
    if (error) {
      setOrderError("Order could not be sent. Please run the Supabase schema and try again.");
    } else {
      setSubmittedOrderId(orderId);
    }
    setSubmitting(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={closeDrawer}
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
                onClick={closeDrawer}
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

                <div className="mt-4 rounded-2xl border border-orange-400/15 bg-orange-400/[0.04] p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-white">Finish your order</p>
                      <p className="mt-1 text-[10px] text-zinc-500">Choose how you will receive it.</p>
                    </div>
                    {submittedOrderId && <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">Sent #{submittedOrderId}</span>}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {orderTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOrderType(type)}
                        className={`rounded-xl border px-2 py-2 text-[10px] font-medium transition ${orderType === type ? "border-orange-400/50 bg-orange-400/15 text-orange-100" : "border-white/10 bg-white/[0.02] text-zinc-500 hover:border-orange-400/25 hover:text-zinc-200"}`}
                      >
                        <span className="block text-base">{orderTypeIcons[type]}</span>
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name *" className="h-10 rounded-xl border border-white/10 bg-[#100506] px-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50" />
                    <input value={customerContact} onChange={(event) => setCustomerContact(event.target.value)} placeholder="Phone number *" className="h-10 rounded-xl border border-white/10 bg-[#100506] px-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50" />
                    <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="Email (optional)" className="h-10 rounded-xl border border-white/10 bg-[#100506] px-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50" />
                    <input value={tableOrNote} onChange={(event) => setTableOrNote(event.target.value)} placeholder={orderType === "Dine-in" ? "Table number" : orderType === "Delivery" ? "Delivery note" : "Pickup note"} className="h-10 rounded-xl border border-white/10 bg-[#100506] px-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-orange-400/50" />
                  </div>
                  {orderError && <p className="mt-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-[10px] leading-relaxed text-red-300">{orderError}</p>}
                  {submittedOrderId && <p className="mt-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[10px] leading-relaxed text-emerald-300">Order sent to Cafe Umbrella. The team can now see it in the admin order desk.</p>}
                  <button type="button" onClick={submitOrder} disabled={submitting || Boolean(submittedOrderId)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffb347] via-[#ff540f] to-[#e6202e] py-3 text-xs font-bold uppercase tracking-wide text-[#2b0500] shadow-[0_10px_30px_-8px_rgba(230,32,46,0.55)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                    {submitting ? "Sending order..." : submittedOrderId ? "Order sent to kitchen" : "Confirm order"}
                  </button>
                </div>

                <button
                  onClick={clearOrder}
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
