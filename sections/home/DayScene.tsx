"use client";

import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { useId, useRef } from "react";
import { cn } from "@/lib/cn";

/*
 * Paisagem mediterrânea vista de um terraço, ao longo de 24 horas.
 * Recebe a hora (MotionValue) e atualiza cores e posições direto no DOM,
 * sem re-renderizar o React a cada quadro: leve no celular.
 *
 * Tudo é vetor (SVG 400×500, proporção 4:5). Horizonte em y=330.
 */

const HORIZON = 330;

type Palette = {
  skyTop: string; skyBottom: string; sea: string; far: string; cliff: string; house: string;
  cypress: string; dome: string; terrace: string; glow: string;
  lights: number; stars: number; clouds: number;
};

/** Cores-chave do dia; entre elas, interpolação contínua. */
const KEYS: [number, Palette][] = [
  [0, { skyTop: "#040918", skyBottom: "#142247", sea: "#050b1c", far: "#0b1530", cliff: "#121a2a", house: "#273246", cypress: "#081010", dome: "#172a52", terrace: "#0b0d14", glow: "#c8d4ff", lights: 1, stars: 1, clouds: 0.05 }],
  [5, { skyTop: "#0a1430", skyBottom: "#2a3562", sea: "#0a1430", far: "#141d3c", cliff: "#1a2034", house: "#333c56", cypress: "#0b1210", dome: "#1d3060", terrace: "#0e1018", glow: "#c8d4ff", lights: 0.9, stars: 0.8, clouds: 0.1 }],
  [6.4, { skyTop: "#3d4c7c", skyBottom: "#f1a98a", sea: "#3b4569", far: "#5b5678", cliff: "#6b5a66", house: "#cbb5ae", cypress: "#273126", dome: "#3a5590", terrace: "#2a2427", glow: "#ffb486", lights: 0.25, stars: 0.05, clouds: 0.5 }],
  [8.5, { skyTop: "#7cb2d8", skyBottom: "#f5e6cf", sea: "#2e6ca3", far: "#91a4b6", cliff: "#c6aa8a", house: "#f4eee3", cypress: "#3b4a2e", dome: "#2b5390", terrace: "#e2d3ba", glow: "#fff1c9", lights: 0, stars: 0, clouds: 0.85 }],
  [13, { skyTop: "#5a9dd1", skyBottom: "#dcecf2", sea: "#1d5c9c", far: "#a0b4c5", cliff: "#d0b18d", house: "#fbf8f1", cypress: "#3d4c2e", dome: "#2b5390", terrace: "#eee3cf", glow: "#fff8e4", lights: 0, stars: 0, clouds: 0.9 }],
  [16.5, { skyTop: "#76a8cf", skyBottom: "#f4dcb4", sea: "#295e8e", far: "#a49b9d", cliff: "#caa17b", house: "#f7e9d3", cypress: "#394428", dome: "#2d4f86", terrace: "#e6d0ae", glow: "#ffe2a8", lights: 0, stars: 0, clouds: 0.8 }],
  [18, { skyTop: "#c2634a", skyBottom: "#f8c98a", sea: "#6b4552", far: "#8b5a5e", cliff: "#905b48", house: "#f3c9a1", cypress: "#2a291d", dome: "#3a4a7a", terrace: "#58392d", glow: "#ffb066", lights: 0.25, stars: 0, clouds: 0.7 }],
  [19.2, { skyTop: "#392e5b", skyBottom: "#c8777a", sea: "#2e2640", far: "#4a3550", cliff: "#3d2e3b", house: "#8e7987", cypress: "#19191b", dome: "#29345f", terrace: "#23191f", glow: "#ffb48a", lights: 0.75, stars: 0.3, clouds: 0.4 }],
  [20.6, { skyTop: "#0e193a", skyBottom: "#38487b", sea: "#0c1530", far: "#1b2344", cliff: "#1d2335", house: "#3a445e", cypress: "#0d1311", dome: "#1d2f5f", terrace: "#11131b", glow: "#c8d4ff", lights: 1, stars: 0.85, clouds: 0.12 }],
  [24, { skyTop: "#040918", skyBottom: "#142247", sea: "#050b1c", far: "#0b1530", cliff: "#121a2a", house: "#273246", cypress: "#081010", dome: "#172a52", terrace: "#0b0d14", glow: "#c8d4ff", lights: 1, stars: 1, clouds: 0.05 }],
];

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(" ")})`;
};

function paletteAt(h: number) {
  const hh = ((h % 24) + 24) % 24;
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1][0] <= hh) i++;
  const [h0, p0] = KEYS[i];
  const [h1, p1] = KEYS[i + 1];
  const t = (hh - h0) / (h1 - h0);
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(p0) as (keyof Palette)[]) {
    const a = p0[k], b = p1[k];
    out[k] = typeof a === "number" ? a + ((b as number) - a) * t : mix(a, b as string, t);
  }
  return out as { [K in keyof Palette]: Palette[K] extends number ? number : string };
}

/** Posição de um astro num arco de `rise` a `set` (horas). Fora do intervalo, abaixo do horizonte. */
function arc(h: number, rise: number, len: number) {
  const a = ((((h - rise) % 24) + 24) % 24) / len; // 0..1 enquanto está no céu
  if (a > 1) return { x: 200, y: HORIZON + 80, up: 0, a };
  return { x: 30 + 340 * a, y: HORIZON + 6 - Math.sin(Math.PI * a) * 255, up: Math.sin(Math.PI * a), a };
}

// casas da encosta (estilo Positano): x, y, largura, altura
const HOUSES: [number, number, number, number][] = [
  [6, 252, 22, 18], [28, 262, 26, 20], [54, 272, 20, 16], [12, 274, 18, 16], [34, 284, 24, 18], [60, 290, 26, 18],
  [88, 298, 20, 16], [18, 294, 20, 15], [44, 304, 22, 16], [70, 310, 24, 18], [98, 314, 20, 16], [120, 322, 18, 14],
  [26, 314, 22, 16], [52, 324, 24, 16], [80, 330, 22, 16], [106, 336, 18, 14], [6, 316, 18, 16], [36, 334, 20, 15],
  [64, 344, 22, 16], [92, 350, 20, 14], [14, 338, 20, 16], [46, 352, 22, 14],
];

// tons pastel das fachadas (rosa, amarelo, terracota); null = branco
const TINTS = ["#f2b9a0", null, "#f3d58e", null, "#dc8d6c", null, null, "#f6c7b0", "#efe0a0", null];

// janelas acesas em casas alternadas, para não parecer uma grade
const WINDOWS = HOUSES.flatMap(([x, y, w, h], i) =>
  i % 3 === 1 ? [] : [[x + w * 0.22, y + h * 0.35] as const, ...(w > 21 && i % 2 ? [[x + w * 0.62, y + h * 0.35] as const] : [])],
);

const STARS = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 400, y: r(2) * 250, s: 0.5 + r(3) * 1.1, o: 0.4 + r(4) * 0.6 };
});

export function DayScene({ hour, className }: { hour: MotionValue<number>; className?: string }) {
  const id = useId().replace(/:/g, "");
  const root = useRef<SVGSVGElement>(null);
  const sun = useRef<SVGGElement>(null);
  const moon = useRef<SVGGElement>(null);
  const sunRef = useRef<SVGRectElement>(null);
  const moonRef = useRef<SVGRectElement>(null);
  const sunCore = useRef<SVGCircleElement>(null);

  const apply = (h: number) => {
    const el = root.current;
    if (!el) return;
    const p = paletteAt(h);
    const st = el.style;
    st.setProperty("--sky-top", p.skyTop);
    st.setProperty("--sky-bottom", p.skyBottom);
    st.setProperty("--sea", p.sea);
    st.setProperty("--far", p.far);
    st.setProperty("--cliff", p.cliff);
    st.setProperty("--house", p.house);
    st.setProperty("--cypress", p.cypress);
    st.setProperty("--dome", p.dome);
    st.setProperty("--terrace", p.terrace);
    st.setProperty("--glow", p.glow);
    st.setProperty("--lights", String(p.lights));
    st.setProperty("--stars", String(p.stars));
    st.setProperty("--clouds", String(p.clouds));

    // sol: nasce às 6h, se põe às 18h45; perto do horizonte fica alaranjado
    const s = arc(h, 6, 12.75);
    sun.current?.setAttribute("transform", `translate(${s.x} ${s.y})`);
    sunCore.current?.setAttribute("fill", mix("#ffb25c", "#fff6dc", Math.min(1, s.up * 1.6)));
    sunRef.current?.setAttribute("x", String(s.x - 14));
    sunRef.current?.setAttribute("opacity", String(s.a <= 1 ? 0.25 + (1 - s.up) * 0.6 : 0));

    // lua: nasce às 18h30, se põe às 6h
    const m = arc(h, 18.5, 11.5);
    moon.current?.setAttribute("transform", `translate(${m.x} ${m.y})`);
    moonRef.current?.setAttribute("x", String(m.x - 9));
    moonRef.current?.setAttribute("opacity", String(m.a <= 1 ? 0.35 * m.up + 0.15 : 0));
  };

  useMotionValueEvent(hour, "change", apply);
  // primeira pintura (antes de qualquer mudança)
  const painted = useRef(false);
  const setRoot = (node: SVGSVGElement | null) => {
    root.current = node;
    if (node && !painted.current) {
      painted.current = true;
      apply(hour.get());
    }
  };

  return (
    <svg
      ref={setRoot}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className={cn("block h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--sky-top)" }} />
          <stop offset="0.66" style={{ stopColor: "var(--sky-bottom)" }} />
        </linearGradient>
        <radialGradient id={`${id}halo`}>
          <stop offset="0" style={{ stopColor: "var(--glow)", stopOpacity: 0.75 }} />
          <stop offset="0.35" style={{ stopColor: "var(--glow)", stopOpacity: 0.22 }} />
          <stop offset="1" style={{ stopColor: "var(--glow)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={`${id}refl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--glow)", stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: "var(--glow)", stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id={`${id}beam`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#ffe3a6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe3a6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* céu */}
      <rect width="400" height="500" fill={`url(#${id}sky)`} />

      {/* estrelas */}
      <g style={{ opacity: "var(--stars)" }}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" opacity={s.o} className={i % 4 === 0 ? "twinkle" : undefined} style={{ animationDelay: `${-i * 0.37}s` }} />
        ))}
      </g>

      {/* sol e lua (atrás do mar: somem no horizonte) */}
      <g ref={sun}>
        <circle r="70" fill={`url(#${id}halo)`} />
        <circle ref={sunCore} r="15" fill="#fff6dc" />
      </g>
      <g ref={moon}>
        <circle r="38" fill={`url(#${id}halo)`} opacity="0.7" />
        <circle r="10.5" fill="#efe8dc" />
        <circle cx="-3" cy="-2" r="2.4" fill="#c9c1b3" opacity="0.5" />
        <circle cx="3.5" cy="3" r="1.6" fill="#c9c1b3" opacity="0.45" />
      </g>

      {/* nuvens */}
      <g style={{ opacity: "var(--clouds)" }} fill="#fff">
        <g className="drift-slow">
          <ellipse cx="80" cy="110" rx="34" ry="7" opacity="0.55" />
          <ellipse cx="100" cy="104" rx="20" ry="6" opacity="0.5" />
        </g>
        <g className="drift-slower">
          <ellipse cx="290" cy="70" rx="40" ry="6" opacity="0.45" />
          <ellipse cx="270" cy="66" rx="18" ry="5" opacity="0.4" />
        </g>
      </g>

      {/* ilhas ao longe */}
      <path d="M150 330 Q185 312 220 320 Q240 314 262 330 Z" style={{ fill: "var(--far)" }} />
      <path d="M262 330 Q300 306 336 316 Q368 300 400 312 L400 330 Z" style={{ fill: "var(--far)" }} opacity="0.85" />

      {/* mar + reflexos do sol e da lua */}
      <rect y={HORIZON} width="400" height={500 - HORIZON} style={{ fill: "var(--sea)" }} />
      <rect ref={sunRef} y={HORIZON} width="28" height="120" fill={`url(#${id}refl)`} opacity="0" />
      <rect ref={moonRef} y={HORIZON} width="18" height="110" fill={`url(#${id}refl)`} opacity="0" />
      <g opacity="0.22" stroke="#fff" strokeWidth="0.8" fill="none" strokeLinecap="round">
        <g className="swell-a">
          <path d="M0 346 q10 -2 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
        </g>
        <g className="swell-b">
          <path d="M0 372 q14 -3 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" />
        </g>
        <g className="swell-a" style={{ animationDuration: "11s" }}>
          <path d="M0 404 q18 -4 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0" />
        </g>
      </g>

      {/* veleiro atravessando devagar */}
      <g className="sail">
        <path d="M0 0 l14 0 l-3 4 l-9 0 z" style={{ fill: "var(--cliff)" }} transform="translate(0 352)" />
        <path d="M7 351 l0 -22 l9 20 z" fill="#f6f1e8" style={{ opacity: "calc(1 - var(--lights) * 0.6)" }} />
        <path d="M6 351 l0 -18 l-6 17 z" fill="#efe6d6" style={{ opacity: "calc(1 - var(--lights) * 0.6)" }} />
      </g>

      {/* encosta com as casas (Positano) */}
      <path d="M0 500 L0 244 Q22 236 44 252 Q70 244 92 270 Q120 280 140 318 Q158 352 170 400 L184 500 Z" style={{ fill: "var(--cliff)" }} />
      {HOUSES.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="0.6" style={{ fill: "var(--house)" }} />
      ))}
      <g style={{ opacity: "calc(0.5 - var(--lights) * 0.45)" }}>
        {HOUSES.map(([x, y, w, h], i) =>
          TINTS[i % TINTS.length] ? <rect key={i} x={x} y={y} width={w} height={h} rx="0.6" fill={TINTS[i % TINTS.length]!} /> : null,
        )}
      </g>
      {/* sombra dos telhados: dá volume às casas */}
      <g fill="#000" opacity="0.12">
        {HOUSES.map(([x, y, w, h], i) => (
          <rect key={i} x={x + w * 0.62} y={y} width={w * 0.38} height={h} />
        ))}
      </g>
      <g style={{ opacity: "var(--lights)" }} fill="#ffc46b">
        {WINDOWS.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="3.2" height="4.2" rx="0.6" className={i % 7 === 3 ? "flicker" : undefined} />
        ))}
      </g>
      {/* igreja com cúpula azul */}
      <rect x="62" y="232" width="20" height="26" style={{ fill: "var(--house)" }} />
      <path d="M60 233 a12 12 0 0 1 24 0 z" style={{ fill: "var(--dome)" }} />
      <path d="M72 213 v8 M69 216 h6" strokeWidth="1.2" style={{ stroke: "var(--house)" }} />
      {/* ciprestes */}
      <g style={{ fill: "var(--cypress)" }}>
        <path d="M134 318 q6 -34 4 -50 q-4 16 -10 50 z" />
        <path d="M144 326 q5 -28 3 -42 q-3 14 -8 42 z" />
        <path d="M22 244 q5 -26 3 -38 q-3 12 -7 38 z" />
      </g>

      {/* ponta de pedra com o farol */}
      <path d="M400 500 L400 334 L362 339 Q352 350 347 404 Q342 452 336 500 Z" style={{ fill: "var(--cliff)" }} />
      <g className="beam" style={{ opacity: "var(--lights)" }}>
        <path d="M372 296 L232 270 L232 318 Z" fill={`url(#${id}beam)`} />
      </g>
      <path d="M366 342 L379 342 L377 300 L368 300 Z" style={{ fill: "var(--house)" }} />
      <path d="M367.4 322 h10.8 M367.8 312 h10" stroke="#a6463a" strokeWidth="3" opacity="0.85" />
      <rect x="366" y="291" width="13" height="9" rx="1" style={{ fill: "var(--terrace)" }} />
      <rect x="368" y="293" width="9" height="5" fill="#ffd27d" style={{ opacity: "calc(0.15 + var(--lights) * 0.85)" }} />

      {/* ramo de oliveira no canto, em primeiro plano */}
      <g style={{ fill: "var(--cypress)" }} className="sway">
        <path d="M400 0 C380 30 350 46 318 52" style={{ stroke: "var(--cypress)" }} strokeWidth="2" fill="none" />
        {[[388, 18, -40], [376, 30, 20], [364, 36, -30], [350, 42, 25], [336, 47, -20], [324, 51, 30], [394, 8, 30]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="9" ry="2.6" transform={`rotate(${r} ${x} ${y})`} />
        ))}
        <circle cx="356" cy="47" r="2.6" />
      </g>

      {/* terraço: balaustrada em primeiro plano */}
      <g style={{ fill: "var(--terrace)" }}>
        <rect x="0" y="450" width="400" height="7" />
        {Array.from({ length: 21 }, (_, i) => (
          <path key={i} d={`M${6 + i * 19.4} 457 h8 q-3 7 0 14 q3 7 0 14 h-8 q3 -7 0 -14 q-3 -7 0 -14 z`} />
        ))}
        <rect x="0" y="485" width="400" height="15" />
      </g>
    </svg>
  );
}
