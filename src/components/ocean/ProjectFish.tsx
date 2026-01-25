"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Icons } from "@/components/icons";

interface ProjectFishProps {
  project: any;
  position: [number, number, number];
  color: string;
  scale: number;
  speed?: number;
  swimRange?: [number, number]; // [x radius, z radius]
}

export function ProjectFish({ 
  project, 
  position: initialPosition, 
  color, 
  scale = 1,
  speed = 1,
  swimRange = [2, 1]
}: ProjectFishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Random offset for animation phase so they don't all swim in sync
  const phaseOffset = useMemo(() => Math.random() * 100, []);
  
  // Base position to swim around
  const [baseX, baseY, baseZ] = initialPosition;

  useFrame((state) => {
    if (!groupRef.current || !tailRef.current) return;

    const t = state.clock.elapsedTime + phaseOffset;
    
    // Pause/Slow logic
    const currentSpeed = clicked ? 0 : (hovered ? speed * 0.2 : speed);
    
    if (!clicked) {
      // Swimming motion (Figure 8 or Ellipse)
      // We use a slower time factor for position than for tail wag
      const swimTime = t * 0.3 * currentSpeed;
      
      // Calculate new position
      const x = baseX + Math.cos(swimTime) * swimRange[0];
      const z = baseZ + Math.sin(swimTime * 0.5) * swimRange[1]; // * 0.5 makes it a figure-8-ish if ranges differ
      const y = baseY + Math.sin(t * 0.5) * 0.2; // Bobbing up and down

      groupRef.current.position.set(x, y, z);

      // Rotation - face the direction of movement
      // Derivative of position gives velocity vector
      const dx = -Math.sin(swimTime) * swimRange[0];
      const dz = Math.cos(swimTime * 0.5) * 0.5 * swimRange[1];
      const angle = Math.atan2(dx, dz); // Note: atan2(x, z) for Y-rotation in 3D usually
      
      // Smooth rotation
      // We add Math.PI / 2 because our fish model points +X by default, but atan2 0 is +Z
      // Actually let's just adjust manually until it looks right.
      // If model faces +X:
      // Velocity vector (dx, dz). Angle = atan2(dz, dx) ?
      const targetRotation = Math.atan2(dz, dx); 
      // We might need to offset this depending on how the model is built.
      // Let's assume model faces +X.
      
      groupRef.current.rotation.y = -targetRotation;
      
      // Banking (roll) when turning
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    }

    // Tail animation (always active unless completely frozen, but maybe slower when hovered)
    // Tail wags faster than body moves
    tailRef.current.rotation.y = Math.sin(t * 5 * (hovered ? 0.5 : 1)) * 0.4;
  });

  return (
    <group>
      <group 
        ref={groupRef} 
        position={initialPosition} 
        scale={scale}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); setClicked(!clicked); }}
      >
        {/* Fish Body Group */}
        <group>
          {/* Main Body - Low Poly Hexagonal/Box shape */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.6, 0.4]} />
            <meshStandardMaterial color={color} flatShading roughness={0.4} metalness={0.1} />
          </mesh>

          {/* Head - Tapered */}
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.3, 0.6, 4]} />
            <meshStandardMaterial color={color} flatShading roughness={0.4} metalness={0.1} />
          </mesh>

          {/* Eyes */}
          <mesh position={[0.9, 0.1, 0.15]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[0.9, 0.1, -0.15]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshStandardMaterial color="black" />
          </mesh>

          {/* Dorsal Fin */}
          <mesh position={[0, 0.4, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.4, 0.4, 0.05]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>

          {/* Side Fins */}
          <mesh position={[0.2, -0.2, 0.25]} rotation={[0.5, 0.5, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.2]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
          <mesh position={[0.2, -0.2, -0.25]} rotation={[-0.5, 0.5, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.2]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>

          {/* Tail Section */}
          <group ref={tailRef} position={[-0.6, 0, 0]}>
            {/* Tail Connector */}
            <mesh position={[-0.2, 0, 0]}>
              <boxGeometry args={[0.4, 0.3, 0.2]} />
              <meshStandardMaterial color={color} flatShading />
            </mesh>
            
            {/* Tail Fin */}
            <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.4, 0.6, 3]} /> {/* Triangle shape */}
              <meshStandardMaterial color={color} flatShading />
            </mesh>
          </group>
        </group>

        {/* Project Info Popup */}
        {clicked && (
          <Html position={[0, 1.5, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="w-80 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl text-left transform transition-all animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white leading-tight">{project.title}</h3>
                <button 
                  onClick={(e) => { e.stopPropagation(); setClicked(false); }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.slice(0, 4).map((tech: string) => (
                  <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-cyan-500/20">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {project.links?.map((link: any, i: number) => (
                  <a 
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.icon}
                    {link.type}
                  </a>
                ))}
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
