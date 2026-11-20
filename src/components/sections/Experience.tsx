"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiBriefcase, FiCalendar, FiZap } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/config";

type ExperienceItem = typeof siteConfig.experience[number];

function TimelineCard({ item, index }: { item: ExperienceItem; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <div className={`relative flex items-start gap-6 ${isLeft ? "flex-row" : "flex-row-reverse"} mb-12`}>
      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 glass gradient-border rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 group"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {item.type === "current" && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
                  Current
                </span>
              )}
            </div>
            <h3 className="font-bold text-ghost-white text-base group-hover:text-cyber-blue transition-colors">
              {item.role}
            </h3>
            <p className="text-neon-violet/80 text-sm font-semibold mt-0.5">{item.company}</p>
          </div>
          <div className="flex items-center gap-1.5 text-ghost-white/30 text-xs whitespace-nowrap mt-1">
            <FiCalendar size={12} />
            <span>{item.period}</span>
          </div>
        </div>

        {/* Impact statement */}
        <div className="flex items-start gap-2 mb-3 p-3 glass rounded-xl border border-cyber-blue/10">
          <FiZap className="text-cyber-blue mt-0.5 flex-shrink-0" size={13} />
          <p className="text-cyber-blue/80 text-xs font-medium leading-relaxed">{item.impact}</p>
        </div>

        {/* Description */}
        <p className="text-ghost-white/50 text-sm leading-relaxed mb-4">{item.description}</p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5">
          {item.tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-[11px] font-mono font-medium glass border border-border-glass text-ghost-white/50 rounded-full hover:border-cyber-blue/30 hover:text-cyber-blue transition-colors"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Center dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="hidden lg:flex flex-col items-center flex-shrink-0"
      >
        <div className="w-12 h-12 rounded-full glass gradient-border flex items-center justify-center glow-blue">
          <FiBriefcase className="text-cyber-blue" size={18} />
        </div>
      </motion.div>

      {/* Spacer for the other side */}
      <div className="flex-1 hidden lg:block" />
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" ref={sectionRef} className="section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />

      <div className="container-max px-6">
        <SectionHeading
          label="Work History"
          title="My"
          highlight="Experience"
          description="5+ years building production-grade products across AI, edtech, and enterprise software."
        />

        {/* Timeline wrapper */}
        <div className="relative">
          {/* Animated vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 w-px h-full bg-border-glass">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-cyber-blue to-neon-violet"
            />
          </div>

          <div className="space-y-0">
            {siteConfig.experience.map((item, index) => (
              <TimelineCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
