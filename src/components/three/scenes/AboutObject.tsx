"use client";

/**
 * AboutObject — Section 1
 * Glowing "Atomic" / React-logo-inspired structure:
 * A TorusKnot core orbited by three electron rings,
 * with glowing node spheres at orbit intersections.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  isActive: boolean;
  mouseX: number;
  mouseY: number;
}

export default function AboutObject({ isActive, mouseX, mouseY }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const orbitA = useRef<THREE.Group>(null);
  const orbitB = useRef<THREE.Group>(null);
  const orbitC = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const currentScale = useRef(0);

  // Electron sphere positions on each orbit
  const electronPositions = useMemo<[number, number, number][]>(
    () => [
      [1.8, 0, 0],
      [-1.8, 0, 0],
      [0, 0, 1.8],
    ],
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const target = isActive ? 1 : 0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, target, 0.04);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale.current);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.5, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.25, 0.05);
    }

    // Three independent orbital planes — React-logo inspired
    if (orbitA.current) orbitA.current.rotation.z = t * 0.55;
    if (orbitB.current) {
      orbitB.current.rotation.z = t * 0.45;
      orbitB.current.rotation.x = Math.PI / 3;
    }
    if (orbitC.current) {
      orbitC.current.rotation.z = -t * 0.38;
      orbitC.current.rotation.x = -Math.PI / 3;
    }

    // Core torus-knot rotation
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.22;
      coreRef.current.rotation.y = t * 0.14;
    }
  });

  const electronMat = (
    <meshStandardMaterial
      color="#00F0FF"
      emissive="#00F0FF"
      emissiveIntensity={1.6}
      roughness={0.1}
      metalness={0.8}
    />
  );

  const orbitMat = (
    <meshBasicMaterial
      color="#61DAFB"
      transparent
      opacity={0.4}
      side={THREE.DoubleSide}
    />
  );

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* ── Glowing nucleus ──────────────────────────────── */}
        <mesh ref={coreRef}>
          <torusKnotGeometry args={[0.55, 0.18, 160, 12, 2, 3]} />
          <meshStandardMaterial
            color="#1a0030"
            emissive="#8A2BE2"
            emissiveIntensity={0.9}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Nucleus wireframe shell */}
        <mesh>
          <torusKnotGeometry args={[0.58, 0.19, 80, 8, 2, 3]} />
          <meshBasicMaterial color="#8A2BE2" wireframe transparent opacity={0.25} />
        </mesh>

        {/* ── Orbit A — horizontal ────────────────────────── */}
        <group ref={orbitA}>
          <Torus args={[1.8, 0.012, 16, 120]}>
            {orbitMat}
          </Torus>
          <Sphere args={[0.09, 16, 16]} position={electronPositions[0]}>
            {electronMat}
          </Sphere>
          <Sphere args={[0.06, 12, 12]} position={[-1.2, 1.2, 0]}>
            {electronMat}
          </Sphere>
        </group>

        {/* ── Orbit B — 60° tilt ──────────────────────────── */}
        <group ref={orbitB}>
          <Torus args={[1.8, 0.012, 16, 120]}>
            {orbitMat}
          </Torus>
          <Sphere args={[0.09, 16, 16]} position={electronPositions[1]}>
            {electronMat}
          </Sphere>
          <Sphere args={[0.055, 12, 12]} position={[1.0, -1.5, 0]}>
            {electronMat}
          </Sphere>
        </group>

        {/* ── Orbit C — -60° tilt ─────────────────────────── */}
        <group ref={orbitC}>
          <Torus args={[1.8, 0.012, 16, 120]}>
            {orbitMat}
          </Torus>
          <Sphere args={[0.09, 16, 16]} position={electronPositions[2]}>
            {electronMat}
          </Sphere>
        </group>

        {/* ── Node connection lines (static, faint) ───────── */}
        <NodeLines />
      </Float>
    </group>
  );
}

/** Faint digital-node mesh lines radiating from center */
function NodeLines() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const pts: number[] = [];
    const nodeCount = 18;
    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 2;
      const r = 1.1 + Math.random() * 1.2;
      pts.push(0, 0, 0, r * Math.cos(theta), r * Math.sin(theta) * 0.6, (Math.random() - 0.5) * 0.8);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.09;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#8A2BE2" transparent opacity={0.22} />
    </lineSegments>
  );
}
