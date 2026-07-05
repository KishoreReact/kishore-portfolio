"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  highlight,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "mb-16",
        isCenter ? "text-center" : "text-left",
        className
      )}
    >
      {label && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-cyber-blue glass border border-cyber-blue/20 rounded-full"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
          {label}
        </motion.span>
      )}

      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
        {highlight ? (
          <>
            {title}{" "}
            <span className="gradient-text">{highlight}</span>
          </>
        ) : (
          title
        )}
      </h2>

      {/* Glowing underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className={cn(
          "mt-4 h-px bg-gradient-to-r from-cyber-blue to-neon-violet origin-left",
          isCenter ? "mx-auto w-24" : "w-24"
        )}
        style={{ filter: "drop-shadow(0 0 6px rgba(0,240,255,0.5))" }}
      />

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn(
            "mt-6 max-w-2xl text-ghost-white/50 text-lg leading-relaxed",
            isCenter && "mx-auto"
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
