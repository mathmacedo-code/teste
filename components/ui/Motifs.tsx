"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useId, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Motivos mediterrâneos em traço fino (herdam a cor do texto: currentColor).
 * Ramos de oliveira e limão-siciliano, faixa grega, azulejo de maiólica e ondas.
 * Todos decorativos (aria-hidden).
 */

type P = { className?: string; style?: CSSProperties };

/** ponto e direção (graus) de uma curva de Bézier cúbica */
function bez(p: number[], t: number) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = p;
  const u = 1 - t;
  const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
  const y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
  const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2);
  const dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2);
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
}

function Leaf({ x, y, a, len, w }: { x: number; y: number; a: number; len: number; w: number }) {
  return (
    <path
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})`}
      d={`M0 0 C${len * 0.3} ${-w} ${len * 0.72} ${-w} ${len} 0 C${len * 0.72} ${w} ${len * 0.3} ${w} 0 0 Z M${len * 0.08} 0 L${len * 0.86} 0`}
    />
  );
}

/** Ramo de oliveira: folhas estreitas e azeitonas. */
export function OliveBranch({ className, style }: P) {
  const stem = [6, 128, 70, 112, 150, 72, 254, 18];
  const leaves = [0.1, 0.18, 0.26, 0.34, 0.42, 0.5, 0.58, 0.66, 0.74, 0.82, 0.9].map((t, i) => {
    const b = bez(stem, t);
    const side = i % 2 ? 1 : -1;
    return { x: b.x, y: b.y, a: b.a + side * (38 + (i % 3) * 6), len: 34 - t * 10, w: 4.2 };
  });
  const olives = [0.3, 0.55, 0.78].map((t, i) => {
    const b = bez(stem, t);
    return { x: b.x + (i % 2 ? 8 : -6), y: b.y + 11 };
  });
  return (
    <svg viewBox="0 0 260 140" aria-hidden className={cn("block h-auto w-full overflow-visible", className)} style={style} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${stem[0]} ${stem[1]} C${stem.slice(2).join(" ")}`} fill="none" />
      {leaves.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
      <path d={`M${bez(stem, 0.96).x} ${bez(stem, 0.96).y} l14 -8`} fill="none" />
      {olives.map((o, i) => (
        <g key={i}>
          <path d={`M${o.x} ${o.y - 6} l0 -5`} fill="none" />
          <ellipse cx={o.x} cy={o.y} rx="4" ry="5.4" fillOpacity="0.28" />
        </g>
      ))}
    </svg>
  );
}

/** Ramo de limão-siciliano (Costa Amalfitana): folhas largas e dois limões. */
export function LemonBranch({ className, style }: P) {
  const stem = [8, 210, 64, 176, 132, 118, 252, 58];
  const leaves = [0.12, 0.24, 0.36, 0.5, 0.62, 0.74, 0.86].map((t, i) => {
    const b = bez(stem, t);
    const side = i % 2 ? 1 : -1;
    return { x: b.x, y: b.y, a: b.a + side * (34 + (i % 3) * 8), len: 46 - t * 12, w: 9 };
  });
  const lemon = "M-17 0 C-17 -11 -8 -15 0 -15 C8 -15 17 -10 19 -3 L24 0 L19 3 C17 10 8 15 0 15 C-8 15 -17 11 -17 0 Z M-17 0 L-21 0";
  const lemons = [
    { t: 0.44, dx: -4, dy: 34, r: 72 },
    { t: 0.66, dx: 10, dy: 30, r: 58 },
  ].map(({ t, dx, dy, r }) => ({ ...bez(stem, t), dx, dy, r }));
  return (
    <svg viewBox="0 0 260 220" aria-hidden className={cn("block h-auto w-full overflow-visible", className)} style={style} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${stem[0]} ${stem[1]} C${stem.slice(2).join(" ")}`} fill="none" />
      {leaves.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
      {lemons.map((l, i) => (
        <g key={i}>
          <path d={`M${l.x} ${l.y} q${l.dx / 2} ${l.dy / 3} ${l.dx} ${l.dy - 14}`} fill="none" />
          <path d={lemon} transform={`translate(${l.x + l.dx} ${l.y + l.dy}) rotate(${l.r})`} fillOpacity="0.22" />
        </g>
      ))}
    </svg>
  );
}

/** Faixa grega (meandro), repetida na largura do elemento. */
export function Meander({ className, style }: P) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden className={cn("block h-[18px] w-full", className)} style={style}>
      <defs>
        <pattern id={id} width="24" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 1 H24 M0 17 H24 M3 17 V4 H19 V14 H8 V8 H15 V11" fill="none" stroke="currentColor" strokeWidth="1.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Campo de azulejos de maiólica (flor de quatro pétalas e círculos nas juntas). */
export function TileField({ className, style, size = 72 }: P & { size?: number }) {
  const id = useId().replace(/:/g, "");
  const s = size;
  const h = s / 2;
  const pet = s * 0.2;
  return (
    <svg aria-hidden className={cn("block h-full w-full", className)} style={style}>
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="0.5" y="0.5" width={s - 1} height={s - 1} strokeOpacity="0.5" />
            {/* quartos de círculo nos cantos: formam círculos entre quatro azulejos */}
            <path d={`M0 ${s * 0.22} A${s * 0.22} ${s * 0.22} 0 0 0 ${s * 0.22} 0 M${s - s * 0.22} 0 A${s * 0.22} ${s * 0.22} 0 0 0 ${s} ${s * 0.22} M${s} ${s - s * 0.22} A${s * 0.22} ${s * 0.22} 0 0 0 ${s - s * 0.22} ${s} M${s * 0.22} ${s} A${s * 0.22} ${s * 0.22} 0 0 0 0 ${s - s * 0.22}`} />
            {/* flor central */}
            {[0, 90, 180, 270].map((r) => (
              <ellipse key={r} cx={h} cy={h - pet * 0.9} rx={pet * 0.42} ry={pet * 0.9} transform={`rotate(${r} ${h} ${h})`} fill="currentColor" fillOpacity="0.12" />
            ))}
            {[45, 135, 225, 315].map((r) => (
              <path key={r} d={`M${h} ${h - pet * 1.2} l0 -${pet * 0.5}`} transform={`rotate(${r} ${h} ${h})`} />
            ))}
            <circle cx={h} cy={h} r={pet * 0.22} fill="currentColor" fillOpacity="0.35" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Ondas em linha (mar), repetidas. */
export function WaveLines({ className, style }: P) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden className={cn("block h-full w-full", className)} style={style}>
      <defs>
        <pattern id={id} width="48" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 14 q12 -10 24 0 t24 0" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Desloca o conteúdo devagar com o scroll (parallax de ±amount px). */
export function Float({ children, className, amount = 60 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <motion.div ref={ref} aria-hidden className={cn("pointer-events-none", className)} style={{ y }}>
      {children}
    </motion.div>
  );
}
