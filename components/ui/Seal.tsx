"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useId } from "react";
import { Emblem } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

/**
 * Selo circular: o texto gira devagar em volta do emblema e acelera com o scroll.
 * Referência aos selos de lacre e às etiquetas de vinho.
 */
export function Seal({
  text = "Vila Medí · Temperani Amalfi · MII Mar · Cru Oyster Bar · ",
  className,
}: {
  text?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, (v) => v / 6);

  return (
    <div aria-hidden className={cn("relative aspect-square", className)}>
      <motion.div className="absolute inset-0" style={{ rotate }}>
        <svg viewBox="0 0 200 200" className="h-full w-full animate-[spin_40s_linear_infinite] overflow-visible">
          <defs>
            <path id={id} d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
          </defs>
          <text className="fill-current font-sans text-[13.2px] tracking-[0.32em] uppercase" style={{ fontWeight: 420 }}>
            <textPath href={`#${id}`} textLength={505}>
              {text}
            </textPath>
          </text>
        </svg>
      </motion.div>
      <div className="absolute inset-[24%] rounded-full border border-current/25" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Emblem className="w-[30%]" />
      </div>
    </div>
  );
}
