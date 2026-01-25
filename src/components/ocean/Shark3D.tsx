"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function SharkMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const tailGroupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  
  // Shark colors
  const bodyColor = "#00BCD4"; // Cyan 500
  const bellyColor = "#B2EBF2"; // Cyan 100
  const finColor = "#0097A7"; // Cyan 700

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (tailGroupRef.current) {
      // Tail sway animation - faster frequency
      tailGroupRef.current.rotation.y = Math.sin(t * 3) * 0.3;
    }
    
    if (groupRef.current) {
      // Whole body idle movement
      // Bobbing up and down
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.2;
      // Slight roll
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
      // Slight yaw counter to tail to look more natural
      groupRef.current.rotation.y = Math.cos(t * 3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Main Body Group */}
      <group>
        {/* Torso - Main body segment */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 1, 0.8]} />
          <meshStandardMaterial color={bodyColor} flatShading roughness={0.4} />
        </mesh>

        {/* Nose/Head - Tapered front */}
        <mesh position={[1.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.5, 1, 4]} />
          <meshStandardMaterial color={bodyColor} flatShading roughness={0.4} />
        </mesh>

        {/* Belly - Lighter underside (simulated with a bottom plate) */}
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[2.4, 0.1, 0.7]} />
          <meshStandardMaterial color={bellyColor} flatShading />
        </mesh>

        {/* Dorsal Fin (Top) */}
        <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.4, 1.2, 4]} />
          <meshStandardMaterial color={finColor} flatShading />
        </mesh>

        {/* Pectoral Fins (Side) */}
        {/* Left Fin */}
        <mesh position={[0.5, -0.2, 0.6]} rotation={[0.5, 0.5, 0.5]}>
          <boxGeometry args={[0.8, 0.1, 0.4]} />
          <meshStandardMaterial color={finColor} flatShading />
        </mesh>
        {/* Right Fin */}
        <mesh position={[0.5, -0.2, -0.6]} rotation={[-0.5, -0.5, 0.5]}>
          <boxGeometry args={[0.8, 0.1, 0.4]} />
          <meshStandardMaterial color={finColor} flatShading />
        </mesh>

        {/* Eyes */}
        <mesh position={[1.8, 0.1, 0.3]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[1.8, 0.1, -0.3]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

      {/* Tail Group - Pivots from back of body */}
      <group ref={tailGroupRef} position={[-1.25, 0, 0]}>
        {/* Tail connector/taper */}
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.35, 1, 4]} />
          <meshStandardMaterial color={bodyColor} flatShading />
        </mesh>

        {/* Tail Fin */}
        <group position={[-1, 0, 0]}>
          {/* Upper lobe */}
          <mesh position={[-0.2, 0.4, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.4, 0.8, 0.1]} />
            <meshStandardMaterial color={finColor} flatShading />
          </mesh>
          {/* Lower lobe */}
          <mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.3, 0.6, 0.1]} />
            <meshStandardMaterial color={finColor} flatShading />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function Shark3D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]} // Optimize for high DPI screens
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 0, 5]} intensity={0.5} color="#00BCD4" />
        
        <SharkMesh />
      </Canvas>
    </div>
  );
}
