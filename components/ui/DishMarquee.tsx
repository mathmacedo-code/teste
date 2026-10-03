"use client";

import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
 
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Fragment, useRef } from "react";
import { img, type CutoutKey } from "@/data/media";
import { cn } from "@/lib/cn";

export type MarqueeItem = { name: string; k?: CutoutKey };

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Faixa infinita com nomes de pratos em serifada itálica, separados por
 * pequenos pratos recortados que giram. Acelera com a velocidade do scroll
 * e inverte o sentido quando a pessoa sobe a página.
 */
export function DishMarquee({
  items,
  className,
  speed = 2.2,
  tone = "dark",
}: {
  items: MarqueeItem[];
  className?: string;
  /** % da largura de uma volta por segundo */
  speed?: number;
  tone?: "dark" | "light";
}) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-25, -50, v)}%`);

  useAnimationFrame((_, delta) => {
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    base.set(base.get() - dir.current * (speed / 4) * (delta / 1000) * (1 + Math.abs(f)));
  });

  const run = (
    <span className="flex shrink-0 items-center">
      {items.map((it) => (
        <Fragment key={it.name}>
          <span className="whitespace-nowrap px-[0.35em] font-serif font-light italic">{it.name}</span>
          <span className="relative mx-[0.3em] inline-block h-[1.15em] w-[1.15em] shrink-0">
            {it.k ? (
              <Image
                src={img[it.k]}
                alt=""
                fill
                sizes="96px"
                className={cn(
                  "object-contain",
                  it.k !== "recorte-risoni" && "animate-[spin_18s_linear_infinite]",
                )}
              />
            ) : (
              <span className={cn("absolute inset-[38%] rounded-full", tone === "dark" ? "bg-grafite/40" : "bg-perola/50")} />
            )}
          </span>
        </Fragment>
      ))}
    </span>
  );

  return (
    <div aria-hidden className={cn("overflow-hidden py-[0.12em] text-[clamp(2.6rem,7.5vw,7.5rem)] leading-none", className)}>
      <motion.div className="flex w-max will-change-transform" style={{ x }}>
        {run}
        {run}
        {run}
        {run}
      </motion.div>
    </div>
  );
}
