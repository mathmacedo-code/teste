"use client";

import { motion } from "framer-motion";
import { Wordmark } from "@/components/brand/Logo";
import { HeroSequence } from "@/components/ui/HeroSequence";
import { Cta } from "@/components/ui/Cta";
import { EASE } from "@/components/ui/Motion";
import { video } from "@/data/media";

const lines = ["O Mediterrâneo", "encontra São Paulo."];

/** Hero: abre com o vídeo do salão e, em seguida, a chegada (escada rolante até a cozinha) fica bem mais tempo. Vertical no mobile. */
export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-noite text-perola">
      <HeroSequence
        clips={[
          { source: video.heroDesktop, mobileSource: video.heroMobile, plays: 1, label: "Ambientes do Vila Medí à noite: fachada, luminárias, mesas e coquetéis" },
          { source: video.chegadaDesktop, mobileSource: video.chegada, plays: 1, label: "A chegada ao Vila Medí: escada rolante, entrada, recepção, salão e cozinha" },
        ]}
      />
      <div aria-hidden className="scrim-bottom absolute inset-0" />

      <div className="shell relative flex h-full flex-col justify-end pb-[max(5.5rem,10vh)] md:pb-[max(6.5rem,11vh)]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.25, ease: EASE }}>
          <Wordmark className="w-[148px] md:w-[196px]" />
        </motion.div>

        <h1 className="display-xl mt-6 md:mt-8">
          <span className="sr-only">Vila Medí: </span>
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.5, delay: 0.45 + i * 0.14, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.05, ease: EASE }}
        >
          <p className="lede max-w-[36ch] opacity-90">
            Gastronomia, encontros e experiências em um dos endereços mais exclusivos da cidade.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <Cta href="/reservas" variant="light" event="reserve_click" location="hero">
              Reservar uma mesa
            </Cta>
            <Cta href="#vila-medi" variant="line">
              Conhecer o Vila Medí
            </Cta>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
