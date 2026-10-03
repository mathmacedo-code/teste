"use client";

import { useAnimationFrame, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Motion";
import { moments } from "@/data/moments";
import { cn } from "@/lib/cn";
import { DayScene } from "@/sections/home/DayScene";

/* Ritmo do dia (segundos): pausa em cada momento, viagem até o próximo e a madrugada mais rápida. */
const DWELL = 4.6;
const TRAVEL = 2.2;
const NIGHT = 5.5;
const DRIFT = 0.35; // o relógio continua andando (≈20 min) enquanto o momento está na tela

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

type Seg = { from: number; to: number; dur: number; idx: number; next: number; travel: boolean };
const SEGMENTS: Seg[] = moments.flatMap((m, i) => {
  const last = i === moments.length - 1;
  const nextHour = last ? moments[0].hour + 24 : moments[i + 1].hour;
  return [
    { from: m.hour, to: m.hour + DRIFT, dur: DWELL, idx: i, next: i, travel: false },
    { from: m.hour + DRIFT, to: nextHour, dur: last ? NIGHT : TRAVEL, idx: i, next: last ? 0 : i + 1, travel: true },
  ];
});
const TOTAL = SEGMENTS.reduce((a, s) => a + s.dur, 0);
const START = SEGMENTS.map((_, i) => SEGMENTS.slice(0, i).reduce((a, s) => a + s.dur, 0));

function at(t: number) {
  let i = 0;
  while (i < SEGMENTS.length - 1 && t >= START[i + 1]) i++;
  const s = SEGMENTS[i];
  const k = Math.min(1, (t - START[i]) / s.dur);
  const hour = s.from + (s.to - s.from) * (s.travel ? ease(k) : k);
  // na viagem, a legenda troca na metade do caminho
  return { hour, idx: s.travel && k > 0.5 ? s.next : s.idx };
}

const fmt = (h: number) => {
  const hh = ((h % 24) + 24) % 24;
  const H = Math.floor(hh);
  const M = Math.floor((hh - H) * 60);
  return `${String(H).padStart(2, "0")}h${String(M).padStart(2, "0")}`;
};

/**
 * Cada encontro pede um Vila Medí: um dia inteiro passa sozinho na paisagem
 * (sol, lua, mar, casas acendendo) e cada momento aparece na sua hora.
 * Toque/clique num momento para ir direto a ele.
 */
export function Moments() {
  const hour = useMotionValue(moments[0].hour);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const t = useRef(0);
  const visible = useRef(false);
  const hold = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!visible.current || hold.current || document.hidden) return;
    t.current = (t.current + Math.min(delta, 64) / 1000) % TOTAL;
    const r = at(t.current);
    hour.set(r.hour);
    if (r.idx !== activeRef.current) {
      activeRef.current = r.idx;
      setActive(r.idx);
    }
  });

  useMotionValueEvent(hour, "change", (h) => {
    if (clock.current) clock.current.textContent = fmt(h);
  });

  const jump = (i: number) => {
    t.current = START[i * 2];
    hour.set(moments[i].hour);
    activeRef.current = i;
    setActive(i);
  };

  const m = moments[active];

  return (
    <section id="momentos" className="bg-noite py-28 text-perola md:py-44">
      <div className="shell">
        <Reveal>
          <h2 className="display-l max-w-[14ch]">Cada encontro pede um Vila Medí.</h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-6">
          {/* a paisagem do dia */}
          <div ref={box} className="relative md:col-span-6 md:col-start-7 md:row-start-1 md:mx-auto md:w-full md:max-w-[62svh]">
            <div aria-hidden className="arch-45 pointer-events-none absolute -inset-[10px] border border-perola/25" />
            <div className="arch-45 relative aspect-[4/5] overflow-hidden">
              <DayScene hour={hour} className="absolute inset-0" />
              {/* o momento aparece na sua hora */}
              <div className="absolute inset-x-0 bottom-[17%] px-6 text-center text-perola [text-shadow:0_2px_16px_rgb(0_0_0/0.45)]">
                <p key={m.id} className="animate-[rise_1.1s_var(--ease-lux)_both] font-serif text-[clamp(2rem,6vw,3.6rem)] leading-none font-light italic">
                  {m.name}
                </p>
                {/* relógio: anda junto com o dia */}
                <span ref={clock} className="mt-3 block font-sans text-[0.8rem] tracking-[0.2em] tabular-nums opacity-85">
                  {fmt(moments[0].hour)}
                </span>
              </div>
            </div>
          </div>

          {/* desktop: lista dos momentos; mobile: legenda + linha do tempo */}
          <div className="md:col-span-5 md:row-start-1 md:self-center">
            <ul className="hidden md:block" onMouseLeave={() => (hold.current = false)}>
              {moments.map((x, i) => (
                <li key={x.id}>
                  <button
                    type="button"
                    onMouseEnter={() => {
                      hold.current = true;
                      jump(i);
                    }}
                    onFocus={() => jump(i)}
                    onClick={() => jump(i)}
                    aria-pressed={active === i}
                    className={cn(
                      "flex w-full cursor-pointer items-baseline justify-between gap-6 py-3 text-left transition-opacity duration-700",
                      active === i ? "opacity-100" : "opacity-35 hover:opacity-70",
                    )}
                  >
                    <span className="display-m">{x.name}</span>
                    <span className="meta shrink-0 tabular-nums opacity-70">{fmt(x.hour)}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div aria-live="polite" className="min-h-[7.5rem] md:mt-10 md:min-h-[4rem]">
              <p key={m.id} className="animate-[fade_0.9s_var(--ease-lux)] md:max-w-[34ch]">
                <span className="meta block opacity-60">{m.time}</span>
                <span className="lede mt-2 block opacity-90">{m.text}</span>
              </p>
            </div>

            {/* linha do tempo (mobile) */}
            <ol className="mt-6 grid grid-cols-6 border-t border-perola/15 md:hidden">
              {moments.map((x, i) => (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-label={`${x.name}, ${fmt(x.hour)}`}
                    className="flex w-full cursor-pointer flex-col items-center gap-2 pt-4 pb-2"
                  >
                    <span className={cn("h-2 w-2 rounded-full transition-all duration-700", active === i ? "scale-150 bg-perola" : "bg-perola/30")} />
                    <span className={cn("text-[0.7rem] tabular-nums transition-opacity duration-700", active === i ? "opacity-100" : "opacity-45")}>
                      {fmt(x.hour)}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
