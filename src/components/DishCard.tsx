"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MenuItem } from "@/data/types";
import DishImage from "./DishImage";
import FloatingBits from "./FloatingBits";

export default function DishCard({
  item,
  index,
  onSelect,
}: {
  item: MenuItem;
  index: number;
  onSelect: (item: MenuItem) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-40, 40], [12, -12]), {
    stiffness: 220,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-12, 12]), {
    stiffness: 220,
    damping: 20,
  });
  // subtle live depth-tilt for the glow as the pointer moves
  const glowX = useTransform(x, [-40, 40], ["30%", "70%"]);
  const glowY = useTransform(y, [-40, 40], ["25%", "70%"]);

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      style={{ perspective: 900 }}
    >
      <motion.button
        onClick={() => onSelect(item)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="card-sheen group relative flex w-full flex-col overflow-hidden rounded-3xl border border-orange-400/10 bg-[#150809] p-3.5 text-left shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] transition-shadow duration-300 hover:border-orange-400/30 hover:shadow-[0_18px_40px_-12px_rgba(230,32,46,0.35)] sm:p-4"
      >
        {item.special && (
          <span className="animate-pulse-glow absolute left-3 top-3 z-20 rounded-full bg-gradient-to-r from-[#ffb347] via-[#ff540f] to-[#e6202e] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#2b0500] sm:text-[10px]">
            ✦ Special
          </span>
        )}

        <div
          className="relative mx-auto aspect-square w-full max-w-[220px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* flame glow blob — follows the pointer */}
          <motion.div
            className="animate-flame absolute inset-3 rounded-full blur-xl"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([gx, gy]: string[]) =>
                  `radial-gradient(circle at ${gx} ${gy}, rgba(255,84,15,0.4), rgba(230,32,46,0.18) 55%, transparent 75%)`
              ),
            }}
          />

          <FloatingBits variant="card" />

          <motion.div
            layoutId={`plate-${item.id}`}
            className="absolute inset-[8%] overflow-hidden rounded-full border border-orange-400/15 shadow-[0_0_0_1px_rgba(255,84,15,0.1),0_20px_35px_-10px_rgba(0,0,0,0.75)]"
            style={{ transform: "translateZ(30px)" }}
          >
            <div className="animate-slow-rotate absolute inset-[-6%]">
              <DishImage
                src={item.image}
                alt={item.name}
                className="object-cover"
                sizes="(max-width: 640px) 45vw, 220px"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_55%,rgba(0,0,0,0.45)_100%)]" />
            {/* fiery rim light */}
            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_18px_rgba(255,84,15,0.22)]" />
          </motion.div>
        </div>

        <div className="mt-3 flex flex-1 flex-col gap-1.5 px-1" style={{ transform: "translateZ(18px)" }}>
          <p className="text-[10px] uppercase tracking-[0.18em] text-orange-300/60">
            {item.category}
          </p>
          <h3 className="font-display line-clamp-2 min-h-[2.6em] text-[15px] font-semibold leading-tight text-zinc-50 sm:text-base">
            {item.name}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-gradient-fire font-display text-base font-bold sm:text-lg">
              Rs. {Number(item.price ?? 0).toLocaleString("en-LK")}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-1 text-[10px] text-zinc-400">
              🕒 {item.prepTime}
            </span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
