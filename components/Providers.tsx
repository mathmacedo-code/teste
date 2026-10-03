"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { OverlayProvider } from "./overlays/Overlays";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <OverlayProvider>{children}</OverlayProvider>
    </MotionConfig>
  );
}
