"use client";

import { useState, useEffect, useCallback } from "react";

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
}

export function useCursor() {
  const [state, setState] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive =
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.closest("a") !== null ||
      target.closest("button") !== null ||
      target.closest("[data-interactive]") !== null ||
      target.hasAttribute("data-interactive");

    setState((prev) => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
      isHovering: isInteractive,
    }));
  }, []);

  const handleMouseDown = useCallback(() => {
    setState((prev) => ({ ...prev, isClicking: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setState((prev) => ({ ...prev, isClicking: false }));
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  return state;
}
