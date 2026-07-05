"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiGithub, FiLinkedin } from "react-icons/fi";
import { useMousePosition } from "@/hooks/useMousePosition";
import { siteConfig } from "@/data/config";
import { BsInstagram } from "react-icons/bs";

// ── Glassmorphism stat card ──────────────────────────────────────────────────
function StatCard({
  value,
  label,
  mouseX,
  mouseY,
  delay = 0,
}: {
  value: string;
  label: string;
  mouseX: number;
  mouseY: number;
  delay?: number;
}) {
  const rotateX = mouseY * -8;
  const rotateY = mouseX * 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2 + delay, duration: 0.5, ease: "easeOut" }}
      style={{
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="glass gradient-border rounded-2xl px-6 py-4 text-center min-w-[90px] float"
    >
      <div className="text-2xl font-bold gradient-text">{value}</div>
      <div className="text-xs text-ghost-white/40 mt-1 font-medium tracking-wide">{label}</div>
    </motion.div>
  );
}

// ── Staggered word reveal ────────────────────────────────────────────────────
function AnimatedTitle({ text }: { text: string }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.12, duration: 0.5, ease: "easeOut" }}
          className="block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

export default function Hero() {
  const { normalizedX, normalizedY } = useMousePosition();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Ambient gradient background ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-dark-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-violet/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-blue/8 rounded-full blur-[120px] pointer-events-none" />


      {/* ── Content ──────────────────────────────────────────────────────── */}
      <motion.div
        style={{ translateY }}
        className="relative z-10 container-max w-full px-6 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Left: Text */}
        <div className="space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 glass border border-cyber-blue/20 rounded-full text-xs font-semibold text-cyber-blue tracking-widest uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
            Available for work
          </motion.div>

          {/* Name */}
          <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="block text-ghost-white"
            >
              I&apos;m
            </motion.span>
            <span className="block gradient-text text-glow-blue">
              <AnimatedTitle text={siteConfig.name} />
            </span>
          </div>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-xl sm:text-2xl font-semibold text-ghost-white/70"
          >
            {siteConfig.title}
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="text-ghost-white/50 text-base leading-relaxed max-w-lg"
          >
            {siteConfig.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              onClick={scrollToAbout}
              id="hero-cta-work"
              className="px-7 py-3 font-semibold text-obsidian rounded-xl bg-gradient-to-r from-cyber-blue to-neon-violet glow-blue text-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(0,240,255,0.45)" }}
              whileTap={{ scale: 0.96 }}
            >
              View My Work
            </motion.button>
            {/* <motion.a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-github"
              className="px-7 py-3 font-semibold text-ghost-white rounded-xl glass gradient-border text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <FiGithub size={16} /> GitHub
            </motion.a> */}
            <motion.a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-linkedin"
              className="px-7 py-3 font-semibold text-ghost-white rounded-xl glass gradient-border text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <FiLinkedin size={16} /> Linkedin
            </motion.a>
          </motion.div>

          {/* Social row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.5 }}
            className="flex items-center gap-4 pt-2"
          >
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ghost-white/30 hover:text-cyber-blue transition-colors"
            >
              <BsInstagram size={20} />
            </a>
            <div className="h-px max-w-[60px] bg-ghost-white/10" />
            <span className="text-ghost-white/25 text-xs">
              {siteConfig.location} | {siteConfig.phone}
            </span>
          </motion.div>
        </div>

        {/* Right: Stat cards */}
        <div className="hidden lg:flex flex-col items-end gap-4">
          <StatCard
            value={`${siteConfig.yearsExperience}+`}
            label="Years Exp."
            mouseX={normalizedX}
            mouseY={normalizedY}
            delay={0}
          />
          <StatCard
            value={`${siteConfig.projectsCompleted}+`}
            label="Projects"
            mouseX={normalizedX}
            mouseY={normalizedY}
            delay={0.1}
          />
          <StatCard
            value="∞"
            label="Passion"
            mouseX={normalizedX}
            mouseY={normalizedY}
            delay={0.2}
          />
        </div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-ghost-white/30 hover:text-cyber-blue transition-colors"
        aria-label="Scroll to About"
      >
        <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiArrowDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  );
}
