"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { video } from "@/data/media";

/**
 * Seção cinematográfica: o arco do logo vira uma janela para a noite do Vila Medí.
 * Conforme o scroll, a janela cresce e as frases se afastam (sem prender o scroll).
 */
export function Cinematic() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.65], [0.66, 1]);
  const inner = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const left = useTransform(scrollYProgress, [0, 0.65], ["6%", "0%"]);
  const right = useTransform(scrollYProgress, [0, 0.65], ["-6%", "0%"]);
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.4], [0.25, 1]);

  return (
    <section ref={ref} aria-label="De São Paulo para o Mediterrâneo" className="relative h-[175vh] bg-noite text-perola">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-6 overflow-hidden md:flex-row md:gap-10">
        <motion.p
          style={{ x: left, opacity: textOpacity }}
          className="display-l text-center md:flex-1 md:text-right"
          aria-hidden
        >
          De São Paulo
        </motion.p>

        <motion.div style={{ scale }} className="relative shrink-0">
          {/* contorno externo: a linha dupla do arco do emblema */}
          <div aria-hidden className="arch absolute -inset-[10px] border border-perola/30" />
          <div className="arch relative aspect-[9/16] h-[min(60svh,112vw)] overflow-hidden md:h-[82svh]">
            <motion.div className="absolute inset-0" style={{ scale: inner }}>
              <AmbientVideo source={video.noite} label="Noite no Vila Medí: bar, coquetéis, música e luminárias" />
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          style={{ x: right, opacity: textOpacity }}
          className="display-l text-center md:flex-1 md:text-left"
        >
          <span className="sr-only">De São Paulo </span>para o Mediterrâneo.
        </motion.p>
      </div>
    </section>
  );
}
