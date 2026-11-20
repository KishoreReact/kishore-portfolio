"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiLinkedin, FiDownload } from "react-icons/fi";
import { useMousePosition } from "@/hooks/useMousePosition";
import { siteConfig } from "@/data/config";
import { BsInstagram } from "react-icons/bs";

// ── Typewriter / rotating-word effect ──────────────────────────────────────
const rotatingWords = [
  "AI Agents",
  "RAG Systems",
  "Scalable Web Apps",
  "Real-time Platforms",
];

function RotatingTypewriter() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing">("typing");

  useEffect(() => {
    const word = rotatingWords[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setPhase("pause"), 1800);
      }
    } else if (phase === "pause") {
      timeout = setTimeout(() => setPhase("erasing"), 400);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setWordIndex((i) => (i + 1) % rotatingWords.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, wordIndex]);

  return (
    <span className="inline-block min-w-[2ch]">
      <span className="gradient-text font-bold">{displayed}</span>
      <span className="animate-pulse text-cyber-blue">|</span>
    </span>
  );
}

// ── Real stat card with count-up ────────────────────────────────────────────
function StatCard({
  value,
  suffix,
  label,
  mouseX,
  mouseY,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  mouseX: number;
  mouseY: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);
  const rotateX = mouseY * -8;
  const rotateY = mouseX * 8;

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, value);
      setCount(Math.round(current));
      if (current >= value) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

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
      <div className="text-2xl font-bold gradient-text">
        {count}{suffix}
      </div>
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

  const stats = [
    { value: siteConfig.yearsExperience, suffix: "+", label: "Years Exp." },
    { value: siteConfig.projectsCompleted, suffix: "+", label: "Projects" },
    { value: siteConfig.aiPlatforms, suffix: "", label: "AI Platforms" },
    { value: siteConfig.technologiesCount, suffix: "+", label: "Technologies" },
  ];

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

          {/* Typewriter tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="text-ghost-white/50 text-base leading-relaxed max-w-lg"
          >
            {siteConfig.tagline}
          </motion.p>

          {/* Rotating keywords */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            className="text-sm text-ghost-white/40 font-mono"
          >
            <RotatingTypewriter />
          </motion.div>

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
            <motion.a
              href={siteConfig.resumeUrl}
              download
              id="hero-cta-resume"
              className="px-7 py-3 font-semibold text-ghost-white rounded-xl glass gradient-border text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <FiDownload size={16} /> Resume
            </motion.a>
            <motion.a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-linkedin"
              className="px-7 py-3 font-semibold text-ghost-white rounded-xl glass gradient-border text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <FiLinkedin size={16} /> LinkedIn
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
        <div className="hidden lg:grid grid-cols-2 gap-4 items-start">
          {stats.map((s, i) => (
            <StatCard
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              mouseX={normalizedX}
              mouseY={normalizedY}
              delay={i * 0.1}
            />
          ))}
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
