"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/config";
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, SiCss,
  SiRedux, SiNodedotjs, SiPython, SiFastapi, SiPostgresql, SiMysql, SiRedis,
  SiMongodb, SiElasticsearch, SiDocker, SiVercel, SiGithub, SiLinux,
  SiReactos,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { FiCpu, FiZap, FiDatabase, FiCode, FiServer, FiRadio } from "react-icons/fi";
import { TbBrandFramerMotion } from "react-icons/tb";

type SkillCategory = "All" | "Frontend" | "Backend" | "Database" | "AI & ML" | "Real-time" | "DevOps";

const categories: SkillCategory[] = ["All", "Frontend", "Backend", "Database", "AI & ML", "Real-time", "DevOps"];

const categoryIcons: Record<SkillCategory, React.ElementType> = {
  All: FiZap,
  Frontend: FiCode,
  Backend: FiServer,
  Database: FiDatabase,
  "AI & ML": FiCpu,
  "Real-time": FiRadio,
  DevOps: FiZap,
};

const categoryColors: Record<SkillCategory, string> = {
  All: "text-cyber-blue",
  Frontend: "text-cyan-400",
  Backend: "text-emerald-400",
  Database: "text-violet-400",
  "AI & ML": "text-pink-400",
  "Real-time": "text-orange-400",
  DevOps: "text-yellow-400",
};

type IconMap = Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>>;

const skillIcons: IconMap = {
  "React.js": SiReact,
  "Next.js 14": SiNextdotjs,
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "Tailwind CSS": SiTailwindcss,
  "SCSS / CSS": SiCss as React.ComponentType<{ size?: number; color?: string; className?: string }>,
  "Redux / Zustand": SiRedux,
  "TanStack Query": SiReactos,
  "React Native": SiReact,
  "Node.js": SiNodedotjs,
  "Python": SiPython,
  "FastAPI": SiFastapi,
  "PostgreSQL": SiPostgresql,
  "MySQL": SiMysql,
  "Redis": SiRedis,
  "MongoDB": SiMongodb,
  "Elasticsearch": SiElasticsearch,
  "Docker": SiDocker,
  "Vercel": SiVercel,
  "GitLab CI / GitHub": SiGithub,
  "Linux / Bash": SiLinux,
};

const iconColors: Record<string, string> = {
  "React.js": "#61DAFB",
  "Next.js 14": "#ffffff",
  "TypeScript": "#3178C6",
  "JavaScript": "#F7DF1E",
  "Tailwind CSS": "#06B6D4",
  "Python": "#3776AB",
  "FastAPI": "#009688",
  "Node.js": "#68A063",
  "PostgreSQL": "#336791",
  "MySQL": "#4479A1",
  "Redis": "#DC382D",
  "MongoDB": "#47A248",
  "Elasticsearch": "#FEC514",
  "Docker": "#2496ED",
  "AWS": "#FF9900",
  "Vercel": "#ffffff",
  "Linux / Bash": "#FCC624",
};

interface Skill {
  name: string;
  category: string;
  tooltip: string;
}

function SkillChip({ skill, index }: { skill: Skill; index: number }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = skillIcons[skill.name];
  const color = iconColors[skill.name] || "#00F0FF";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative group"
    >
      <motion.div
        whileHover={{ y: -3, scale: 1.05 }}
        className="flex items-center gap-2.5 px-3.5 py-2.5 glass gradient-border rounded-xl cursor-default hover:shadow-card-hover transition-all duration-200"
      >
        {Icon && <Icon size={15} color={color} />}
        <span className="text-sm font-medium text-ghost-white/75 group-hover:text-ghost-white transition-colors font-mono">
          {skill.name}
        </span>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-max max-w-[200px] px-3 py-2 glass border border-cyber-blue/20 rounded-xl text-xs text-ghost-white/70 leading-snug pointer-events-none"
            style={{ boxShadow: "0 0 20px rgba(0,240,255,0.1)" }}
          >
            <div className="text-cyber-blue font-semibold text-[10px] mb-0.5 uppercase tracking-wide">What I built with it</div>
            {skill.tooltip}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-obsidian border-r border-b border-cyber-blue/20" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("All");

  const filtered = siteConfig.skills.filter(
    (s) => activeCategory === "All" || s.category === activeCategory
  );

  return (
    <section id="skills" className="section-padding bg-deep-space/50 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-neon-violet/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-max px-6 relative">
        <SectionHeading
          label="Tech Stack"
          title="My"
          highlight="Skills"
          description="From frontend pixels to AI pipelines — the full toolkit. Hover any chip to see what I built with it."
        />

        {/* Category filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyber-blue to-neon-violet text-obsidian font-semibold"
                    : "glass border border-border-glass text-ghost-white/50 hover:text-ghost-white hover:border-ghost-white/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={13} />
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skill chips grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {filtered.map((skill, index) => (
              <SkillChip key={skill.name} skill={skill as Skill} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Count badge */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-ghost-white/25 mt-8"
        >
          {filtered.length} {activeCategory === "All" ? "technologies" : `${activeCategory} tools`} · hover for context
        </motion.p>
      </div>
    </section>
  );
}
