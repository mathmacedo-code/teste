"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { LemonBranch, Meander, TileField, WaveLines } from "@/components/ui/Motifs";
import { Photo } from "@/components/ui/Photo";
import type { Dish } from "@/data/dishes";
import { cn } from "@/lib/cn";

/** Cor e motivo de cada casa no cartão do prato. */
const HOUSE: Record<string, { card: string; motif: "lemon" | "greek" | "sea" }> = {
  "Temperani Amalfi": { card: "bg-[#efe3c6] text-grafite", motif: "lemon" },
  "MII Mar": { card: "bg-[#e5ecf3] text-[#14284a]", motif: "greek" },
  "Cru Oyster Bar": { card: "bg-noite text-perola", motif: "sea" },
};

function Motif({ kind }: { kind: "lemon" | "greek" | "sea" }) {
  if (kind === "lemon")
    return (
      <div className="absolute -top-6 -right-10 w-[min(62%,300px)] rotate-[200deg] text-[#7d6a1e]">
        <LemonBranch className="sway-branch opacity-45" />
      </div>
    );
  if (kind === "greek")
    return (
      <>
        <Meander className="absolute inset-x-0 top-0 text-azul opacity-40" />
        <TileField size={56} className="absolute -right-6 -bottom-6 h-[45%] w-[60%] text-azul opacity-25 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      </>
    );
  return <WaveLines className="absolute inset-x-0 bottom-0 h-[38%] text-perola opacity-[0.1] [mask-image:linear-gradient(to_top,black,transparent)]" />;
}

function Card({ dish, i, n, progress }: { dish: Dish; i: number; n: number; progress: MotionValue<number> }) {
  const theme = HOUSE[dish.house] ?? HOUSE["Temperani Amalfi"];
  // o cartão recua um pouco quando os próximos sobem por cima
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.045]);
  return (
    <div
      className="sticky h-[min(78svh,660px)] md:h-[min(76vh,700px)]"
      style={{ top: `calc(88px + ${i * 14}px)`, marginBottom: i < n - 1 ? "var(--stack-gap)" : 0 }}
    >
      <motion.article
        style={{ scale, transformOrigin: "50% 0%" }}
        className={cn(
          "relative grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-[4px] shadow-[0_24px_60px_-28px_rgb(22_17_12/0.55)] md:grid-cols-[1.2fr_1fr] md:grid-rows-1",
          theme.card,
        )}
      >
        <motion.div
          className="relative order-2 overflow-hidden md:order-none"
          initial={{ clipPath: "inset(0 0 12% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Photo k={dish.image} alt={dish.alt} sizes="(min-width: 768px) 55vw, 92vw" quality={85} />
        </motion.div>
        {/* no celular o texto vem em cima: o próximo cartão sobe por baixo e cobre a foto por último */}
        <div className="relative order-1 flex flex-col justify-start overflow-hidden px-6 pt-6 pb-5 md:order-none md:justify-center md:p-14">
          <Motif kind={theme.motif} />
          <div className="relative">
            <p className="meta flex items-center gap-3 opacity-70">
              <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-current opacity-40" />
              <span>{dish.house}</span>
            </p>
            <h3 className="display-m mt-2 md:mt-5">{dish.name}</h3>
            <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-relaxed opacity-85 md:mt-6 md:text-[1.1rem]">{dish.description}</p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

/**
 * Pratos em cartões que se empilham com o scroll: cada novo prato sobe e
 * cobre o anterior, que recua levemente. Cada cartão leva a cor e o motivo
 * mediterrâneo da sua casa.
 */
export function DishStack({ dishes, className }: { dishes: Dish[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className={cn("relative [--stack-gap:36vh] md:[--stack-gap:18vh]", className)}>
      {dishes.map((d, i) => (
        <Card key={d.id} dish={d} i={i} n={dishes.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}
