"use client";

import { useEffect, useRef, useState } from "react";
import { prep, registerVideo, tryPlay } from "@/components/ui/AmbientVideo";
import type { VideoSource } from "@/data/media";
import { cn } from "@/lib/cn";

type Clip = {
  source: VideoSource;
  mobileSource?: VideoSource;
  /** quantas vezes o clipe roda antes de passar para o próximo */
  plays: number;
  label: string;
};

const FADE = 1200;

/**
 * Abertura em sequência: o primeiro clipe roda uma vez e, em seguida, o
 * segundo entra e fica bem mais tempo na tela (várias voltas); depois recomeça.
 *
 * A troca sempre revela o próximo vídeo POR BAIXO e esmaece o que está por
 * cima. Assim nenhum vídeo começa a tocar transparente (o iPhone recusa
 * tocar vídeo que considera invisível).
 */
export function HeroSequence({ clips, className }: { clips: Clip[]; className?: string }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const [front, setFront] = useState(0);
  const [fading, setFading] = useState(false);
  const [started, setStarted] = useState(false);
  const frontRef = useRef(0);
  const count = useRef(0);
  const inView = useRef(true);

  const go = (next: number) => {
    const cur = frontRef.current;
    const nv = refs.current[next];
    if (!nv || next === cur) return;
    nv.currentTime = 0;
    nv.dataset.visible = "1";
    tryPlay(nv);
    setFading(true);
    window.setTimeout(() => {
      const old = refs.current[cur];
      if (old) {
        old.pause();
        old.dataset.visible = "0";
      }
      frontRef.current = next;
      count.current = 0;
      setFront(next);
      setFading(false);
    }, FADE);
  };

  useEffect(() => {
    const vids = refs.current.filter(Boolean) as HTMLVideoElement[];
    const offs = vids.map((v, i) => {
      prep(v);
      v.dataset.visible = i === 0 ? "1" : "0";
      return registerVideo(v);
    });
    const first = vids[0];
    if (first) tryPlay(first);

    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      const v = refs.current[frontRef.current];
      if (!v) return;
      if (e.isIntersecting) tryPlay(v);
      else v.pause();
    });
    if (box.current) io.observe(box.current);

    const resume = () => {
      const v = refs.current[frontRef.current];
      if (v && document.visibilityState === "visible" && inView.current && v.paused) tryPlay(v);
    };
    document.addEventListener("visibilitychange", resume);
    return () => {
      offs.forEach((off) => off());
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
    };
  }, []);

  const onEnded = (i: number) => {
    if (i !== frontRef.current) return;
    count.current += 1;
    const v = refs.current[i];
    if (count.current < clips[i].plays && v) {
      v.currentTime = 0;
      tryPlay(v);
    } else {
      go((i + 1) % clips.length);
    }
  };

  return (
    <div ref={box} className={cn("absolute inset-0 isolate overflow-hidden", className)}>
      {clips.map((c, i) => (
        <div
          key={c.source.mp4}
          className={cn(
            "absolute inset-0 transition-opacity ease-[var(--ease-lux)]",
            i === front ? "z-10" : "z-0",
            i === front && fading ? "opacity-0" : "opacity-100",
          )}
          style={{ transitionDuration: `${FADE}ms` }}
        >
          <video
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            autoPlay={i === 0}
            preload={i === 0 ? "auto" : started ? "auto" : "metadata"}
            disablePictureInPicture
            disableRemotePlayback
            aria-label={c.label}
            onPlaying={() => i === 0 && setStarted(true)}
            onEnded={() => onEnded(i)}
          >
            {c.mobileSource && <source src={c.mobileSource.mp4} type="video/mp4" media="(max-width: 767px)" />}
            <source src={c.source.mp4} type="video/mp4" />
          </video>
          {/* capa do primeiro clipe até ele começar */}
          {i === 0 && (
            <picture>
              {c.mobileSource && <source media="(max-width: 767px)" srcSet={c.mobileSource.poster} type="image/webp" />}
              <img
                src={c.source.poster}
                alt=""
                aria-hidden
                loading="eager"
                fetchPriority="high"
                className={cn(
                  "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms]",
                  started && "opacity-0",
                )}
              />
            </picture>
          )}
        </div>
      ))}
    </div>
  );
}
