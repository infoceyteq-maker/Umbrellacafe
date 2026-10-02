"use client";

import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/data/config";

const ICON_CLASS =
  "group relative flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/25 bg-white/[0.03] text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-400/70 hover:bg-white/[0.07] hover:text-emerald-100 hover:shadow-[0_8px_22px_-8px_rgba(45,226,138,0.75)] sm:h-11 sm:w-11";

export default function SocialBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12 }}
      className="relative z-10 mt-2 mb-6 flex flex-col items-center gap-3"
    >
      {/* Cafe name — main heading */}
      <h1 className="font-display text-center text-3xl font-extrabold leading-tight tracking-tight drop-shadow-[0_0_28px_rgba(45,226,138,0.45)] sm:text-5xl">
        <span className="text-gradient-fire">Cafe Umbrella</span>
        <span className="text-[#eafbe6]"> — Ella</span>
      </h1>

      {/* Icon row: Facebook · Instagram · Location */}
      <div className="flex items-center gap-3">
        <a
          href={SOCIAL_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Cafe Umbrella on Facebook"
          title="Facebook"
          className={ICON_CLASS}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
          </svg>
        </a>

        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Cafe Umbrella on Instagram"
          title="Instagram"
          className={ICON_CLASS}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <a
          href={SOCIAL_LINKS.location}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Find Cafe Umbrella on the map"
          title="Location"
          className={ICON_CLASS}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            aria-hidden="true"
          >
            <path
              d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
        </a>
      </div>

      <p className="mx-auto max-w-xs text-center text-[11px] leading-relaxed text-[#8dc389] sm:text-xs">
        Cafe Umbrella · Ella, Sri Lanka
      </p>
    </motion.div>
  );
}
