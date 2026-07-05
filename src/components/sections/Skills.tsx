"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/config";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiMysql,
  SiThreedotjs,
  SiTailwindcss,
  SiDocker,
  SiGraphql,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const skillIcons: Record<string, React.ComponentType<{ className?: string; size?: number; color?: string }>> = {
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "TypeScript": SiTypescript,
  "Node.js": SiNodedotjs,
  "Python": SiPython,
  "PostgreSQL": SiPostgresql,
  "MySQL": SiMysql,
  "Three.js": SiThreedotjs,
  "CSS/Tailwind": SiTailwindcss,
  "Docker": SiDocker,
  "AWS": FaAws,
  "GraphQL": SiGraphql,
};

const categories = ["All", "Frontend", "Backend", "Database", "Creative", "DevOps"] as const;

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = siteConfig.skills.filter(
    (s) => activeCategory === "All" || s.category === activeCategory
  );

  return (
    <section id="skills" className="section-padding bg-deep-space/50 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />

      <div className="container-max px-6">
        <SectionHeading
          label="Tech Stack"
          title="My"
          highlight="Skills"
          description="Technologies and tools I use to build full-stack solutions."
        />

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              id={`skill-filter-${cat.toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${activeCategory === cat
                  ? "bg-gradient-to-r from-cyber-blue to-neon-violet text-obsidian font-semibold"
                  : "glass border border-border-glass text-ghost-white/50 hover:text-ghost-white hover:border-ghost-white/20"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill, index) => (
            <SkillBar key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = skillIcons[skill.name];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass gradient-border rounded-xl p-4 group cursor-default hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {IconComponent && (
            <div className="w-8 h-8 rounded-lg glass border border-border-glass flex items-center justify-center text-ghost-white/70 group-hover:text-cyber-blue group-hover:border-cyber-blue/20 transition-all duration-300">
              <IconComponent size={16} />
            </div>
          )}
          <span className="font-semibold text-ghost-white text-sm group-hover:text-cyber-blue transition-colors">
            {skill.name}
          </span>
        </div>
        <span className="text-xs font-bold gradient-text">{skill.level}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-ghost-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.06, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-700 via-sky-600 to-violet-700 relative"
        >
          {/* Glowing tip */}
          <motion.div
            animate={hovered ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyber-blue glow-blue"
          />
        </motion.div>
      </div>

      {/* Category tag */}
      <div className="mt-2 flex justify-end">
        <span className="text-[10px] text-ghost-white/25 font-medium tracking-wide">
          {skill.category}
        </span>
      </div>
    </motion.div>
  );
}
