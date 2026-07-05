"use client";

/**
 * GlobalScene — the single R3F scene rendered inside the fixed Canvas.
 * Mounts all 5 section objects simultaneously; each lerps its own scale
 * between 0 (inactive) and 1 (active) based on sectionIndex from context.
 *
 * Section map:
 *   0 → Hero
 *   1 → About
 *   2 → Projects
 *   3 → Skills
 *   4 → Contact
 */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "@/context/SceneContext";

import HeroObject from "./scenes/HeroObject";
import AboutObject from "./scenes/AboutObject";
import ProjectsObject from "./scenes/ProjectsObject";
import SkillsObject from "./scenes/SkillsObject";
import ContactObject from "./scenes/ContactObject";

/** How far each scene sits along the X axis when idle vs active */
const SCENE_COUNT = 5;

export default function GlobalScene() {
  const { sectionIndex, mouseX, mouseY } = useScene();
  const { camera } = useThree();
  const camTarget = useRef(new THREE.Vector3(0, 0, 4.5));

  // Subtle camera drift on mouse
  useFrame(() => {
    camTarget.current.set(mouseX * 0.4, -mouseY * 0.2, 4.5);
    (camera as THREE.PerspectiveCamera).position.lerp(camTarget.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  const sharedProps = { mouseX, mouseY };

  return (
    <>
      {/* ── Shared Lighting Rig ──────────────────────────── */}
      <ambientLight intensity={0.08} />

      {/* Cyber blue key light */}
      <spotLight
        position={[5, 6, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2.5}
        color="#00F0FF"
        castShadow
      />

      {/* Violet fill light */}
      <pointLight position={[-5, -3, -4]} intensity={2.0} color="#8A2BE2" />

      {/* Rim light */}
      <directionalLight position={[0, 8, -6]} intensity={0.6} color="#ffffff" />

      {/* Warm bottom accent */}
      <pointLight position={[0, -4, 2]} intensity={0.8} color="#3b0f70" />

      {/* ── Scene Objects ─────────────────────────────────── */}
      <HeroObject     isActive={sectionIndex === 0} {...sharedProps} />
      <AboutObject    isActive={sectionIndex === 1} {...sharedProps} />
      <ProjectsObject isActive={sectionIndex === 2} {...sharedProps} />
      <SkillsObject   isActive={sectionIndex === 3} {...sharedProps} />
      <ContactObject  isActive={sectionIndex === 4} {...sharedProps} />
    </>
  );
}
