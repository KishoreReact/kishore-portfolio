"use client";

/**
 * SkillsObject — Section 3
 * Floating isometric keyboard grid: rows of Box-keycaps with
 * individual per-key floating offsets + abstract code-block planes.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  isActive: boolean;
  mouseX: number;
  mouseY: number;
}

// Key layout: rows × cols
const ROWS = 4;
const COLS = 12;
const KEY_W = 0.28;
const KEY_H = 0.26;
const KEY_GAP = 0.04;

// Code snippets for the floating planes
const CODE_SNIPPETS = [
  "const x = () =>",
  "useEffect(() => {",
  "return <Canvas />",
  "async/await fetch",
  "type Props = {",
  "zIndex: 9999;",
];

export default function SkillsObject({ isActive, mouseX, mouseY }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);

  // Per-key random float offsets (seed once)
  const keyOffsets = useMemo(
    () =>
      Array.from({ length: ROWS * COLS }, () => ({
        freq: 0.6 + Math.random() * 0.8,
        amp: 0.03 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );

  // Refs for each key mesh
  const keyRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const target = isActive ? 1 : 0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, target, 0.04);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale.current);
      // Isometric-ish fixed angle + mouse tilt
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.45 + (-mouseY * 0.15),
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        -0.3 + (mouseX * 0.3),
        0.05
      );
    }

    // Animate individual key press bobble
    keyRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const { freq, amp, phase } = keyOffsets[i];
      mesh.position.y = Math.sin(t * freq + phase) * amp;
    });
  });

  const totalW = COLS * (KEY_W + KEY_GAP) - KEY_GAP;
  const totalH = ROWS * (KEY_H + KEY_GAP) - KEY_GAP;

  // Key emissive colors cycling through theme
  const keyColors = ["#00F0FF", "#8A2BE2", "#3178C6", "#00F0FF", "#ffffff"];

  return (
    <group ref={groupRef}>
      {/* ── Keyboard board base ─────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Keyboard plate */}
        <RoundedBox
          args={[totalW + 0.25, 0.06, totalH + 0.22]}
          radius={0.04}
          smoothness={4}
          position={[0, -0.14, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial
            color="#080814"
            emissive="#00F0FF"
            emissiveIntensity={0.04}
            roughness={0.15}
            metalness={0.95}
          />
        </RoundedBox>

        {/* ── Keys ──────────────────────────────────────── */}
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const idx = row * COLS + col;
            const rowOffset = row % 2 === 1 ? KEY_W * 0.3 : 0;
            const x = -totalW / 2 + col * (KEY_W + KEY_GAP) + rowOffset + KEY_W / 2;
            const z = -totalH / 2 + row * (KEY_H + KEY_GAP) + KEY_H / 2;
            const colorIdx = (row + col) % keyColors.length;
            const isHighlighted = (row === 0 && col < 3) || (row === 1 && col % 4 === 0);

            return (
              <mesh
                key={idx}
                ref={(el) => { keyRefs.current[idx] = el; }}
                position={[x, 0, z]}
              >
                <boxGeometry args={[KEY_W - 0.02, 0.11, KEY_H - 0.02]} />
                <meshStandardMaterial
                  color={isHighlighted ? "#080820" : "#06060f"}
                  emissive={isHighlighted ? keyColors[colorIdx] : "#00F0FF"}
                  emissiveIntensity={isHighlighted ? 0.55 : 0.04}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>
            );
          })
        )}
      </group>

      {/* ── Floating code snippet planes ─────────────────── */}
      {CODE_SNIPPETS.map((snippet, i) => (
        <Float
          key={i}
          speed={0.8 + i * 0.15}
          rotationIntensity={0.05}
          floatIntensity={0.3}
          position={[
            (i % 2 === 0 ? -1 : 1) * (2.2 + (i % 3) * 0.4),
            0.4 + i * 0.18,
            -0.5 + i * 0.25,
          ]}
        >
          <CodeBlock text={snippet} index={i} />
        </Float>
      ))}
    </group>
  );
}

/** A tiny glowing code-text card */
function CodeBlock({ text, index }: { text: string; index: number }) {
  const colors = ["#00F0FF", "#8A2BE2", "#3178C6", "#00F0FF", "#8A2BE2", "#ffffff"];
  return (
    <group>
      <RoundedBox args={[1.5, 0.28, 0.02]} radius={0.03} smoothness={4}>
        <meshStandardMaterial
          color="#080814"
          emissive={colors[index % colors.length]}
          emissiveIntensity={0.08}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.82}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.015]}
        fontSize={0.1}
        color={colors[index % colors.length]}
        font={undefined}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}
