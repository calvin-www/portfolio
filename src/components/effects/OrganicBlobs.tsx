"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Blob {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const BLOB_COLORS = [
  "rgba(49, 130, 206, 0.08)",
  "rgba(0, 181, 216, 0.06)",
  "rgba(99, 179, 237, 0.07)",
  "rgba(128, 90, 213, 0.05)",
];

export function OrganicBlobs() {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newBlobs: Blob[] = [];
    for (let i = 0; i < 4; i++) {
      newBlobs.push({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 150 + Math.random() * 250,
        color: BLOB_COLORS[i % BLOB_COLORS.length],
      });
    }
    setBlobs(newBlobs);
  }, []);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleScroll, handleMouseMove]);

  return (
    <div data-testid="organic-blobs" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {blobs.map((blob, index) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: blob.size,
            height: blob.size,
            background: blob.color,
            filter: "blur(80px)",
            transform: `translate(
              ${mousePos.x * (index + 1) * 0.5}px,
              ${scrollY * 0.02 * (index + 1) + mousePos.y * (index + 1) * 0.5}px
            )`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 20 + index * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
