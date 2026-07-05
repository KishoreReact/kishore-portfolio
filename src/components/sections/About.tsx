"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiCode, FiZap, FiStar } from "react-icons/fi";
import { SiReact, SiNodedotjs, SiTypescript, SiNextdotjs } from "react-icons/si";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/config";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  colSpan?: "1" | "2" | "3";
}

function BentoCard({ children, className = "", delay = 0, colSpan = "1" }: BentoCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -6, y: dx * 6 });
  };

  const colClass =
    colSpan === "2" ? "md:col-span-2" : colSpan === "3" ? "md:col-span-3" : "";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        transition: "transform 0.2s ease-out, box-shadow 0.3s ease",
      }}
      className={`glass gradient-border rounded-2xl p-6 cursor-default hover:shadow-card-hover group relative overflow-hidden ${colClass} ${className}`}
    >
      {/* Shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -inset-full top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-0 group-hover:translate-x-[250%] transition-transform duration-1000" />
      </div>
      {children}
    </motion.div>
  );
}

function CounterBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold gradient-text">{value}</div>
      <div className="text-xs text-ghost-white/40 mt-1 tracking-wide">{label}</div>
    </div>
  );
}

export default function About() {
  const techStack = [
    { icon: SiReact, name: "React", color: "#61DAFB" },
    { icon: SiNextdotjs, name: "Next.js", color: "#ffffff" },
    { icon: SiNodedotjs, name: "Node.js", color: "#68A063" },
    { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
  ];

  return (
    <section id="about" className="section-padding bg-deep-space/50 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />

      <div className="container-max px-6">
        <SectionHeading
          label="Who I Am"
          title="About"
          highlight="Me"
          description="A passionate developer who transforms ideas into beautiful, performant digital experiences."
        />

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">

          {/* Card 1 — Bio (wide) */}
          <BentoCard colSpan="2" delay={0.05}>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl glass border border-cyber-blue/20 flex items-center justify-center">
                    <FiCode className="text-cyber-blue" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ghost-white">My Story</h3>
                    <p className="text-xs text-ghost-white/30">Full Stack Developer</p>
                  </div>
                </div>
                <p className="text-ghost-white/60 text-sm leading-relaxed">
                  {siteConfig.bio}
                </p>
                <p className="text-ghost-white/50 text-sm leading-relaxed mt-3">
                  Thanks to my creativity, attention to detail, and determination, I realized I have a great talent for developing web applications. Fascinated by the ever-evolving world of technologies, I&apos;m building incredible projects—professionally and personally.
                </p>
              </div>
              <div className="w-40 h-40 md:w-44 md:h-44 relative rounded-2xl overflow-hidden border border-cyber-blue/20 flex-shrink-0 group/img">
                <img
                  src="/images/Kishore.jpg"
                  alt="Kishore C"
                  className="w-full h-full object-cover object-center filter saturate-75 hover:saturate-100 hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </BentoCard>

          {/* Card 2 — Location */}
          <BentoCard delay={0.1} className="!p-0 flex flex-col justify-between overflow-hidden">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.location || "India")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/map flex flex-col h-full w-full justify-between p-6 cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FiMapPin className="text-neon-violet group-hover/map:scale-110 transition-transform" size={18} />
                  <h3 className="font-semibold text-ghost-white text-sm">Location</h3>
                </div>

                {/* Interactive Embed Map View */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden glass border border-border-glass isolation-isolate">
                  <iframe
                    title="Google Map Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.location || "India")}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0 opacity-60 group-hover/map:opacity-80 transition-opacity grayscale invert contrast-125 pointer-events-none"
                    allowFullScreen
                    loading="lazy"
                  />
                  {/* Animated map pulse overlaying the center */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <span className="absolute w-6 h-6 rounded-full bg-cyber-blue/30 animate-ping" />
                    <span className="relative w-3 h-3 rounded-full bg-cyber-blue glow-blue" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-ghost-white/50 text-sm font-medium group-hover/map:text-cyber-blue transition-colors">
                  {siteConfig.location}
                </p>
                <p className="text-ghost-white/25 text-xs flex items-center gap-1 mt-0.5">
                  India 🇮🇳 <span className="opacity-0 group-hover/map:opacity-100 transition-opacity text-[10px] text-cyber-blue ml-1">→ View on Maps</span>
                </p>
              </div>
            </a>
          </BentoCard>

          {/* Card 3 — Stats */}
          <BentoCard delay={0.15}>
            <div className="flex items-center gap-2 mb-5">
              <FiStar className="text-cyber-blue" size={18} />
              <h3 className="font-semibold text-ghost-white text-sm">By The Numbers</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CounterBadge value={`${siteConfig.yearsExperience}+`} label="Years Exp." />
              <CounterBadge value={`${siteConfig.projectsCompleted}+`} label="Projects" />
              <CounterBadge value="10+" label="Technologies" />
              <CounterBadge value="100%" label="Dedication" />
            </div>
          </BentoCard>

          {/* Card 4 — Tech Stack */}
          <BentoCard delay={0.2}>
            <div className="flex items-center gap-2 mb-4">
              <FiZap className="text-neon-violet" size={18} />
              <h3 className="font-semibold text-ghost-white text-sm">Core Stack</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {techStack.map(({ icon: Icon, name, color }) => (
                <motion.div
                  key={name}
                  className="flex items-center gap-2 px-3 py-2.5 glass rounded-xl border border-border-glass hover:border-cyber-blue/20 transition-all cursor-default"
                  whileHover={{ scale: 1.04 }}
                >
                  <Icon size={16} color={color} />
                  <span className="text-xs font-medium text-ghost-white/70">{name}</span>
                </motion.div>
              ))}
            </div>
          </BentoCard>

          {/* Card 5 — Status */}
          <BentoCard delay={0.25} colSpan="1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ghost-white text-sm">Currently Building</h3>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Active
              </span>
            </div>
            <div className="space-y-3">
              <div className="glass border border-border-glass rounded-xl p-3">
                <p className="text-xs text-ghost-white/60 font-medium">AI agents and workflow</p>
                <p className="text-[11px] text-ghost-white/30 mt-0.5">Python + Next.js</p>
              </div>
              <div className="glass border border-border-glass rounded-xl p-3">
                <p className="text-xs text-ghost-white/60 font-medium">AI-Powered Apps</p>
                <p className="text-[11px] text-ghost-white/30 mt-0.5">Python + React</p>
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
