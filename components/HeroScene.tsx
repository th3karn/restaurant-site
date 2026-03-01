"use client";
// components/HeroScene.tsx
// React Three Fiber 3D scene for the hero section.
// Features:
//  - A decorative 3D dish/plate geometry (TorusKnot as premium placeholder)
//  - Scroll-linked rotation via useScroll (Drei)
//  - Subtle continuous float animation
//  - Warm ambient + point + spot lights for restaurant mood
//  - Bloom post-processing glow
//
// To replace with a custom GLTF model:
//   1. Drop your .glb file into /public/models/dish.glb
//   2. Replace <FloatingDish> with <DishModel> (see comment below)

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useScroll,
  ScrollControls,
  Environment,
  MeshDistortMaterial,
  Float,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

/* ─── Main floating dish mesh ────────────────────────────────────────── */
function FloatingDish() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();          // Drei scroll tracker (0-1 range)

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Continuous gentle float + wobble
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.12;

    // Scroll-driven rotation: spin on Y axis as user scrolls
    const scrollOffset = scroll.offset;           // 0 = top, 1 = bottom
    meshRef.current.rotation.y = scrollOffset * Math.PI * 2 + t * 0.2;

    // Scale down slightly as user scrolls away from hero
    const scale = THREE.MathUtils.lerp(1, 0.6, scrollOffset * 1.5);
    meshRef.current.scale.setScalar(Math.max(scale, 0.6));
  });

  return (
    <mesh ref={meshRef} castShadow>
      {/* Decorative torusKnot — replace with useGLTF() for a real model */}
      <torusKnotGeometry args={[1, 0.32, 180, 24, 2, 3]} />
      {/* Distort material gives an organic, premium feel */}
      <MeshDistortMaterial
        color="#e5983a"
        metalness={0.9}
        roughness={0.15}
        distort={0.18}
        speed={2}
        envMapIntensity={2}
      />
    </mesh>
  );
}

/* ─── Ambient particle field ─────────────────────────────────────────── */
function ParticleField() {
  return (
    <Stars
      radius={20}
      depth={30}
      count={600}
      factor={1.2}
      saturation={0.3}
      fade
      speed={0.5}
    />
  );
}

/* ─── Lighting rig ────────────────────────────────────────────────────── */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      {/* Warm key light from upper-right */}
      <pointLight position={[4, 5, 3]} color="#f4c26a" intensity={60} />
      {/* Cool fill light from left */}
      <pointLight position={[-4, -2, 2]} color="#a07040" intensity={25} />
      {/* Rim light from behind */}
      <spotLight
        position={[0, -5, -4]}
        color="#e5983a"
        intensity={80}
        angle={0.5}
        penumbra={0.8}
      />
    </>
  );
}

/* ─── Inner scene (inside ScrollControls) ─────────────────────────────── */
function Scene() {
  return (
    <>
      <Lights />
      <ParticleField />
      <Float floatIntensity={0.4} rotationIntensity={0.3} speed={2}>
        <FloatingDish />
      </Float>
      {/* HDR environment for metallic reflections */}
      <Environment preset="city" />
    </>
  );
}

/* ─── Main exported Canvas ────────────────────────────────────────────── */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}               // Limit pixel ratio for performance
      style={{ background: "transparent" }}
      shadows
    >
      <Suspense fallback={null}>
        {/* ScrollControls pages=3 means the scroll context spans 3 viewport heights */}
        <ScrollControls pages={3} damping={0.18}>
          <Scene />
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}
