"use client";

/**
 * HeroObject — Section 0
 * Complex Icosahedron intersecting with animated wireframe rings.
 * Distorted metallic sphere with emissive cyan core + particle cloud.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Ring, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  isActive: boolean;
  mouseX: number;
  mouseY: number;
}

export default function HeroObject({ isActive, mouseX, mouseY }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Group>(null);
  const ringBRef = useRef<THREE.Group>(null);
  const icoRef = useRef<THREE.Mesh>(null);
  const targetScale = useRef(0);
  const currentScale = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    targetScale.current = isActive ? 1 : 0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, 0.04);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale.current);
      // Mouse-reactive tilt
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.5, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.25, 0.05);
    }

    // Counter-rotating rings
    if (ringARef.current) {
      ringARef.current.rotation.z = t * 0.35;
      ringARef.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.4) * 0.15;
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.z = -t * 0.22;
      ringBRef.current.rotation.y = t * 0.18;
    }

    // Icosahedron slow self-spin
    if (icoRef.current) {
      icoRef.current.rotation.y = t * 0.18;
      icoRef.current.rotation.z = t * 0.07;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Main distorted icosahedron ─────────────────────── */}
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
        <Icosahedron ref={icoRef} args={[1.1, 1]} castShadow>
          <MeshDistortMaterial
            color="#050505"
            attach="material"
            distort={0.38}
            speed={2}
            roughness={0.08}
            metalness={0.97}
            envMapIntensity={1.5}
            emissive="#00F0FF"
            emissiveIntensity={0.12}
          />
        </Icosahedron>

        {/* Wireframe overlay */}
        <Icosahedron args={[1.13, 1]}>
          <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.18} />
        </Icosahedron>

        {/* Glowing outer shell */}
        <Icosahedron args={[1.35, 0]}>
          <meshBasicMaterial color="#8A2BE2" wireframe transparent opacity={0.07} />
        </Icosahedron>
      </Float>

      {/* ── Orbital rings ──────────────────────────────────── */}
      <group ref={ringARef}>
        <Ring args={[1.65, 1.70, 96]}>
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.65} side={THREE.DoubleSide} />
        </Ring>
      </group>
      <group ref={ringBRef}>
        <Ring args={[2.05, 2.09, 96]} rotation={[Math.PI / 3, Math.PI / 5, 0]}>
          <meshBasicMaterial color="#8A2BE2" transparent opacity={0.35} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[2.4, 2.43, 64]} rotation={[Math.PI / 5, Math.PI / 2.5, 0]}>
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.12} side={THREE.DoubleSide} />
        </Ring>
      </group>

      {/* ── Ambient particle halo ──────────────────────────── */}
      <HeroParticles />
    </group>
  );
}

function HeroParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 3000;

  const [positions, colors] = (() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color("#00F0FF");
    const c2 = new THREE.Color("#8A2BE2");
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 4.5;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
      const c = Math.random() < 0.55 ? c1 : c2;
      col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
    }
    return [pos, col];
  })();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.025;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.011} vertexColors transparent opacity={0.65} sizeAttenuation depthWrite={false} />
    </points>
  );
}
