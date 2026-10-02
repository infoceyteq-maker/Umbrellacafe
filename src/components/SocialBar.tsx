"use client";

import { motion } from "framer-motion";
import { CAFE, SOCIAL_LINKS } from "@/data/config";

const ICON_CLASS =
  "group relative flex h-10 w-10 items-center justify-center rounded-full border border-orange-400/25 bg-white/[0.03] text-orange-200 transition hover:-translate-y-0.5 hover:border-orange-400/70 hover:bg-white/[0.07] hover:text-orange-100 hover:shadow-[0_8px_22px_-8px_rgba(255,84,15,0.75)] sm:h-11 sm:w-11";

export default function SocialBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12 }}
      className="relative z-10 -mt-3 mb-6 flex flex-col items-center gap-3"
    >
      {/* Cafe name */}
      <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-white sm:text-base">
        Cafe <span className="text-gradient-fire">Umbrella</span>
        <span className="text-orange-300/70"> — Ella</span>
      </p>

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

      {/* WhatsApp number + address */}
      <div className="space-y-1 text-center">
        <a
          href={`https://wa.me/${CAFE.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-200 transition hover:text-orange-100 sm:text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.6 1.1 1.3 1.7.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.8c.3.1.5.2.5.4.1.1.1.7-.1 1.4z" />
          </svg>
          {CAFE.whatsappDisplay}
        </a>
        <p className="mx-auto max-w-xs text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
          {CAFE.address}
        </p>
      </div>
    </motion.div>
  );
}
