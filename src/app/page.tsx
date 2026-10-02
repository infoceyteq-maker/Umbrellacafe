"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import DishCard from "@/components/DishCard";
import DishModal from "@/components/DishModal";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import FloatingBits from "@/components/FloatingBits";
import SocialBar from "@/components/SocialBar";
import OffersButton from "@/components/OffersButton";
import OffersDrawer from "@/components/OffersDrawer";
import { categories, menuItems } from "@/data/menu";
import { Category, MenuItem } from "@/data/types";
import {
  AdminMenuItem,
  ComboFlyer,
  FLYERS_STORAGE_KEY,
  isOnOffer,
  MENU_STORAGE_KEY,
} from "@/data/admin";
import { flyerFromRow, menuFromRow, supabase } from "@/lib/supabase";

export default function Home() {
  const [menu, setMenu] = useState<MenuItem[]>(menuItems);
  const [active, setActive] = useState<Category | "All">("All");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [flyers, setFlyers] = useState<ComboFlyer[]>([]);
  const [offersOpen, setOffersOpen] = useState(false);

  useEffect(() => {
    const savedMenu = window.localStorage.getItem(MENU_STORAGE_KEY);
    if (!savedMenu) return;
    try {
      const parsed = JSON.parse(savedMenu) as AdminMenuItem[];
      if (Array.isArray(parsed)) {
        // The menu is shared with the local-only admin workspace.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMenu(parsed.filter((item) => item.active !== false));
      }
    } catch {
      // Keep the starter menu if the browser has an invalid saved value.
    }
    const savedFlyers = window.localStorage.getItem(FLYERS_STORAGE_KEY);
    if (savedFlyers) {
      try {
        const parsed = JSON.parse(savedFlyers) as ComboFlyer[];
        if (Array.isArray(parsed)) setFlyers(parsed.filter((flyer) => flyer.active !== false));
      } catch {
        // Ignore malformed local flyer data.
      }
    }

    if (supabase) {
      void (async () => {
        try {
          const { data } = await supabase
            .from("menu_items")
            .select("*")
            .eq("active", true)
            .order("created_at", { ascending: false });
          if (data?.length) setMenu(data.map((row) => menuFromRow(row)));
        } catch {
          // A dropped connection should leave the starter menu in place.
        }
      })();

      void (async () => {
        try {
          const { data } = await supabase
            .from("combo_flyers")
            .select("*")
            .eq("active", true)
            .order("created_at", { ascending: false });
          if (data?.length) setFlyers(data.map((row) => flyerFromRow(row)));
        } catch {
          // Flyers are optional; the offers panel simply shows dishes only.
        }
      })();
    }
  }, []);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const filtered = useMemo(
    () => (active === "All" ? menu : menu.filter((m) => m.category === active)),
    [active, menu]
  );

  const offerItems = useMemo(() => menu.filter((item) => isOnOffer(item)), [menu]);
  const offerCount = offerItems.length + flyers.length;

  const cartItems = useMemo(
    () => menu.filter((m) => cart[m.id]),
    [cart, menu]
  );
  // Dishes removed from the menu must not keep inflating the basket badge.
  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + (cart[item.id] ?? 0), 0),
    [cart, cartItems]
  );

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }

  function handleOrder(item: MenuItem) {
    setCart((c) => ({ ...c, [item.id]: (c[item.id] ?? 0) + 1 }));
    showToast(`Added "${item.name}" to your order`);
    setSelected(null);
  }

  function setQty(id: string, qty: number) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  return (
    <div className="min-h-screen">
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <CategoryTabs categories={["All", ...categories]} active={active} onChange={setActive} />

      {/* Hero */}
      <section className="grain-bg relative overflow-hidden px-4 pb-8 pt-8 text-center sm:px-6 sm:pt-10">
        <FloatingBits variant="hero" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto mb-7 max-w-4xl overflow-hidden rounded-2xl border border-emerald-400/20 shadow-[0_18px_50px_-18px_rgba(45,226,138,0.45)]"
        >
          <Image
            src="/cover/cover.jpg"
            alt="The Umbrella Ella — Roti &amp; Kottu Hub, overlooking the Ella valley"
            width={2045}
            height={534}
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="h-auto w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#02120b] via-transparent to-transparent" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-[11px] font-medium uppercase tracking-[0.4em] text-emerald-300/70"
        >
          Perched above the Ella Valley
        </motion.p>

        {/* Facebook · Instagram · Location + contact details */}
        <SocialBar />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative z-10 mx-auto mt-2 max-w-md text-sm text-[#a1d99b]"
        >
          Tap any dish to explore ingredients, prep time &amp; place your order.
        </motion.p>
      </section>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <motion.div
          layout
          className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
        >
          {filtered.map((item, i) => (
            <DishCard key={item.id} item={item} index={i} onSelect={setSelected} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-[#8dc389]">
            No dishes found in this category yet.
          </p>
        )}
      </main>

      <footer className="border-t border-emerald-400/10 px-6 py-8 text-center text-xs text-[#6ba273]">
        <p>Cafe Umbrella · Passara Road, 3rd Mile, Ella, Uva Province 90090</p>
        <p className="mt-1">Made with 🔥 for our guests in the hills</p>
        <a href="/admin" className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-300/65 transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-200">
          Staff admin <span aria-hidden="true">→</span>
        </a>
      </footer>

      {offerCount > 0 && <OffersButton count={offerCount} onClick={() => setOffersOpen(true)} />}
      <OffersDrawer
        open={offersOpen}
        offers={offerItems}
        flyers={flyers}
        onClose={() => setOffersOpen(false)}
        onSelect={(item) => {
          setOffersOpen(false);
          setSelected(item);
        }}
      />

      <DishModal item={selected} onClose={() => setSelected(null)} onOrder={handleOrder} />
      <CartDrawer
        open={cartOpen}
        items={cartItems}
        quantities={cart}
        onClose={() => setCartOpen(false)}
        onSetQty={setQty}
        onClear={() => setCart({})}
      />
      <Toast message={toast} />
    </div>
  );
}
