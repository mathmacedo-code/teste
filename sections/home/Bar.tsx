"use client";

import { useEffect, useRef } from "react";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { CandleGlow } from "@/components/ui/CandleGlow";
import { Reveal } from "@/components/ui/Motion";
import { Photo } from "@/components/ui/Photo";
import { video, type ImageKey, type VideoKey } from "@/data/media";
import { cn } from "@/lib/cn";

type Slide =
  | { kind: "photo"; k: ImageKey; alt: string; caption: string }
  | { kind: "video"; v: VideoKey; label: string; caption: string };

const slides: Slide[] = [
  { kind: "video", v: "drinkTaca", label: "Coquetel sendo servido na taça, com casca de laranja", caption: "Servido na taça" },
  { kind: "photo", k: "bar-1", alt: "Bar central com balcão de madeira iluminado e luminárias de palha", caption: "O balcão" },
  { kind: "photo", k: "bar-3", alt: "Vista do bar central com banquetas de madeira e luminárias de palha", caption: "Bar central" },
  { kind: "video", v: "drinkSpritz", label: "Spritz sendo montado com gelo e casca de laranja", caption: "Spritz da casa" },
  { kind: "photo", k: "bar-2", alt: "Balcão do bar com garrafas iluminadas e taças prontas", caption: "Luz baixa" },
];

/**
 * O bar central: carrossel com fotos do balcão e vídeos dos drinks sendo
 * montados. Desliza sozinho enquanto está na tela; para no primeiro toque.
 */
export function Bar() {
  const rail = useRef<HTMLUListElement>(null);
  const stopped = useRef(false);

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const w = card.offsetWidth + 16;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    const left = dir === 1 && atEnd ? 0 : dir === -1 && atStart ? el.scrollWidth : el.scrollLeft + dir * w;
    el.scrollTo({ left, behavior: "smooth" });
  };

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    const stop = () => (stopped.current = true);
    el.addEventListener("touchstart", stop, { passive: true });
    el.addEventListener("pointerdown", stop);
    const t = setInterval(() => visible && !stopped.current && step(1), 4200);
    return () => {
      clearInterval(t);
      io.disconnect();
      el.removeEventListener("touchstart", stop);
      el.removeEventListener("pointerdown", stop);
    };
  }, []);

  return (
    <section id="bar" className="relative overflow-hidden bg-noite py-28 text-perola md:py-40">
      <CandleGlow />
      <div className="shell relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="meta opacity-60">Bar central</p>
          <h2 className="display-l mt-4 max-w-[13ch]">Onde a noite começa.</h2>
          <p className="lede mt-6 max-w-[40ch] opacity-85">
            Clássicos bem executados e coquetéis autorais assinados por Rafael Welbert, num balcão de madeira sob as luminárias de palha.
          </p>
        </Reveal>
        <div className="hidden gap-3 md:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                stopped.current = true;
                step(d);
              }}
              aria-label={d === 1 ? "Próximo" : "Anterior"}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-perola/30 transition-colors duration-500 hover:bg-perola hover:text-noite"
            >
              <svg viewBox="0 0 24 24" className={cn("h-4 w-4", d === -1 && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={rail}
        className="no-scrollbar relative mt-12 flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,4vw,4rem)] gap-4 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] md:mt-16"
      >
        {slides.map((s, i) => (
          <li key={i} className={cn("w-[78vw] shrink-0 snap-start md:w-[min(30vw,440px)]", i % 2 === 1 && "md:mt-14")}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-[#211a13]">
              {s.kind === "video" ? (
                <AmbientVideo source={video[s.v]} label={s.label} />
              ) : (
                <Photo k={s.k} alt={s.alt} sizes="(min-width: 768px) 30vw, 78vw" quality={85} />
              )}
            </div>
            <p className="meta mt-4 flex items-center gap-3 opacity-70">
              <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="h-px w-6 bg-current opacity-40" />
              {s.caption}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
