"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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
 * A sombra fica fora do elemento que gira: a luz da sala não roda junto com o prato.
 * Decorativo: fica fora da leitura de tela.
 */
export function Cutout({ k, sizes, className, motion: mode = "spin", turn = 70, drift = 12, tilt = 0, shadow = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  const spin = mode === "spin" ? turn : turn / 6;
  const rotate = useTransform(p, [0, 1], [tilt - spin / 2, tilt + spin / 2]);
  const y = useTransform(p, [0, 1], [`${drift}%`, `-${drift}%`]);
  const src = img[k];

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none select-none", className)}>
      <motion.div
        className="relative w-full"
        style={{ aspectRatio: `${src.width} / ${src.height}`, y }}
        initial={{ opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* sombra de mesa pronta (gradiente): nada de filter, que pesa no celular a cada quadro */}
        {shadow && (
          <div
            className="absolute inset-[5%] translate-x-[2%] translate-y-[7%] rounded-full"
            style={{ background: "radial-gradient(closest-side, rgb(22 17 12 / 0.34), rgb(22 17 12 / 0.14) 62%, transparent)" }}
          />
        )}
        <motion.div className="absolute inset-0 will-change-transform" style={{ rotate }}>
          <Image src={src} alt="" fill sizes={sizes} quality={85} className="object-contain" />
        </motion.div>
      </motion.div>
    </div>
  );
}
