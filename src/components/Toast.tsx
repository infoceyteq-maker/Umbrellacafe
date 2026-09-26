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
            className="flex items-center gap-2 rounded-full border border-orange-300/25 bg-[#1c1a16]/95 px-5 py-3 text-sm font-medium text-orange-100 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd27a] to-[#ff7a1a] text-[11px] text-[#1a1200]">
              ✓
            </span>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
