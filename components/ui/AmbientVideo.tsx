"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoSource } from "@/data/media";
import { cn } from "@/lib/cn";

type Props = {
  source: VideoSource;
  /** versão vertical/leve para telas < 768px */
  mobileSource?: VideoSource;
  className?: string;
  /** hero: carrega imediatamente e prioriza o poster (LCP) */
  priority?: boolean;
  /** descrição para leitores de tela; vazio = decorativo */
  label?: string;
};

/**
 * Safari (iOS e macOS) toca H.264 por hardware; WebM/VP9 ali é decodificado por
 * software ou nem toca — então Apple recebe só o MP4. Os demais navegadores
 * continuam preferindo o WebM, que é mais leve.
 */
function isApple() {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua));
}

/**
 * O iOS recusa autoplay em algumas situações (Modo de Pouca Energia, economia
 * de dados, primeira visita em certos contextos). Nesses casos o play() é
 * rejeitado; os vídeos ficam numa fila e começam no primeiro toque na página.
 */
const waiting = new Set<HTMLVideoElement>();
let gestureBound = false;
function playOnFirstGesture(el: HTMLVideoElement) {
  waiting.add(el);
  if (gestureBound) return;
  gestureBound = true;
  const resume = () => {
    waiting.forEach((v) => {
      if (v.isConnected && v.dataset.visible === "1") v.play().catch(() => {});
    });
    waiting.clear();
    gestureBound = false;
    events.forEach((e) => window.removeEventListener(e, resume, true));
  };
  const events = ["touchend", "click", "keydown"] as const;
  events.forEach((e) => window.addEventListener(e, resume, { capture: true, passive: true }));
}

function tryPlay(el: HTMLVideoElement) {
  // o iOS exige que o vídeo esteja mudo de fato (propriedade + atributo) para autoplay
  el.muted = true;
  el.defaultMuted = true;
  el.setAttribute("muted", "");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
  const p = el.play();
  if (p) p.catch(() => playOnFirstGesture(el));
}

/**
 * Vídeo de ambientação: sem áudio, em loop, playsinline.
 * - Só baixa o vídeo quando entra na tela (ou de imediato, se priority).
 * - Escolhe desktop/mobile antes de baixar (nunca as duas versões).
 * - Com "reduzir movimento" ou economia de dados, fica no poster.
 * - Pausa fora da tela para poupar bateria.
 */
export function AmbientVideo({ source, mobileSource, className, priority, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<{ src: VideoSource; mp4Only: boolean } | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) return;
    const pick = () =>
      mobileSource && !window.matchMedia("(min-width: 768px)").matches ? mobileSource : source;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.visible = entry.isIntersecting ? "1" : "0";
        if (entry.isIntersecting) {
          if (!started) {
            started = true;
            setActive({ src: pick(), mp4Only: isApple() });
          } else {
            tryPlay(el);
          }
        } else if (started) {
          el.pause();
        }
      },
      { rootMargin: priority ? "0px" : "300px 0px" },
    );
    io.observe(el);

    // ao voltar para a aba/app o iOS pausa os vídeos; retoma os visíveis
    const onVisibility = () => {
      if (document.visibilityState === "visible" && started && el.dataset.visible === "1" && el.paused) tryPlay(el);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onVisibility);
    return () => {
      io.disconnect();
      waiting.delete(el);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onVisibility);
    };
  }, [source, mobileSource, priority]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    el.load();
    tryPlay(el);
  }, [active]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <picture>
        {mobileSource && <source media="(max-width: 767px)" srcSet={mobileSource.poster} type="image/webp" />}
        <img
          src={source.poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
      <video
        ref={ref}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-[var(--ease-lux)]",
          playing ? "opacity-100" : "opacity-0",
        )}
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload="none"
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        onPlaying={() => setPlaying(true)}
      >
        {active && (
          <>
            {!active.mp4Only && <source src={active.src.webm} type='video/webm; codecs="vp9"' />}
            <source src={active.src.mp4} type="video/mp4" />
          </>
        )}
      </video>
    </div>
  );
}
