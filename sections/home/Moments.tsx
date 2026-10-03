"use client";

import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Motion";
import { moments } from "@/data/moments";
import { cn } from "@/lib/cn";

/** O Vila Medí ao longo do dia. Desktop: lista + imagem que muda. Mobile: carrossel com snap. */
export function Moments() {
  const [active, setActive] = useState(0);

  return (
    <section id="momentos" className="bg-noite py-28 text-perola md:py-44">
      <div className="shell">
        <Reveal>
          <h2 className="display-l max-w-[14ch]">Cada encontro pede um Vila Medí.</h2>
        </Reveal>

        <div className="mt-20 hidden grid-cols-12 gap-6 md:grid">
          <ul className="col-span-5 self-center">
            {moments.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={cn(
                    "group flex w-full cursor-pointer items-baseline justify-between gap-6 py-3 text-left transition-opacity duration-700",
                    active === i ? "opacity-100" : "opacity-35 hover:opacity-70",
                  )}
                >
                  <span className="display-m">{m.name}</span>
                  <span className="meta shrink-0 opacity-70">{m.time}</span>
                </button>
              </li>
            ))}
            <li aria-live="polite" className="mt-10 min-h-[3.5rem] max-w-[34ch]">
              <p key={active} className="lede animate-[fade_0.9s_var(--ease-lux)] opacity-85">{moments[active].text}</p>
            </li>
          </ul>
          <div className="relative col-span-6 col-start-7 aspect-[4/5] overflow-hidden">
            {moments.map((m, i) => (
              <div
                key={m.id}
                className={cn(
                  "absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[var(--ease-lux)]",
                  active === i ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                )}
              >
                <Photo k={m.image} alt={m.alt} sizes="46vw" />
              </div>
            ))}
          </div>
        </div>

        <ul className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:hidden">
          {moments.map((m) => (
            <li key={m.id} className="w-[78vw] shrink-0 snap-start">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Photo k={m.image} alt={m.alt} sizes="78vw" />
              </div>
              <p className="display-m mt-5 text-[2rem]">{m.name}</p>
              <p className="meta mt-1 opacity-60">{m.time}</p>
              <p className="mt-3 text-[1rem] leading-relaxed opacity-85">{m.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
