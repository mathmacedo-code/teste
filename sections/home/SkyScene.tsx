import type { Moment } from "@/data/moments";
import { cn } from "@/lib/cn";

const HORIZON = 66; // % da altura

/** Onda contínua (2 períodos) que desliza para a esquerda, sem emenda. */
function Wave({ color, className, dur, amp, offset }: { color: string; className?: string; dur: string; amp: number; offset: number }) {
  const d = `M0 ${10 + offset} ${Array.from({ length: 8 }, (_, i) => `Q ${i * 50 + 25} ${10 + offset - amp * (i % 2 ? -1 : 1)} ${(i + 1) * 50} ${10 + offset}`).join(" ")} V 60 H 0 Z`;
  return (
    <div className={cn("absolute inset-x-0 h-[34%] overflow-hidden", className)}>
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="h-full w-[200%] animate-[swell_linear_infinite]" style={{ animationDuration: dur }}>
        <path d={d} style={{ fill: color, transition: "fill 1.4s var(--ease-lux)" }} />
      </svg>
    </div>
  );
}

/**
 * Cena de um momento do dia: degradê do céu, astro, reflexo e o mar se movendo.
 * Com `moments` + `active`, as camadas cruzam entre si (desktop). Com um só
 * momento, desenha a cena estática dele (cards do mobile).
 */
export function SkyScene({ moments, active, className }: { moments: Moment[]; active: number; className?: string }) {
  const sky = moments[active].sky;
  const b = sky.body;
  return (
    <div aria-hidden className={cn("relative isolate overflow-hidden", className)}>
      {moments.map((m, i) => (
        <div
          key={m.id}
          className={cn("absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-lux)]", i === active ? "opacity-100" : "opacity-0")}
          style={{ background: `linear-gradient(to bottom, ${m.sky.top}, ${m.sky.bottom} ${HORIZON}%)` }}
        />
      ))}

      {/* estrelas */}
      <div
        className={cn("absolute inset-x-0 top-0 transition-opacity duration-[1400ms]", sky.stars ? "opacity-100" : "opacity-0")}
        style={{
          height: `${HORIZON}%`,
          backgroundImage:
            "radial-gradient(1px 1px at 12% 22%, #fff9, transparent), radial-gradient(1px 1px at 34% 12%, #fff8, transparent), radial-gradient(1.5px 1.5px at 58% 30%, #fffa, transparent), radial-gradient(1px 1px at 82% 14%, #fff7, transparent), radial-gradient(1px 1px at 70% 44%, #fff6, transparent), radial-gradient(1.5px 1.5px at 22% 48%, #fff8, transparent), radial-gradient(1px 1px at 90% 36%, #fff6, transparent), radial-gradient(1px 1px at 46% 8%, #fff7, transparent)",
        }}
      />

      {/* astro */}
      <div
        className="absolute rounded-full transition-all duration-[1600ms] ease-[var(--ease-lux)]"
        style={{
          left: `${b.x}%`,
          top: `${b.y}%`,
          width: `${b.size}%`,
          aspectRatio: "1",
          translate: "-50% -50%",
          background: b.color,
          boxShadow: `0 0 60px 18px ${b.glow}, 0 0 160px 60px ${b.glow.replace(/[\d.]+\)$/, "0.25)")}`,
        }}
      />

      {/* reflexo do astro no mar */}
      <div
        className="absolute w-[14%] transition-all duration-[1600ms] ease-[var(--ease-lux)]"
        style={{
          left: `${b.x}%`,
          top: `${HORIZON}%`,
          height: "30%",
          translate: "-50% 0",
          background: `linear-gradient(to bottom, ${b.glow}, transparent)`,
          filter: "blur(10px)",
          opacity: b.y > 50 ? 0.9 : 0.5,
        }}
      />

      {/* mar: três camadas em velocidades diferentes */}
      <div className="absolute inset-x-0 bottom-0" style={{ top: `${HORIZON - 2}%` }}>
        <Wave color={sky.sea} className="top-0 opacity-70" dur="26s" amp={2} offset={0} />
        <Wave color={sky.sea} className="top-[22%] opacity-85" dur="19s" amp={3} offset={2} />
        <div className="absolute inset-x-0 top-[40%] bottom-0 transition-colors duration-[1400ms]" style={{ background: sky.sea }} />
        <Wave color={sky.sea} className="top-[30%]" dur="14s" amp={4} offset={4} />
      </div>

      {/* granulado leve: dá textura de impressão */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
    </div>
  );
}
