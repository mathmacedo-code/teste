"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { img, type ImageKey } from "@/data/media";
import { cn } from "@/lib/cn";

type Props = {
  /** imagem recortada em círculo, com fundo transparente */
  k?: ImageKey;
  className?: string;
  sizes: string;
  /** quantos graus o prato gira enquanto atravessa a tela */
  turn?: number;
};

/**
 * Prato visto de cima, recortado, como elemento gráfico solto na página.
 * Gira devagar conforme o scroll e sobe um pouco (parallax), com sombra de
 * mesa. Decorativo: não entra na leitura de tela.
 */
export function PlateSpin({ k = "recorte-burrata", className, sizes, turn = 70 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  const rotate = useTransform(smooth, [0, 1], [-turn / 2, turn / 2]);
  const y = useTransform(smooth, [0, 1], ["12%", "-12%"]);

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none select-none", className)}>
      <motion.div
        className="relative aspect-square w-full"
        style={reduce ? undefined : { y }}
        initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* sombra fixa (a luz não gira junto com o prato) */}
        <div className="absolute inset-[4%] translate-x-[3%] translate-y-[5%] rounded-full bg-noite/35 blur-2xl" />
        <motion.div className="absolute inset-0" style={reduce ? undefined : { rotate }}>
          <Image src={img[k]} alt="" fill sizes={sizes} quality={85} className="object-contain" />
        </motion.div>
      </motion.div>
    </div>
  );
}
