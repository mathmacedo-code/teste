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
 * Vídeo de ambientação: sem áudio, em loop, playsinline.
 * - Só baixa o vídeo quando entra na tela (ou de imediato, se priority).
 * - Escolhe desktop/mobile antes de baixar (nunca as duas versões).
 * - Com "reduzir movimento" ou economia de dados, fica no poster.
 * - Pausa fora da tela para poupar bateria.
 */
export function AmbientVideo({ source, mobileSource, className, priority, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<VideoSource | null>(null);
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
        if (entry.isIntersecting) {
          if (!started) {
            started = true;
            setActive(pick());
          } else {
            el.play().catch(() => {});
          }
        } else if (started) {
          el.pause();
        }
      },
      { rootMargin: priority ? "0px" : "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [source, mobileSource, priority]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    el.muted = true;
    el.load();
    el.play().catch(() => {});
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
        preload="none"
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        onPlaying={() => setPlaying(true)}
      >
        {active && (
          <>
            <source src={active.webm} type='video/webm; codecs="vp9"' />
            <source src={active.mp4} type="video/mp4" />
          </>
        )}
      </video>
    </div>
  );
}
