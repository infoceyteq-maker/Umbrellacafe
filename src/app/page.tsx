"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import DishCard from "@/components/DishCard";
import DishModal from "@/components/DishModal";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import FloatingBits from "@/components/FloatingBits";
import { categories, menuItems } from "@/data/menu";
import { Category, MenuItem } from "@/data/types";

export default function Home() {
  const [active, setActive] = useState<Category | "All">("All");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const filtered = useMemo(
    () => (active === "All" ? menuItems : menuItems.filter((m) => m.category === active)),
    [active]
  );

  const cartCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart]
  );
  const cartItems = useMemo(
    () => menuItems.filter((m) => cart[m.id]),
    [cart]
  );

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
    <div className="min-h-screen bg-[#070304]">
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <CategoryTabs categories={["All", ...categories]} active={active} onChange={setActive} />

      {/* Hero */}
      <section className="grain-bg relative overflow-hidden px-4 pb-8 pt-8 text-center sm:px-6 sm:pt-10">
        <FloatingBits variant="hero" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-[11px] font-medium uppercase tracking-[0.4em] text-orange-300/70"
        >
          Perched above the Ella Valley
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="font-display relative z-10 mt-2 text-3xl font-extrabold leading-tight text-white sm:text-4xl"
        >
          The <span className="text-gradient-fire">Digital Menu</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative z-10 mx-auto mt-2 max-w-md text-sm text-zinc-400"
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
          <p className="mt-16 text-center text-sm text-zinc-500">
            No dishes found in this category yet.
          </p>
        )}
      </main>

      <footer className="border-t border-orange-400/10 px-6 py-8 text-center text-xs text-zinc-600">
        <p>Cafe Umbrella · Ella, Sri Lanka</p>
        <p className="mt-1">Made with 🔥 for our guests in the hills</p>
      </footer>

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
