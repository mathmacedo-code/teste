"use client";

import Image from "next/image";
import { useAnimationFrame, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Motion";
import { OliveBranch } from "@/components/ui/Motifs";
import { img } from "@/data/media";
import { moments } from "@/data/moments";
import { cn } from "@/lib/cn";
import { fmtHour, mix, moonAt, paletteAt, sunAt } from "@/lib/daylight";

/* Ritmo do dia (segundos): pausa em cada momento, viagem até o próximo e a madrugada mais rápida. */
const DWELL = 4.8;
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
  // na viagem, a foto e a legenda trocam na metade do caminho
  return { hour, idx: s.travel && k > 0.5 ? s.next : s.idx };
}

const INK_DARK = "#2a2723";
const INK_LIGHT = "#efe8dc";
const SKY = 0.84; // fração da altura da seção ocupada pelo céu (o resto é mar)

/**
 * Cada encontro pede um Vila Medí. O fundo da seção é o céu de um dia inteiro:
 * as cores mudam com a hora, o sol e a lua atravessam, o mar reflete a luz.
 * Na frente, a foto de cada momento aparece na sua hora. Toque num momento para ir até ele.
 */
export function Moments() {
  const hour = useMotionValue(moments[0].hour);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const t = useRef(0);
  const visible = useRef(false);
  const hold = useRef(false);
  const section = useRef<HTMLElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const sun = useRef<HTMLDivElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const glint = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);

  const paint = (h: number) => {
    const p = paletteAt(h);
    const st = sky.current?.style;
    if (st) {
      st.setProperty("--sky-top", p.skyTop);
      st.setProperty("--sky-bottom", p.skyBottom);
      st.setProperty("--sea", p.sea);
      st.setProperty("--far", p.far);
      st.setProperty("--glow", p.glow);
      st.setProperty("--stars", String(p.stars));
    }
    const ink = mix(INK_DARK, INK_LIGHT, p.ink);
    if (content.current) content.current.style.color = ink;

    const s = sunAt(h);
    const m = moonAt(h);
    if (sun.current) {
      sun.current.style.transform = `translate(${s.x * 100}cqw, ${s.y * SKY * 100}cqh) translate(-50%, -50%)`;
      sun.current.style.background = mix("#ffb25c", "#fff6dc", Math.min(1, s.up * 1.6));
    }
    if (moon.current) moon.current.style.transform = `translate(${m.x * 100}cqw, ${m.y * SKY * 100}cqh) translate(-50%, -50%)`;
    // brilho no mar embaixo do astro que estiver no céu
    const body = s.visible ? s : m;
    if (glint.current) {
      glint.current.style.left = `${body.x * 100}%`;
      glint.current.style.opacity = String(body.visible ? (s.visible ? 0.35 + (1 - s.up) * 0.55 : 0.4) : 0);
    }
  };

  useEffect(() => {
    paint(hour.get());
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.1 });
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
    paint(h);
    if (clock.current) clock.current.textContent = fmtHour(h);
  });

  const jump = (i: number) => {
    t.current = START[i * 2];
    hour.set(moments[i].hour);
    activeRef.current = i;
    setActive(i);
  };

  const m = moments[active];

  return (
    <section ref={section} id="momentos" className="relative isolate overflow-hidden pt-28 pb-[22vh] md:pt-40 md:pb-[26vh]">
      {/* ===== céu do dia (fundo) ===== */}
      <div ref={sky} aria-hidden className="absolute inset-0 -z-10 [container-type:size]">
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, var(--sky-top), var(--sky-bottom) ${SKY * 100}%)` }} />
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: `${SKY * 100}%`,
            opacity: "var(--stars)",
            backgroundImage:
              "radial-gradient(1px 1px at 8% 14%, #fffc, transparent), radial-gradient(1px 1px at 22% 30%, #fff9, transparent), radial-gradient(1.5px 1.5px at 37% 9%, #fffd, transparent), radial-gradient(1px 1px at 51% 24%, #fff9, transparent), radial-gradient(1px 1px at 64% 12%, #fffb, transparent), radial-gradient(1.5px 1.5px at 78% 33%, #fffc, transparent), radial-gradient(1px 1px at 91% 18%, #fff9, transparent), radial-gradient(1px 1px at 15% 52%, #fff8, transparent), radial-gradient(1px 1px at 45% 46%, #fff8, transparent), radial-gradient(1px 1px at 86% 58%, #fff8, transparent), radial-gradient(1.5px 1.5px at 70% 66%, #fff9, transparent), radial-gradient(1px 1px at 29% 70%, #fff7, transparent)",
          }}
        />
        {/* sol e lua */}
        <div
          ref={sun}
          className="absolute top-0 left-0 h-[clamp(52px,7vw,96px)] w-[clamp(52px,7vw,96px)] rounded-full will-change-transform"
          style={{ boxShadow: "0 0 60px 22px var(--glow), 0 0 180px 80px color-mix(in srgb, var(--glow) 35%, transparent)" }}
        />
        <div
          ref={moon}
          className="absolute top-0 left-0 h-[clamp(34px,4.4vw,58px)] w-[clamp(34px,4.4vw,58px)] rounded-full bg-[#efe8dc] will-change-transform"
          style={{ boxShadow: "0 0 40px 10px rgb(200 212 255 / 0.35), inset -6px -4px 0 rgb(0 0 0 / 0.06)" }}
        />
        {/* mar com ilhas no horizonte */}
        <div className="absolute inset-x-0 bottom-0" style={{ top: `${SKY * 100}%`, background: "var(--sea)" }}>
          <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="absolute bottom-full left-0 h-[clamp(18px,3vw,40px)] w-full">
            <path d="M0 20 L0 14 Q30 4 62 11 Q84 6 110 15 L118 20 Z M228 20 Q262 2 300 9 Q330 0 362 8 Q384 4 400 9 L400 20 Z" style={{ fill: "var(--far)" }} />
          </svg>
          <div ref={glint} className="absolute top-0 h-full w-[clamp(40px,8vw,120px)] -translate-x-1/2" style={{ background: "radial-gradient(50% 100% at 50% 0%, var(--glow), transparent)" }} />
          <svg viewBox="0 0 800 60" preserveAspectRatio="none" className="absolute inset-x-0 top-[18%] h-[60%] w-[200%] opacity-25 swell-wide" fill="none" stroke="#fff" strokeWidth="1" vectorEffect="non-scaling-stroke">
            <path d="M0 8 q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" vectorEffect="non-scaling-stroke" />
            <path d="M0 30 q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" vectorEffect="non-scaling-stroke" />
            <path d="M0 52 q25 -5 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        {/* ramo de oliveira no canto */}
        <div className="absolute -top-6 -right-8 w-[clamp(170px,22vw,340px)] rotate-[160deg]" style={{ color: "var(--far)" }}>
          <OliveBranch className="sway-branch opacity-40" />
        </div>
      </div>

      {/* ===== conteúdo ===== */}
      <div ref={content} className="shell transition-colors duration-300">
        <Reveal>
          <h2 className="display-l max-w-[14ch]">Cada encontro pede um Vila Medí.</h2>
        </Reveal>

        <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:gap-6">
          {/* foto do momento */}
          <div className="md:col-span-6 md:col-start-7 md:row-start-1">
            <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-noite shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] md:max-w-[min(100%,60svh)]">
              {moments.map((x, i) => (
                <div
                  key={x.id}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-lux)]",
                    i === active ? "opacity-100" : "opacity-0",
                  )}
                >
                  <Image
                    src={img[x.image]}
                    alt={x.alt}
                    fill
                    sizes="(min-width: 768px) 46vw, 92vw"
                    quality={80}
                    className={cn("object-cover", i === active && "animate-[kenburns_7.5s_ease-out_both]")}
                  />
                </div>
              ))}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-noite/75 via-noite/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-perola md:p-8">
                <p key={m.id} className="animate-[rise_1.1s_var(--ease-lux)_both] font-serif text-[clamp(2.1rem,5.4vw,3.4rem)] leading-none font-light italic">
                  {m.name}
                </p>
                <span ref={clock} className="mt-3 block text-[0.8rem] tracking-[0.2em] tabular-nums opacity-85">
                  {fmtHour(moments[0].hour)}
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
                      active === i ? "opacity-100" : "opacity-40 hover:opacity-75",
                    )}
                  >
                    <span className="display-m">{x.name}</span>
                    <span className="meta shrink-0 tabular-nums opacity-70">{fmtHour(x.hour)}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div aria-live="polite" className="min-h-[6.5rem] md:mt-10 md:min-h-[4rem]">
              <p key={m.id} className="animate-[fade_0.9s_var(--ease-lux)] md:max-w-[34ch]">
                <span className="meta block opacity-70">{m.time}</span>
                <span className="lede mt-2 block">{m.text}</span>
              </p>
            </div>

            {/* linha do tempo (mobile) */}
            <ol className="mt-4 grid grid-cols-6 border-t border-current/20 md:hidden">
              {moments.map((x, i) => (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-label={`${x.name}, ${fmtHour(x.hour)}`}
                    className="flex w-full cursor-pointer flex-col items-center gap-2 pt-4 pb-2"
                  >
                    <span className={cn("h-2 w-2 rounded-full bg-current transition-all duration-700", active === i ? "scale-150 opacity-100" : "opacity-30")} />
                    <span className={cn("text-[0.7rem] tabular-nums transition-opacity duration-700", active === i ? "opacity-100" : "opacity-50")}>
                      {fmtHour(x.hour)}
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
