"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FiArrowDown, FiLinkedin, FiDownload, FiSend, FiZap, FiCheckCircle } from "react-icons/fi";
import { SiGooglegemini } from "react-icons/si";
import { useMousePosition } from "@/hooks/useMousePosition";
import { siteConfig } from "@/data/config";
import { BsInstagram, BsStars } from "react-icons/bs";

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

// ── Reliable Count-Up Stat Pill ─────────────────────────────────────────────
function StatPill({
  value,
  suffix = "",
  label,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  // Initialize with real value so it NEVER renders as 0 or empty on SSR / hydration
  const [count, setCount] = useState<number>(value);

  useEffect(() => {
    let current = 0;
    const duration = 1200;
    const steps = 30;
    const increment = value / steps;
    const timer = setInterval(() => {
      current = Math.min(current + increment, value);
      setCount(Math.round(current));
      if (current >= value) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + delay, duration: 0.45 }}
      whileHover={{ y: -2, scale: 1.03 }}
      className="glass gradient-border rounded-xl px-3.5 py-2.5 text-center flex-1 min-w-[100px] shadow-sm hover:border-cyber-blue/30 transition-all cursor-default"
    >
      <div className="text-xl sm:text-2xl font-bold gradient-text tracking-tight font-mono">
        {count}{suffix}
      </div>
      <div className="text-[11px] text-ghost-white/50 mt-0.5 font-medium tracking-wide leading-tight">
        {label}
      </div>
    </motion.div>
  );
}

// ── Interactive Hero Gemini AI Chat Card ────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const HERO_SUGGESTIONS = [
  "Featured AI Projects",
  "Core Tech Stack",
  "Role at Articence",
];

function HeroAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm Kishore's AI assistant powered by Gemini. Ask me about his AI agent architecture, RAG systems, or full-stack production apps!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText ?? input.trim();
    if (!textToSend || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I couldn't process that response. Feel free to connect directly with Kishore!",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network glitch. You can also reach Kishore directly via the Contact section below!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
      className="relative w-full max-w-lg lg:max-w-none glass gradient-border rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-2xl overflow-hidden border border-cyber-blue/20"
      style={{
        boxShadow: "0 20px 60px -15px rgba(0, 240, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-20 -right-20 w-52 h-52 bg-neon-violet/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-cyber-blue/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-border-glass">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyber-blue/20 via-neon-violet/30 to-cyber-blue/40 border border-cyber-blue/40 flex items-center justify-center glow-blue">
            <SiGooglegemini className="text-cyber-blue text-xl animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-obsidian" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-bold text-ghost-white tracking-wide">
                Ask Kishore&apos;s AI
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 uppercase tracking-wider flex items-center gap-1">
                <BsStars size={10} /> Live
              </span>
            </div>
            <p className="text-[11px] text-ghost-white/40 flex items-center gap-1 font-mono">
              Powered by <span className="text-cyber-blue/80 font-medium">Gemini</span> · Grounded in Resume
            </p>
          </div>
        </div>

        {/* Animated neural equalizer */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 glass rounded-full border border-border-glass">
          {[0.4, 0.9, 0.6, 1, 0.5].map((h, i) => (
            <motion.span
              key={i}
              className="w-0.5 bg-gradient-to-t from-cyber-blue to-neon-violet rounded-full"
              animate={{ height: ["4px", `${h * 16}px`, "4px"] }}
              transition={{ duration: 1 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <span className="text-[10px] text-ghost-white/40 ml-1 font-mono">Online</span>
        </div>
      </div>

      {/* Chat messages viewport */}
      <div className="relative z-10 my-4 h-[210px] sm:h-[230px] overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-cyber-blue to-neon-violet text-obsidian font-medium shadow-md"
                  : "glass border border-border-glass text-ghost-white/85 bg-white/[0.02]"
              }`}
            >
              {msg.content.split("\n").map((line, idx) => (
                <span key={idx} className="block mb-0.5 last:mb-0">
                  {line}
                </span>
              ))}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass border border-border-glass px-4 py-2.5 rounded-2xl flex items-center gap-1.5">
              <span className="text-xs text-cyber-blue font-mono mr-1">Gemini Thinking</span>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyber-blue"
                  animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompt chips */}
      <div className="relative z-10 flex flex-wrap gap-1.5 mb-3.5">
        {HERO_SUGGESTIONS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSend(chip)}
            disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-lg glass border border-border-glass hover:border-cyber-blue/40 hover:text-cyber-blue text-ghost-white/60 transition-all flex items-center gap-1 font-mono disabled:opacity-50"
          >
            <span className="text-cyber-blue text-[10px]">✦</span> {chip}
          </button>
        ))}
      </div>

      {/* Input container */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative z-10 flex items-center gap-2 p-1.5 glass rounded-2xl border border-border-glass focus-within:border-cyber-blue/50 transition-colors bg-obsidian/40"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Kishore..."
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-ghost-white placeholder:text-ghost-white/30 outline-none"
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-xl bg-gradient-to-r from-cyber-blue to-neon-violet flex items-center justify-center text-obsidian disabled:opacity-30 disabled:pointer-events-none transition-opacity"
          aria-label="Send query"
        >
          <FiSend size={13} className="translate-x-[-0.5px] translate-y-[0.5px]" />
        </motion.button>
      </form>
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
  const translateY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const statItems = [
    { value: siteConfig.yearsExperience, suffix: "+", label: "Years Exp." },
    { value: siteConfig.projectsCompleted, suffix: "+", label: "Projects Shipped" },
    { value: siteConfig.aiPlatforms, suffix: "", label: "AI Platforms" },
    { value: siteConfig.technologiesCount, suffix: "+", label: "Tech Stack" },
  ];

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden pt-20 pb-16 lg:py-0"
    >
      {/* ── Ambient gradient background ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-dark-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-violet/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-blue/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Content Grid ──────────────────────────────────────────────────── */}
      <motion.div
        style={{ translateY }}
        className="relative z-10 container-max w-full px-6 pt-12 lg:pt-24 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
      >
        {/* Left Column: Bio & Intro (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 glass border border-cyber-blue/25 rounded-full text-xs font-semibold text-cyber-blue tracking-widest uppercase shadow-sm"
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
            className="text-xl sm:text-2xl font-semibold text-ghost-white/80"
          >
            {siteConfig.title}
          </motion.div>

          {/* Typewriter tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="text-ghost-white/60 text-base sm:text-lg leading-relaxed max-w-xl"
          >
            {siteConfig.tagline}
          </motion.p>

          {/* Rotating keywords */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            className="text-sm sm:text-base text-ghost-white/50 font-mono"
          >
            <RotatingTypewriter />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <motion.button
              onClick={scrollToAbout}
              id="hero-cta-work"
              className="px-7 py-3.5 font-semibold text-obsidian rounded-xl bg-gradient-to-r from-cyber-blue to-neon-violet glow-blue text-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(0,240,255,0.45)" }}
              whileTap={{ scale: 0.96 }}
            >
              View My Work
            </motion.button>
            <motion.a
              href={siteConfig.resumeUrl}
              download
              id="hero-cta-resume"
              className="px-7 py-3.5 font-semibold text-ghost-white rounded-xl glass gradient-border text-sm flex items-center gap-2 hover:text-cyber-blue transition-colors"
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
              className="px-7 py-3.5 font-semibold text-ghost-white rounded-xl glass gradient-border text-sm flex items-center gap-2 hover:text-cyber-blue transition-colors"
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
              className="text-ghost-white/40 hover:text-cyber-blue transition-colors"
              aria-label="Instagram"
            >
              <BsInstagram size={20} />
            </a>
            <div className="h-px max-w-[60px] bg-ghost-white/10" />
            <span className="text-ghost-white/40 text-xs font-mono">
              {siteConfig.location} | {siteConfig.phone}
            </span>
          </motion.div>
        </div>

        {/* Right Column: Hero AI Chat + Verified Stat Metrics (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-4 items-center lg:items-stretch">
          {/* Key Metric Stat Cards — guaranteed non-zero values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full">
            {statItems.map((s, idx) => (
              <StatPill
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                delay={idx * 0.08}
              />
            ))}
          </div>

          {/* Live Hero Gemini AI Chat Widget */}
          <HeroAiChat />
        </div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-ghost-white/30 hover:text-cyber-blue transition-colors cursor-pointer"
        aria-label="Scroll to About"
      >
        <span className="text-[11px] tracking-widest uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
