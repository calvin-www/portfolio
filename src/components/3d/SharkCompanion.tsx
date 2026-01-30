"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

function SharkModel({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, "/models/scene.gltf");
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const smoothVelocity = useRef(0);

  const [springs, api] = useSpring(() => ({
    position: [0, 0, 0] as [number, number, number],
    config: { mass: 2, tension: 50, friction: 20 },
  }));

  const targetX = (mouseX - 0.5) * 10;
  const targetY = -(mouseY - 0.5) * 6;

  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      const clip = gltf.animations[0];
      actionRef.current = mixerRef.current.clipAction(clip);
      actionRef.current.play();
    }
    
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [gltf]);

  useEffect(() => {
    api.start({ position: [targetX, targetY, 0] });
  }, [targetX, targetY, api]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const currentX = groupRef.current.position.x;
    const currentY = groupRef.current.position.y;

    const dirX = targetX - currentX;
    const dirY = targetY - currentY;
    const speed = Math.sqrt(dirX * dirX + dirY * dirY);
    smoothVelocity.current = THREE.MathUtils.lerp(smoothVelocity.current, speed, 0.1);

    const angleToTarget = Math.atan2(dirY, dirX);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      angleToTarget,
      0.08
    );

    const bankAngle = THREE.MathUtils.clamp(dirX * 0.15, -0.4, 0.4);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      bankAngle,
      0.1
    );

    if (mixerRef.current) {
      const baseSpeed = 1.0;
      const speedBoost = Math.min(smoothVelocity.current * 0.3, 1.5);
      const animationSpeed = baseSpeed + speedBoost;
      
      if (actionRef.current) {
        actionRef.current.timeScale = animationSpeed;
      }
      
      mixerRef.current.update(delta);
    }
  });

  return (
    <animated.group ref={groupRef} position={springs.position}>
      <primitive object={gltf.scene} scale={0.8} rotation={[0, Math.PI / 2, 0]} />
    </animated.group>
  );
}

function Bubbles({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const bubbleData = useRef<Array<{ x: number; y: number; z: number; speed: number; life: number }>>([]);
  const prevMouse = useRef({ x: mouseX, y: mouseY });

  useFrame(() => {
    if (!bubblesRef.current) return;

    const deltaX = mouseX - prevMouse.current.x;
    const deltaY = mouseY - prevMouse.current.y;
    const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (speed > 0.01 && bubbleData.current.length < 10) {
      const sharkX = (mouseX - 0.5) * 10;
      const sharkY = -(mouseY - 0.5) * 6;
      bubbleData.current.push({
        x: sharkX - deltaX * 20,
        y: sharkY - deltaY * 20,
        z: Math.random() * 2 - 1,
        speed: 0.02 + Math.random() * 0.02,
        life: 1,
      });
    }

    const dummy = new THREE.Object3D();
    bubbleData.current = bubbleData.current.filter((bubble, i) => {
      bubble.y += bubble.speed;
      bubble.life -= 0.02;
      
      if (bubble.life <= 0) return false;

      dummy.position.set(bubble.x, bubble.y, bubble.z);
      dummy.scale.setScalar(bubble.life * 0.3);
      dummy.updateMatrix();
      bubblesRef.current?.setMatrixAt(i, dummy.matrix);
      
      return true;
    });

    for (let i = bubbleData.current.length; i < 10; i++) {
      dummy.position.set(0, -100, 0);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      bubblesRef.current?.setMatrixAt(i, dummy.matrix);
    }

    bubblesRef.current.instanceMatrix.needsUpdate = true;
    prevMouse.current = { x: mouseX, y: mouseY };
  });

  return (
    <instancedMesh ref={bubblesRef} args={[undefined, undefined, 10]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#00B5D8" transparent opacity={0.5} />
    </instancedMesh>
  );
}

export function SharkCompanion() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isTouch, setIsTouch] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia("(hover: none)").matches || window.innerWidth < 768);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      data-testid="shark-canvas"
      className="fixed inset-0 pointer-events-none z-30"
      style={{ transform: isClicked ? "scale(1.05)" : "scale(1)", transition: "transform 0.15s" }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <SharkModel mouseX={mousePosition.x} mouseY={mousePosition.y} />
          <Bubbles mouseX={mousePosition.x} mouseY={mousePosition.y} />
        </Suspense>
      </Canvas>
    </div>
  );
}
