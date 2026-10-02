"use client";

import { categoryIcons } from "@/data/menu";
import { Category } from "@/data/types";

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: (Category | "All")[];
  active: Category | "All";
  onChange: (c: Category | "All") => void;
}) {
  return (
    <div className="no-scrollbar sticky top-[57px] z-30 flex gap-2 overflow-x-auto border-b border-white/5 bg-[#02120b]/70 px-4 py-3 backdrop-blur-xl sm:top-[65px] sm:px-6">
      {categories.map((c) => {
        const isActive = active === c;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 sm:text-sm ${
              isActive
                ? "border-transparent bg-gradient-to-r from-[#7cf7b0] via-[#22c77e] to-[#059669] text-[#03291b] shadow-[0_0_18px_rgba(57,255,136,0.5)]"
                : "border-white/10 bg-white/[0.02] text-[#c7e9c0] hover:border-emerald-400/40 hover:text-emerald-200"
            }`}
          >
            <span>{c === "All" ? "🍴" : categoryIcons[c]}</span>
            {c}
          </button>
        );
      })}
    </div>
  );
}
