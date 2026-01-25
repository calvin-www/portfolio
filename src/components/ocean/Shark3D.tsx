"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function SharkMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const tailGroupRef = useRef<THREE.Group>(null);
  const followGroupRef = useRef<THREE.Group>(null);
  
  const { viewport } = useThree();
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 80, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const lastMoveTime = useRef(Date.now());
  const lastAngle = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      mouseX.set(x);
      mouseY.set(y);
      lastMoveTime.current = Date.now();
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);
  
  // Shark colors
  const bodyColor = "#00BCD4"; // Cyan 500
  const bellyColor = "#B2EBF2"; // Cyan 100
  const finColor = "#0097A7"; // Cyan 700

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // If reduced motion is preferred, keep shark static in center
    if (prefersReducedMotion) {
      if (followGroupRef.current) {
        followGroupRef.current.position.x = 0;
        followGroupRef.current.position.y = 0;
        followGroupRef.current.rotation.z = 0;
      }
      if (tailGroupRef.current) {
        tailGroupRef.current.rotation.y = 0;
      }
      if (groupRef.current) {
        groupRef.current.position.y = 0;
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.y = 0;
      }
      return;
    }

    // --- Cursor Following Logic ---
    if (followGroupRef.current) {
      // 1. Calculate Target Position
      let x = smoothX.get() * (viewport.width / 2);
      let y = smoothY.get() * (viewport.height / 2);
      
      // Clamp to viewport with padding to keep shark fully visible
      const paddingX = 2; 
      const paddingY = 1.5;
      const maxX = viewport.width / 2 - paddingX;
      const maxY = viewport.height / 2 - paddingY;
      x = Math.max(-maxX, Math.min(maxX, x));
      y = Math.max(-maxY, Math.min(maxY, y));

      // Idle Circling Behavior
      const timeSinceMove = Date.now() - lastMoveTime.current;
      if (timeSinceMove > 2000) {
        // Circle around the last position
        const circleSpeed = 0.5;
        const circleRadius = 1.5;
        // Use t to animate the circle
        x += Math.cos(t * circleSpeed) * circleRadius;
        y += Math.sin(t * circleSpeed) * circleRadius;
      }

      // 2. Calculate Rotation (Face movement direction)
      const currentPos = followGroupRef.current.position;
      const dx = x - currentPos.x;
      const dy = y - currentPos.y;
      
      // Only update angle if moving significantly
      if (Math.abs(dx) > 0.005 || Math.abs(dy) > 0.005) {
        const targetAngle = Math.atan2(dy, dx);
        
        // Smooth rotation interpolation
        let angleDiff = targetAngle - lastAngle.current;
        // Normalize to -PI..PI for shortest rotation path
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        lastAngle.current += angleDiff * 0.1;
        followGroupRef.current.rotation.z = lastAngle.current;
      }

      // 3. Apply Position
      followGroupRef.current.position.x = x;
      followGroupRef.current.position.y = y;
    }

    // --- Existing Idle Animations ---
    if (tailGroupRef.current) {
      // Tail sway animation - faster frequency
      tailGroupRef.current.rotation.y = Math.sin(t * 3) * 0.3;
    }
    
    if (groupRef.current) {
      // Whole body idle movement
      // Bobbing up and down (local Y)
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.2;
      // Slight roll (local Z)
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
      // Slight yaw counter to tail (local Y)
      groupRef.current.rotation.y = Math.cos(t * 3) * 0.05;
    }
  });

  return (
    <group ref={followGroupRef}>
      <group ref={groupRef}>
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
