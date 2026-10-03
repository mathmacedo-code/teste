"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { img, type CutoutKey } from "@/data/media";
import { cn } from "@/lib/cn";

type Props = {
  k: CutoutKey;
  sizes: string;
  className?: string;
  /**
   * spin: gira em torno do centro conforme o scroll (pratos vistos de cima).
   * float: sobe e inclina levemente, como se pairasse (pratos em perspectiva).
   */
  motion?: "spin" | "float";
  /** graus de rotação ao longo da passagem pela tela */
  turn?: number;
  /** deslocamento vertical (parallax), em % da altura */
  drift?: number;
  /** inclinação inicial, em graus */
  tilt?: number;
  /** com sombra de mesa (desligue sobre fundos escuros, se quiser) */
  shadow?: boolean;
};

/**
 * Prato recortado (PNG sem fundo) como elemento gráfico solto na página.
 * A sombra fica no elemento que NÃO gira: a luz da sala não roda junto com o prato.
 * Decorativo: fica fora da leitura de tela.
 */
export function Cutout({ k, sizes, className, motion: mode = "spin", turn = 70, drift = 12, tilt = 0, shadow = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  const spin = mode === "spin" ? turn : turn / 6;
  const rotate = useTransform(p, [0, 1], [tilt - spin / 2, tilt + spin / 2]);
  const y = useTransform(p, [0, 1], [`${drift}%`, `-${drift}%`]);
  const src = img[k];

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none select-none", className)}>
      <motion.div
        className={cn("relative w-full", shadow && "[filter:drop-shadow(0_28px_30px_rgb(22_17_12/0.28))_drop-shadow(0_6px_8px_rgb(22_17_12/0.18))]")}
        style={{ aspectRatio: `${src.width} / ${src.height}`, ...(reduce ? {} : { y }) }}
        initial={{ opacity: 0, scale: reduce ? 1 : 0.88 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="absolute inset-0" style={reduce ? { rotate: tilt } : { rotate }}>
          <Image src={src} alt="" fill sizes={sizes} quality={85} className="object-contain" />
        </motion.div>
      </motion.div>
    </div>
  );
}
