"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoSource } from "@/data/media";
import { cn } from "@/lib/cn";

type Props = {
  source: VideoSource;
  /** versão vertical/leve para telas < 768px */
  mobileSource?: VideoSource;
  className?: string;
  /** hero: começa a tocar sozinho, sem esperar o JavaScript */
  priority?: boolean;
  /** descrição para leitores de tela; vazio = decorativo */
  label?: string;
};

/*
 * Por que é feito assim (celulares, iPhone em especial):
 * - Só MP4 H.264: é o único formato que todo celular decodifica por hardware.
 * - As <source> já vêm no HTML; o próprio navegador escolhe a versão mobile
 *   pelo atributo media. Nada de trocar src depois de montado.
 * - O <video> fica sempre visível (opacidade 1). O poster é uma imagem POR CIMA
 *   que some quando o vídeo começa. O WebKit não dá autoplay para vídeos que
 *   considera invisíveis, então o vídeo nunca pode estar transparente.
 * - Mudo de verdade: propriedade + atributo, antes de qualquer play().
 * - Se o sistema bloquear o autoplay (Modo de Pouca Energia, economia de dados),
 *   o primeiro toque na página libera TODOS os vídeos de uma vez.
 */

const all = new Set<HTMLVideoElement>();
let unlockBound = false;

function prep(el: HTMLVideoElement) {
  el.muted = true;
  el.defaultMuted = true;
  el.playsInline = true;
  el.setAttribute("muted", "");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
}

function tryPlay(el: HTMLVideoElement) {
  prep(el);
  const p = el.play();
  if (p) p.catch(() => bindUnlock());
}

function bindUnlock() {
  if (unlockBound) return;
  unlockBound = true;
  const events = ["touchend", "pointerup", "click", "keydown"] as const;
  const unlock = () => {
    events.forEach((e) => window.removeEventListener(e, unlock, true));
    unlockBound = false;
    all.forEach((v) => {
      if (!v.isConnected) return;
      prep(v);
      // dentro do gesto: o play() concede permissão ao elemento; os que estão fora da tela pausam em seguida
      v.play()
        .then(() => {
          if (v.dataset.visible !== "1") v.pause();
        })
        .catch(() => {});
    });
  };
  events.forEach((e) => window.addEventListener(e, unlock, { capture: true, passive: true }));
}

/**
 * Vídeo de ambientação: sem áudio, em loop, inline.
 * - Fora do hero, só baixa quando chega perto da tela.
 * - Pausa fora da tela (bateria) e retoma ao voltar.
 * - Com "reduzir movimento" ativado no aparelho, fica no poster.
 */
export function AmbientVideo({ source, mobileSource, className, priority, label }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const box = wrap.current;
    if (!el || !box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.pause();
      return;
    }
    prep(el);
    all.add(el);

    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.visible = entry.isIntersecting ? "1" : "0";
        if (entry.isIntersecting) tryPlay(el);
        else if (!el.paused) el.pause();
      },
      { rootMargin: priority ? "0px" : "200px 0px" },
    );
    io.observe(box);

    // o iOS pausa tudo ao trocar de app/aba
    const resume = () => {
      if (document.visibilityState === "visible" && el.dataset.visible === "1" && el.paused) tryPlay(el);
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    return () => {
      io.disconnect();
      all.delete(el);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
    };
  }, [priority]);

  return (
    <div ref={wrap} className={cn("absolute inset-0 overflow-hidden", className)}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        autoPlay={priority}
        preload={priority ? "auto" : "none"}
        disablePictureInPicture
        disableRemotePlayback
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        onPlaying={() => setPlaying(true)}
      >
        {mobileSource && <source src={mobileSource.mp4} type="video/mp4" media="(max-width: 767px)" />}
        <source src={source.mp4} type="video/mp4" />
      </video>
      <picture>
        {mobileSource && <source media="(max-width: 767px)" srcSet={mobileSource.poster} type="image/webp" />}
        <img
          src={source.poster}
          alt=""
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-[var(--ease-lux)]",
            playing && "opacity-0",
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    </div>
  );
}
