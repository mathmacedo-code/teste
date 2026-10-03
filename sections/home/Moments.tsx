"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Motion";
import { moments } from "@/data/moments";
import { cn } from "@/lib/cn";
import { SkyScene } from "@/sections/home/SkyScene";

/** O Vila Medí ao longo do dia. Desktop: lista + cena de céu e mar que muda de hora. Mobile: carrossel com snap. */
export function Moments() {
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const rail = useRef<HTMLUListElement>(null);

  // passa sozinho pelas horas do dia enquanto ninguém está interagindo com a lista
  useEffect(() => {
    if (hold) return;
    const t = setInterval(() => setActive((a) => (a + 1) % moments.length), 4200);
    return () => clearInterval(t);
  }, [hold]);

  // mobile: o carrossel avança sozinho enquanto está na tela; para de vez no primeiro toque
  useEffect(() => {
    const el = rail.current;
    if (!el || window.matchMedia("(min-width: 768px)").matches) return;
    let visible = false;
    let stopped = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    const stop = () => (stopped = true);
    el.addEventListener("touchstart", stop, { passive: true });
    const t = setInterval(() => {
      if (!visible || stopped) return;
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      const step = card.offsetWidth + 12;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, 3800);
    return () => {
      clearInterval(t);
      io.disconnect();
      el.removeEventListener("touchstart", stop);
    };
  }, []);

  return (
    <section id="momentos" className="bg-noite py-28 text-perola md:py-44">
      <div className="shell">
        <Reveal>
          <h2 className="display-l max-w-[14ch]">Cada encontro pede um Vila Medí.</h2>
        </Reveal>

        <div className="mt-20 hidden grid-cols-12 gap-6 md:grid">
          <ul className="col-span-5 self-center" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)}>
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
          <div className="relative col-span-6 col-start-7">
            <SkyScene moments={moments} active={active} className="arch-45 aspect-[4/5] w-full" />
            <p className="meta absolute inset-x-0 bottom-8 text-center text-perola/80">{moments[active].time}</p>
          </div>
        </div>

        <ul ref={rail} className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:hidden">
          {moments.map((m) => (
            <li key={m.id} className="w-[78vw] shrink-0 snap-start">
              <SkyScene moments={[m]} active={0} className="arch-34 aspect-[3/4]" />
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
