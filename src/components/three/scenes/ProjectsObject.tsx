"use client";

/**
 * ProjectsObject — Section 2
 * Futuristic floating monitor pedestal with holographic screen,
 * rotating rings beneath, and electric blue/violet accents.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Torus } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  isActive: boolean;
  mouseX: number;
  mouseY: number;
}

export default function ProjectsObject({ isActive, mouseX, mouseY }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const holoRingA = useRef<THREE.Group>(null);
  const holoRingB = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const currentScale = useRef(0);
  const scanlineOffset = useRef(0);

  // Scanline animation uniform
  const screenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000814"),
        emissive: new THREE.Color("#00F0FF"),
        emissiveIntensity: 0.55,
        roughness: 0.05,
        metalness: 0.9,
        transparent: true,
        opacity: 0.95,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const target = isActive ? 1 : 0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, target, 0.04);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale.current);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.45, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.2, 0.05);
    }

    if (holoRingA.current) holoRingA.current.rotation.y = t * 0.6;
    if (holoRingB.current) holoRingB.current.rotation.y = -t * 0.42;

    // Pulse the screen emissive
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 1.8) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.5}>

        {/* ── Monitor frame ───────────────────────────────── */}
        <group position={[0, 0.55, 0]}>
          {/* Outer bezel */}
          <RoundedBox args={[3.2, 2.0, 0.09]} radius={0.06} smoothness={4}>
            <meshStandardMaterial
              color="#090914"
              emissive="#00F0FF"
              emissiveIntensity={0.06}
              roughness={0.15}
              metalness={0.95}
            />
          </RoundedBox>

          {/* Screen surface */}
          <mesh ref={screenRef} position={[0, 0, 0.052]}>
            <planeGeometry args={[2.85, 1.72]} />
            <primitive object={screenMat} />
          </mesh>

          {/* Screen inner grid lines */}
          <ScreenGrid />

          {/* Cyber corner brackets */}
          <CornerBrackets />
        </group>

        {/* ── Monitor neck ────────────────────────────────── */}
        <mesh position={[0, -0.43, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.7, 12]} />
          <meshStandardMaterial color="#0a0a18" roughness={0.2} metalness={0.95} />
        </mesh>

        {/* ── Base pedestal ────────────────────────────────── */}
        <mesh position={[0, -0.82, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 0.08, 32]} />
          <meshStandardMaterial
            color="#070710"
            emissive="#8A2BE2"
            emissiveIntensity={0.25}
            roughness={0.15}
            metalness={0.98}
          />
        </mesh>
        <mesh position={[0, -0.87, 0]}>
          <cylinderGeometry args={[0.82, 0.82, 0.018, 64]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.35} />
        </mesh>

        {/* ── Holographic base rings ────────────────────────── */}
        <group ref={holoRingA} position={[0, -0.78, 0]}>
          <Torus args={[1.1, 0.012, 12, 96]}>
            <meshBasicMaterial color="#00F0FF" transparent opacity={0.45} />
          </Torus>
          <Torus args={[1.45, 0.008, 8, 64]}>
            <meshBasicMaterial color="#8A2BE2" transparent opacity={0.3} />
          </Torus>
        </group>
        <group ref={holoRingB} position={[0, -0.72, 0]}>
          <Torus args={[0.75, 0.009, 8, 64]}>
            <meshBasicMaterial color="#8A2BE2" transparent opacity={0.35} />
          </Torus>
        </group>

      </Float>
    </group>
  );
}

/** Horizontal scanlines on the screen */
function ScreenGrid() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const pts: number[] = [];
    const rows = 14;
    const cols = 10;
    const w = 2.8;
    const h = 1.68;
    for (let i = 0; i <= rows; i++) {
      const y = -h / 2 + (i / rows) * h;
      pts.push(-w / 2, y, 0.055, w / 2, y, 0.055);
    }
    for (let j = 0; j <= cols; j++) {
      const x = -w / 2 + (j / cols) * w;
      pts.push(x, -h / 2, 0.055, x, h / 2, 0.055);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.04 + Math.sin(clock.getElapsedTime() * 2.5) * 0.02;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#00F0FF" transparent opacity={0.06} />
    </lineSegments>
  );
}

/** Glowing corner accent brackets */
function CornerBrackets() {
  const w = 1.55;
  const h = 0.95;
  const s = 0.22; // bracket arm length
  const d = 0.058;

  const pts: number[] = [
    // Top-left
    -w, h - s, d, -w, h, d, -w + s, h, d,
    // Top-right
    w - s, h, d, w, h, d, w, h - s, d,
    // Bottom-right
    w, -h + s, d, w, -h, d, w - s, -h, d,
    // Bottom-left
    -w + s, -h, d, -w, -h, d, -w, -h + s, d,
  ];

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#00F0FF" transparent opacity={0.85} />
    </lineSegments>
  );
}
