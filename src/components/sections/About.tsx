"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiCpu, FiArrowUpRight, FiLayers } from "react-icons/fi";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/config";

// ── Bento Card Wrapper ──────────────────────────────────────────────────────
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function BentoCard({ children, className = "", delay = 0 }: BentoCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -4, y: dx * 4 });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        transition: "transform 0.2s ease-out, box-shadow 0.3s ease",
      }}
      className={`glass gradient-border rounded-3xl p-5 sm:p-6 cursor-default hover:shadow-card-hover group relative overflow-hidden ${className}`}
    >
      {/* Subtle Shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -inset-full top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-0 group-hover:translate-x-[250%] transition-transform duration-1000" />
      </div>
      {children}
    </motion.div>
  );
}

// ── Mindset Carousel Data ───────────────────────────────────────────────────
interface MindsetSlide {
  id: string;
  badge: "RUNNING" | "COOKING" | "CRICKET";
  title: string;
  tag: string;
  image: string;
  stats: { label: string; value: string }[];
}

const MINDSET_SLIDES: MindsetSlide[] = [
  {
    id: "running",
    badge: "RUNNING",
    title: "Cracovia Half Marathon",
    tag: "STRAVA",
    image: "/images/mindset/running.jpg",
    stats: [
      { label: "Distance", value: "21.50 km" },
      { label: "Time", value: "2h 8m" },
    ],
  },
  {
    id: "cooking",
    badge: "COOKING",
    title: "Artisan Culinary",
    tag: "GOURMET",
    image: "/images/mindset/cooking.jpg",
    stats: [
      { label: "Style", value: "Fresh Prep" },
      { label: "Focus", value: "Balance" },
    ],
  },
  {
    id: "cricket",
    badge: "CRICKET",
    title: "Match Day Drive",
    tag: "LEAGUE",
    image: "/images/mindset/cricket.jpg",
    stats: [
      { label: "Role", value: "All-Rounder" },
      { label: "Focus", value: "Strategy" },
    ],
  },
];

function MindsetCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-switch carousel every 3 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MINDSET_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevIndex = (index - 1 + MINDSET_SLIDES.length) % MINDSET_SLIDES.length;
  const nextIndex = (index + 1) % MINDSET_SLIDES.length;

  return (
    <div
      className="flex flex-col justify-between h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-ghost-white tracking-tight">
            Mindset
          </h3>
          <span className="text-[10px] font-mono text-neon-violet border border-neon-violet/30 px-2 py-0.5 rounded-full glass bg-neon-violet/10">
            3s Auto-Play
          </span>
        </div>
        <div className="w-10 h-1 bg-neon-violet rounded-full mt-2 mb-3" />
        <p className="text-xs sm:text-sm text-ghost-white/60 leading-relaxed">
          <strong className="text-ghost-white font-semibold">Building more than software.</strong>{" "}
          My passions provide the <strong className="text-ghost-white font-semibold">discipline and focus</strong> I need to grow.
        </p>
      </div>

      {/* ── 3D Multi-Card Stacked Coverflow Track ── */}
      <div className="relative my-4 flex items-center justify-center h-[230px] sm:h-[250px] overflow-hidden">
        {MINDSET_SLIDES.map((slide, i) => {
          let offset = i - index;
          if (offset < -1) offset += MINDSET_SLIDES.length;
          if (offset > 1) offset -= MINDSET_SLIDES.length;

          const isCenter = offset === 0;
          const isLeft = offset === -1 || offset === 2;
          const isRight = offset === 1 || offset === -2;

          let x = "0%";
          let scale = 1;
          let zIndex = 20;
          let opacity = 1;
          let rotate = 0;

          if (isCenter) {
            x = "0%";
            scale = 1;
            zIndex = 25;
            opacity = 1;
            rotate = 0;
          } else if (isLeft) {
            x = "-46%";
            scale = 0.82;
            zIndex = 10;
            opacity = 0.55;
            rotate = -5;
          } else if (isRight) {
            x = "46%";
            scale = 0.82;
            zIndex = 10;
            opacity = 0.55;
            rotate = 5;
          } else {
            opacity = 0;
            scale = 0.7;
          }

          return (
            <motion.div
              key={slide.id}
              onClick={() => {
                if (isLeft) setIndex(prevIndex);
                if (isRight) setIndex(nextIndex);
              }}
              animate={{
                x,
                scale,
                zIndex,
                opacity,
                rotate,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 26,
              }}
              className={`absolute w-44 sm:w-48 h-56 sm:h-60 rounded-2xl overflow-hidden border cursor-pointer select-none transition-shadow duration-300 ${
                isCenter
                  ? "border-neon-violet/70 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                  : "border-white/20 hover:opacity-85 shadow-lg"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={isCenter}
                className="object-cover"
                sizes="200px"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${
                  isCenter
                    ? "from-black/95 via-black/40 to-black/25"
                    : "from-black/90 via-black/60 to-black/40"
                }`}
              />

              {/* Tag Row */}
              <div className="relative z-10 flex items-center justify-between p-3">
                <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-obsidian/85 backdrop-blur-md border border-white/10 text-ghost-white/90">
                  {slide.tag}
                </span>
                {isCenter && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
              </div>

              {/* Stats & Badge Overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 space-y-1">
                {isCenter && (
                  <>
                    <p className="text-[10px] sm:text-[11px] font-bold text-ghost-white tracking-tight leading-tight line-clamp-1">
                      {slide.title}
                    </p>
                    <div className="grid grid-cols-2 gap-1 py-1 px-1.5 rounded-lg bg-black/65 backdrop-blur-sm border border-white/10 text-[9px] font-mono">
                      {slide.stats.map((s) => (
                        <div key={s.label}>
                          <span className="text-ghost-white/40 block text-[8px] uppercase">{s.label}</span>
                          <span className="text-ghost-white font-semibold">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="text-center font-extrabold text-xs sm:text-sm font-mono tracking-wider text-ghost-white uppercase py-1 px-2 rounded-lg bg-neon-violet/40 border border-neon-violet/50 backdrop-blur-md shadow-sm">
                  {slide.badge}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center items-center gap-1.5 mb-1.5">
        {MINDSET_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-6 bg-gradient-to-r from-neon-violet to-cyber-blue shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                : "w-1.5 bg-ghost-white/20 hover:bg-ghost-white/50"
            }`}
          />
        ))}
      </div>

      {/* Footer Quote */}
      <p className="text-xs sm:text-sm text-ghost-white/60 leading-relaxed pt-2.5 border-t border-white/5">
        <strong className="text-ghost-white font-semibold">Mastering body and mind</strong> is my path to{" "}
        <strong className="text-ghost-white font-semibold">excellence</strong>.
      </p>
    </div>
  );
}

// ── Main About Component ────────────────────────────────────────────────────
export default function About() {
  const [hoveredExperience, setHoveredExperience] = useState<number | null>(null);

  const experienceCards = [
    {
      category: "SENIOR ROLE",
      company: "Articence Inc",
      desc: "Architected AI-powered call center platform with role-based access, WebSockets & LiveKit real-time agents.",
    },
    {
      category: "FULL STACK",
      company: "iLearningEngines",
      desc: "Built scalable enterprise e-learning platforms, assessment portals, and Node.js + PostgreSQL backend engines.",
    },
    {
      category: "PRODUCTION SHIPPED",
      company: "AI Platforms",
      desc: "Deployed autonomous B2B marketing engines, RAG vector pipelines, and production AI agent workflows.",
    },
  ];

  return (
    <section id="about" className="section-padding bg-deep-space/50 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />

      <div className="container-max px-6">
        <SectionHeading
          label="Who I Am"
          title="About"
          highlight="Me"
          description="Frontend-first engineer turned AI builder. 5+ years shipping scalable products that work beautifully at any scale."
        />

        {/* ── 3-Column Bento Grid Structure matching user reference image ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* ══════════════ ROW 1: TOP ══════════════ */}

          {/* Top-Left: Name & Title Card (matches PAWEŁ SZOSTAK card) */}
          <div className="lg:col-span-4 flex">
            <BentoCard delay={0.05} className="w-full flex flex-col justify-center items-center text-center py-8 px-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ghost-white tracking-widest uppercase text-glow-blue">
                KISHORE
                <br />
                <span className="gradient-text">C</span>
              </h2>
              <div className="w-8 h-0.5 bg-gradient-to-r from-cyber-blue to-neon-violet my-2 rounded-full" />
              <p className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-ghost-white/50 uppercase">
                AI Full Stack Developer
              </p>
            </BentoCard>
          </div>

          {/* Top-Right (spanning cols 2 & 3): Hover to Read More Milestones */}
          <div className="lg:col-span-8 flex">
            <BentoCard delay={0.1} className="w-full flex flex-col justify-between p-5 sm:p-6">
              {/* Header with pill badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-wider text-ghost-white/40 uppercase">
                  Career Milestones
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-medium glass border border-border-glass text-ghost-white/60 tracking-wider uppercase">
                  Hover to read more
                </span>
              </div>

              {/* 3 Horizontal Sub-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {experienceCards.map((item, idx) => (
                  <div
                    key={item.category}
                    onMouseEnter={() => setHoveredExperience(idx)}
                    onMouseLeave={() => setHoveredExperience(null)}
                    className={`rounded-2xl p-3.5 glass border transition-all duration-300 flex flex-col justify-between ${
                      hoveredExperience === idx
                        ? "border-cyber-blue/50 bg-cyber-blue/[0.04] scale-[1.02] shadow-lg"
                        : "border-border-glass bg-obsidian/40 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-widest text-cyber-blue/90 uppercase block mb-1">
                        {item.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-ghost-white mb-1.5">
                        {item.company}
                      </h4>
                      <p className="text-[11px] text-ghost-white/60 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>

          {/* ══════════════ ROW 2: BOTTOM ══════════════ */}

          {/* Col 1 (Left): Mindset Card with dynamic 3D multi-card preview */}
          <div className="lg:col-span-4 flex">
            <BentoCard delay={0.15} className="w-full flex flex-col justify-between">
              <MindsetCarousel />
            </BentoCard>
          </div>

          {/* Col 2 (Center): Photo (Top) + Location with previous Map UI (Bottom) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Center Top: Profile Photo */}
            <div className="relative w-full aspect-[4/3.8] rounded-3xl overflow-hidden border border-border-glass shadow-2xl group bg-obsidian/60">
              <Image
                src="/images/Kishore.jpg"
                alt="Kishore C"
                fill
                priority
                className="object-cover object-top filter saturate-85 group-hover:saturate-100 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium bg-obsidian/85 backdrop-blur-md border border-white/10 text-ghost-white flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
                  Kishore C
                </span>
                <span className="text-cyber-blue font-semibold text-[10px]">Senior AI & Frontend</span>
              </div>
            </div>

            {/* Center Bottom: Location Card with previous Map UI */}
            <BentoCard delay={0.2} className="flex-1 flex flex-col justify-between overflow-hidden">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.location || "Palakkad, Kerala, India")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/map flex flex-col h-full w-full justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-neon-violet group-hover/map:scale-110 transition-transform" size={17} />
                      <h3 className="font-semibold text-ghost-white text-sm">Current Base</h3>
                    </div>
                    <span className="text-[10px] font-mono text-neon-violet font-semibold">
                      GMT+5:30
                    </span>
                  </div>

                  {/* Interactive Styled Google Map with radar ping */}
                  <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden glass border border-border-glass isolation-isolate mb-3">
                    <iframe
                      title="Google Map Location"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.location || "Palakkad, Kerala, India")}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0 opacity-65 group-hover/map:opacity-85 transition-opacity grayscale invert contrast-125 pointer-events-none"
                      allowFullScreen
                      loading="lazy"
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <span className="absolute w-6 h-6 rounded-full bg-cyber-blue/30 animate-ping" />
                      <span className="relative w-3 h-3 rounded-full bg-cyber-blue glow-blue" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-ghost-white text-xs sm:text-sm font-bold font-mono uppercase tracking-wide group-hover/map:text-cyber-blue transition-colors">
                      Palakkad, India
                    </p>
                    <span className="text-[10px] text-ghost-white/40 font-mono">
                      10.7867° N, 76.6548° E
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-green-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Open to global collaboration
                    </span>
                    <span className="opacity-0 group-hover/map:opacity-100 transition-opacity text-[10px] text-cyber-blue">
                      View Maps →
                    </span>
                  </div>
                </div>
              </a>
            </BentoCard>
          </div>

          {/* Col 3 (Right): Currently Building Card (Featuring GlobalReach, Social Automation, AI Call Center) */}
          <div className="lg:col-span-4 flex">
            <BentoCard delay={0.25} className="w-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiCpu className="text-cyber-blue" size={18} />
                    <h3 className="text-xl sm:text-2xl font-extrabold text-ghost-white tracking-tight">
                      Currently Building
                    </h3>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                </div>

                <div className="w-10 h-1 bg-neon-violet rounded-full mb-3" />
                
                <p className="text-xs text-ghost-white/60 leading-relaxed mb-3">
                  Production AI agent platforms, real-time voice architectures, and high-scale B2B SaaS engines:
                </p>

                {/* 3 Featured Projects with Rich UI & Animations */}
                <div className="space-y-2.5">
                  
                  {/* Project 1: GlobalReach */}
                  <motion.a
                    href="https://www.getyourclientsb2b.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 2 }}
                    transition={{ duration: 0.2 }}
                    className="block p-3 rounded-2xl glass border border-border-glass hover:border-cyber-blue/40 hover:bg-cyber-blue/[0.04] transition-all group/p"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">
                        AI OUTREACH & LLM
                      </span>
                      <FiArrowUpRight className="text-ghost-white/40 group-hover/p:text-cyber-blue group-hover/p:translate-x-0.5 group-hover/p:-translate-y-0.5 transition-all" size={13} />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-ghost-white group-hover/p:text-cyber-blue transition-colors">
                      GlobalReach — B2B Lead CRM
                    </h4>
                    <p className="text-[11px] text-ghost-white/55 leading-relaxed mt-1">
                      Autonomous LLM prospect discovery with personalized email sequences, PostGIS geo-filtering & sales pipeline tracking.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {["Next.js 14", "FastAPI", "PostGIS", "Redis"].map((t) => (
                        <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-ghost-white/50 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.a>

                  {/* Project 2: Social Media & Marketing Automation */}
                  <motion.a
                    href="https://growth.getyourclientsb2b.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 2 }}
                    transition={{ duration: 0.2 }}
                    className="block p-3 rounded-2xl glass border border-border-glass hover:border-neon-violet/40 hover:bg-neon-violet/[0.04] transition-all group/p"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-neon-violet/15 text-neon-violet border border-neon-violet/30">
                        GROWTH ENGINE
                      </span>
                      <FiArrowUpRight className="text-ghost-white/40 group-hover/p:text-neon-violet group-hover/p:translate-x-0.5 group-hover/p:-translate-y-0.5 transition-all" size={13} />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-ghost-white group-hover/p:text-neon-violet transition-colors">
                      AI Social Media Automation
                    </h4>
                    <p className="text-[11px] text-ghost-white/55 leading-relaxed mt-1">
                      Self-driving multi-channel marketing engine generating tailored copy, automated scheduling, and performance analytics.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {["React", "FastAPI", "Pydantic v2", "Recharts"].map((t) => (
                        <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-ghost-white/50 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.a>

                  {/* Project 3: VOC AI Call Center Platform */}
                  <motion.a
                    href="https://demo.articence.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 2 }}
                    transition={{ duration: 0.2 }}
                    className="block p-3 rounded-2xl glass border border-border-glass hover:border-green-400/40 hover:bg-green-400/[0.04] transition-all group/p"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        REAL-TIME SPEECH AI
                      </span>
                      <FiArrowUpRight className="text-ghost-white/40 group-hover/p:text-green-400 group-hover/p:translate-x-0.5 group-hover/p:-translate-y-0.5 transition-all" size={13} />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-ghost-white group-hover/p:text-green-400 transition-colors">
                      VOC AI Call Center & Analytics
                    </h4>
                    <p className="text-[11px] text-ghost-white/55 leading-relaxed mt-1">
                      Real-time audio streaming platform with live speech-to-text sentiment tracking, dynamic LLM prompts & automated summaries.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {["WebSockets", "LiveKit", "WebRTC", "Python"].map((t) => (
                        <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-ghost-white/50 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.a>

                </div>
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px] text-ghost-white/50 font-mono">
                <span className="flex items-center gap-1.5 text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live in Production
                </span>
                <button
                  type="button"
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-cyber-blue transition-colors flex items-center gap-1"
                >
                  View All Work →
                </button>
              </div>
            </BentoCard>
          </div>

        </div>
      </div>
    </section>
  );
}
