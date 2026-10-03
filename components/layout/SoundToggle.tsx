"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { soundtrack } from "@/data/soundtrack";
import { cn } from "@/lib/cn";

/*
 * Botão de música. Nenhum navegador deixa um site tocar som sozinho, então a
 * trilha começa no toque da pessoa, com fade-in, em loop. Como fica no layout,
 * continua tocando ao navegar entre as páginas.
 * O fade usa Web Audio (GainNode): no iPhone o volume do <audio> não pode ser
 * alterado por código.
 */

type Chain = { el: HTMLAudioElement; ctx?: AudioContext; gain?: GainNode };

export function SoundToggle() {
  const [available, setAvailable] = useState(false);
  const [on, setOn] = useState(false);
  const [hint, setHint] = useState(false);
  const chain = useRef<Chain | null>(null);
  const wanted = useRef(false);

  // só mostra o botão se o arquivo existir
  useEffect(() => {
    fetch(soundtrack.src, { method: "HEAD" })
      .then((r) => r.ok && setAvailable(true))
      .catch(() => {});
  }, []);

  // convite discreto, uma vez por visita
  useEffect(() => {
    if (!available) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("vm-som-dica") === "1";
      sessionStorage.setItem("vm-som-dica", "1");
    } catch {}
    if (seen) return;
    const a = setTimeout(() => setHint(true), 2500);
    const b = setTimeout(() => setHint(false), 8000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [available]);

  const ramp = (to: number, seconds: number) => {
    const c = chain.current;
    if (!c) return;
    if (c.gain && c.ctx) {
      const g = c.gain.gain;
      const now = c.ctx.currentTime;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(to, now + seconds);
    } else {
      c.el.volume = to; // sem Web Audio: muda direto
    }
  };

  const setup = () => {
    if (chain.current) return chain.current;
    const el = new Audio(soundtrack.src);
    el.loop = true;
    el.preload = "auto";
    el.setAttribute("playsinline", "");
    const c: Chain = { el };
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) {
      try {
        const ctx = new AC();
        const gain = ctx.createGain();
        gain.gain.value = 0;
        ctx.createMediaElementSource(el).connect(gain).connect(ctx.destination);
        c.ctx = ctx;
        c.gain = gain;
      } catch {}
    } else {
      el.volume = 0;
    }
    chain.current = c;
    return c;
  };

  const start = () => {
    const c = setup();
    wanted.current = true;
    c.ctx?.resume();
    c.el
      .play()
      .then(() => {
        ramp(soundtrack.volume, 1.8);
        setOn(true);
      })
      .catch(() => {
        wanted.current = false;
        setOn(false);
      });
  };

  const stop = () => {
    const c = chain.current;
    wanted.current = false;
    setOn(false);
    if (!c) return;
    ramp(0, 0.7);
    setTimeout(() => !wanted.current && c.el.pause(), 750);
  };

  // pausa quando a pessoa sai da aba/app e volta a tocar ao retornar
  useEffect(() => {
    const onVis = () => {
      const c = chain.current;
      if (!c || !wanted.current) return;
      if (document.hidden) c.el.pause();
      else {
        c.ctx?.resume();
        c.el.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!available) return null;

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+14px)] left-4 z-40 flex items-center gap-3 md:bottom-8 md:left-8">
      <button
        type="button"
        onClick={() => {
          setHint(false);
          if (on) stop();
          else start();
        }}
        aria-pressed={on}
        aria-label={on ? `Desligar a música (${soundtrack.title})` : `Ligar a música (${soundtrack.title}, ${soundtrack.artist})`}
        className="flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-noite/85 px-4 text-perola shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] transition-colors duration-500 hover:bg-noite"
      >
        <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn("w-[2px] origin-bottom rounded-full bg-current", on ? "animate-[eq_1s_ease-in-out_infinite_alternate]" : "")}
              style={{ height: on ? "100%" : `${[40, 70, 50, 30][i]}%`, animationDelay: `${-i * 0.27}s` }}
            />
          ))}
        </span>
        <span className="hidden text-[0.8rem] tracking-[0.04em] sm:inline">{on ? "Som" : "Ouvir"}</span>
      </button>

      <AnimatePresence>
        {hint && !on && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none rounded-full bg-cal/95 px-3 py-1.5 text-[0.78rem] text-grafite shadow-md"
          >
            Ouça a trilha do Vila Medí
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
