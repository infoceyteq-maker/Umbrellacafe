"use client";

function NavIcon({ name }: { name: "home" | "menu" | "cart" | "info" }) {
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "home") {
    return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" /></svg>;
  }
  if (name === "menu") {
    return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
  }
  if (name === "cart") {
    return <svg {...common}><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.3a2 2 0 0 0 2-1.6L21 8H6" /><circle cx="10" cy="21" r="1" fill="currentColor" stroke="none" /><circle cx="17" cy="21" r="1" fill="currentColor" stroke="none" /></svg>;
  }
  return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.1" /></svg>;
}

export default function MobileBottomNav({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
  return (
    <nav className="mobile-bottom-nav sm:hidden" aria-label="Customer navigation">
      <a className="mobile-bottom-nav-item is-active" href="#home">
        <NavIcon name="home" />
        <span>Home</span>
      </a>
      <a className="mobile-bottom-nav-item" href="#menu">
        <NavIcon name="menu" />
        <span>Menu</span>
      </a>
      <button type="button" className="mobile-bottom-nav-item relative" onClick={onCartOpen} aria-label="Open your order">
        <NavIcon name="cart" />
        <span>Order</span>
        {cartCount > 0 && <span className="absolute right-[calc(50%-20px)] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b9e5bd] px-1 text-[9px] font-bold text-[#061a13]">{cartCount}</span>}
      </button>
      <a className="mobile-bottom-nav-item" href="#info">
        <NavIcon name="info" />
        <span>Info</span>
      </a>
    </nav>
  );
}
