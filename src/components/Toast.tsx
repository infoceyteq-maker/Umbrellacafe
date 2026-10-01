"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Toast({ message }: { message: string | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex items-center gap-2 rounded-full border border-orange-400/25 bg-[#1d0c0a]/95 px-5 py-3 text-sm font-medium text-orange-100 shadow-[0_15px_40px_-10px_rgba(230,32,46,0.5)] backdrop-blur-xl"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb347] to-[#e6202e] text-[11px] text-[#2b0500]">
              ✓
            </span>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
