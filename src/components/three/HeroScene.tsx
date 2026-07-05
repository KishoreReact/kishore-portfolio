"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Ring } from "@react-three/drei";
import * as THREE from "three";
import ParticleField from "./ParticleField";

interface HeroSceneProps {
  mouseX?: number;
  mouseY?: number;
}

export default function HeroScene({ mouseX = 0, mouseY = 0 }: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRingGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Smooth camera-like follow on mouse
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.4,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseY * 0.2,
        0.05
      );
    }
    if (outerRingGroupRef.current) {
      outerRingGroupRef.current.rotation.z = t * 0.3;
      outerRingGroupRef.current.rotation.x = t * 0.1;
    }
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.1} />

      {/* Cyber blue key light */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color="#00F0FF"
        castShadow
      />

      {/* Violet fill light */}
      <pointLight position={[-4, -2, -4]} intensity={1.5} color="#8A2BE2" />

      {/* Rim light */}
      <directionalLight position={[0, 8, -5]} intensity={0.5} color="#ffffff" />

      <group ref={groupRef}>
        {/* ── Main distorted sphere ──────────────────────────── */}
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
          <Sphere
            args={[1.2, 64, 64]}
            castShadow
          >
            <MeshDistortMaterial
              color="#050505"
              attach="material"
              distort={0.45}
              speed={2.5}
              roughness={0.1}
              metalness={0.95}
              envMapIntensity={1.2}
            />
          </Sphere>

          {/* Glowing wireframe overlay */}
          <Sphere args={[1.22, 32, 32]}>
            <meshBasicMaterial
              color="#00F0FF"
              wireframe
              transparent
              opacity={0.08}
            />
          </Sphere>
        </Float>

        {/* ── Outer rotating ring ────────────────────────────── */}
        <group ref={outerRingGroupRef}>
          <Ring
            args={[1.7, 1.75, 128]}
            rotation={[Math.PI / 2.5, 0, 0]}
          >
            <meshBasicMaterial
              color="#00F0FF"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </Ring>
        </group>

        {/* ── Secondary orbit ring ───────────────────────────── */}
        <Ring
          args={[2.1, 2.13, 128]}
          rotation={[Math.PI / 4, Math.PI / 6, 0]}
        >
          <meshBasicMaterial
            color="#8A2BE2"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </Ring>

        {/* ── Particles ──────────────────────────────────────── */}
        <ParticleField count={5000} mouseX={mouseX} mouseY={mouseY} />
      </group>
    </>
  );
}
