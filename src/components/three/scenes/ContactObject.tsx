"use client";

/**
 * ContactObject — Section 4
 * Particle vortex with a glowing geometric diamond at center.
 * Spins faster when hovered (detected via mouse velocity).
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Octahedron } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  isActive: boolean;
  mouseX: number;
  mouseY: number;
}

const VORTEX_COUNT = 2200;

export default function ContactObject({ isActive, mouseX, mouseY }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const vortexRef = useRef<THREE.Points>(null);
  const diamondRef = useRef<THREE.Mesh>(null);
  const currentScale = useRef(0);
  const spinSpeed = useRef(0.4);
  const prevMouseX = useRef(0);

  // Pre-compute vortex positions in a spiral pattern
  const { positions, colors, phases } = useMemo(() => {
    const pos = new Float32Array(VORTEX_COUNT * 3);
    const col = new Float32Array(VORTEX_COUNT * 3);
    const pha = new Float32Array(VORTEX_COUNT);
    const c1 = new THREE.Color("#00F0FF");
    const c2 = new THREE.Color("#8A2BE2");
    const c3 = new THREE.Color("#ffffff");

    for (let i = 0; i < VORTEX_COUNT; i++) {
      const i3 = i * 3;
      // Spiral: radius shrinks as you go "down"
      const t = i / VORTEX_COUNT;
      const angle = t * Math.PI * 24; // 12 full revolutions
      const r = 2.5 * (1 - t * 0.6) + 0.2;
      const height = (t - 0.5) * 4.5;

      pos[i3] = r * Math.cos(angle);
      pos[i3 + 1] = height;
      pos[i3 + 2] = r * Math.sin(angle);

      pha[i] = Math.random() * Math.PI * 2;

      const pick = Math.random();
      const c = pick < 0.5 ? c1 : pick < 0.75 ? c2 : c3;
      col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
    }
    return { positions: pos, colors: col, phases: pha };
  }, []);

  const posAttr = useRef<THREE.BufferAttribute>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const target = isActive ? 1 : 0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, target, 0.04);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale.current);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.4, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.2, 0.05);
    }

    // Detect mouse velocity to speed up vortex
    const mouseDelta = Math.abs(mouseX - prevMouseX.current);
    prevMouseX.current = mouseX;
    const targetSpeed = 0.38 + mouseDelta * 6.0;
    spinSpeed.current = THREE.MathUtils.lerp(spinSpeed.current, targetSpeed, 0.06);

    if (vortexRef.current) {
      vortexRef.current.rotation.y = t * spinSpeed.current;
    }

    // Animate vortex particles inward pulsing
    if (posAttr.current) {
      const arr = posAttr.current.array as Float32Array;
      for (let i = 0; i < VORTEX_COUNT; i++) {
        const i3 = i * 3;
        const particleT = i / VORTEX_COUNT;
        const angle = particleT * Math.PI * 24 + t * spinSpeed.current;
        const r = (2.5 * (1 - particleT * 0.6) + 0.2) * (1 + Math.sin(t * 1.2 + phases[i]) * 0.06);
        arr[i3] = r * Math.cos(angle);
        arr[i3 + 2] = r * Math.sin(angle);
      }
      posAttr.current.needsUpdate = true;
    }

    // Diamond rotation
    if (diamondRef.current) {
      diamondRef.current.rotation.y = t * 0.6;
      diamondRef.current.rotation.z = t * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Particle vortex ───────────────────────────────── */}
      <points ref={vortexRef}>
        <bufferGeometry>
          <bufferAttribute
            ref={posAttr}
            attach="attributes-position"
            count={VORTEX_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute attach="attributes-color" count={VORTEX_COUNT} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* ── Central glowing diamond ───────────────────────── */}
      <Float speed={2.2} floatIntensity={0.4} rotationIntensity={0.1}>
        <Octahedron ref={diamondRef} args={[0.55, 0]}>
          <meshStandardMaterial
            color="#030310"
            emissive="#8A2BE2"
            emissiveIntensity={1.2}
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.92}
          />
        </Octahedron>

        {/* Wireframe shell */}
        <Octahedron args={[0.58, 0]}>
          <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.4} />
        </Octahedron>

        {/* Outer glow ring */}
        <mesh>
          <torusGeometry args={[0.7, 0.012, 8, 64]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.5} />
        </mesh>
      </Float>

      {/* ── Envelope outline (stylized geometric mailbox) ─── */}
      <EnvelopeOutline />
    </group>
  );
}

/** Simple geometric envelope wireframe as a nod to "Contact" */
function EnvelopeOutline() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    // Envelope shape: rectangle + two V-flaps
    const w = 1.6; const h = 1.0; const d = 0.0;
    const pts = [
      // Rectangle
      -w / 2, -h / 2, d, w / 2, -h / 2, d,
      w / 2, -h / 2, d, w / 2, h / 2, d,
      w / 2, h / 2, d, -w / 2, h / 2, d,
      -w / 2, h / 2, d, -w / 2, -h / 2, d,
      // V-fold top
      -w / 2, h / 2, d, 0, h * 0.05, d,
      0, h * 0.05, d, w / 2, h / 2, d,
      // V-fold bottom
      -w / 2, -h / 2, d, 0, 0, d,
      0, 0, d, w / 2, -h / 2, d,
    ];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.35) * 0.25;
      ref.current.position.y = -1.4 + Math.sin(clock.getElapsedTime() * 0.9) * 0.06;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry} position={[0, -1.4, 0]}>
      <lineBasicMaterial color="#8A2BE2" transparent opacity={0.5} />
    </lineSegments>
  );
}
