"use client";

import { siteConfig } from "@/data/config";
import { motion } from "framer-motion";

export default function TechMarquee() {
  // Duplicate for seamless loop
  const items = [...siteConfig.techMarquee, ...siteConfig.techMarquee];

  return (
    <div className="relative py-8 overflow-hidden border-y border-border-glass bg-deep-space/40">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-obsidian to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-obsidian to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-8 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {items.map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-border-glass whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue/60" />
            <span className="text-xs font-mono font-medium text-ghost-white/40 tracking-wide">
              {tech}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
