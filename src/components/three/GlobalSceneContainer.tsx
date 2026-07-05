"use client";

/**
 * GlobalSceneContainer
 * ─────────────────────────────────────────────────────────────────────
 * Fixed full-screen <Canvas> that sits behind the HTML DOM (z-index: 0).
 * Reads page scroll via Framer Motion `useScroll` and maps it to a
 * sectionIndex (0-4) written into SceneContext.
 *
 * Section boundaries (equal-bucket, page-height based):
 *   0 → Hero      (0.00 – 0.20)
 *   1 → About     (0.20 – 0.40)
 *   2 → Projects  (0.40 – 0.60)
 *   3 → Skills    (0.60 – 0.80)
 *   4 → Contact   (0.80 – 1.00)
 */

import { useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { SceneProvider, useScene } from "@/context/SceneContext";

// Section IDs in scroll order
const SECTION_IDS = ["home", "about", "projects", "skills", "contact"];

// ── Dynamic imports (no SSR) ──────────────────────────────────────────
const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);
const GlobalScene = dynamic(() => import("./GlobalScene"), { ssr: false });

// ── Scroll tracker (must be inside SceneProvider) ─────────────────────
function ScrollTracker() {
  const { setSectionIndex, setScrollProgress, setMouse } = useScene();
  const { scrollYProgress } = useScroll();

  // Map 0–1 progress → section index (5 equal buckets)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
    const raw = Math.min(Math.floor(latest * SECTION_IDS.length), SECTION_IDS.length - 1);
    setSectionIndex(raw);
  });

  // Use IntersectionObserver for more accurate section detection
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
              setSectionIndex(idx);
            }
          });
        },
        { threshold: [0.35] }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [setSectionIndex]);

  // Global mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMouse(x, y);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [setMouse]);

  return null; // Pure side-effect component
}

// ── The actual Canvas wrapper ─────────────────────────────────────────
function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 52 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Suspense fallback={null}>
        <GlobalScene />
      </Suspense>
    </Canvas>
  );
}

// ── Public export: everything wrapped in the provider ─────────────────
export default function GlobalSceneContainer() {
  return (
    // pointer-events:none ensures this entire tree — including the dynamic()
    // wrapper div — never blocks mouse/touch events on the HTML DOM above.
    <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 0 }}>
      <SceneProvider>
        <ScrollTracker />
        <SceneCanvas />
      </SceneProvider>
    </div>
  );
}
