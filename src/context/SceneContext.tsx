"use client";

import React, { createContext, useContext, useRef, useState, useCallback } from "react";

export interface SceneState {
  sectionIndex: number;       // 0=Hero 1=About 2=Projects 3=Skills 4=Contact
  scrollProgress: number;     // 0‥1 page-level scroll progress
  mouseX: number;             // -1‥1 normalised
  mouseY: number;             // -1‥1 normalised
  setSectionIndex: (i: number) => void;
  setScrollProgress: (p: number) => void;
  setMouse: (x: number, y: number) => void;
}

const SceneContext = createContext<SceneState>({
  sectionIndex: 0,
  scrollProgress: 0,
  mouseX: 0,
  mouseY: 0,
  setSectionIndex: () => {},
  setScrollProgress: () => {},
  setMouse: () => {},
});

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouse, setMouseState] = useState({ x: 0, y: 0 });

  const setMouse = useCallback((x: number, y: number) => {
    setMouseState({ x, y });
  }, []);

  return (
    <SceneContext.Provider
      value={{
        sectionIndex,
        scrollProgress,
        mouseX: mouse.x,
        mouseY: mouse.y,
        setSectionIndex,
        setScrollProgress,
        setMouse,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  return useContext(SceneContext);
}
