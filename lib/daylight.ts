/**
 * Luz do dia: cores do céu e do mar e a posição do sol e da lua para qualquer
 * hora (0–24). Usado pela seção de momentos (céu que muda com a hora).
 */

type Palette = { skyTop: string; skyBottom: string; sea: string; far: string; glow: string; stars: number; ink: number };

/** Cores-chave do dia; entre elas, interpolação contínua. ink: 0 = texto escuro, 1 = texto claro. */
const KEYS: [number, Palette][] = [
  [0, { skyTop: "#040918", skyBottom: "#142247", sea: "#050b1c", far: "#0b1530", glow: "#c8d4ff", stars: 1, ink: 1 }],
  [5, { skyTop: "#0a1430", skyBottom: "#2a3562", sea: "#0a1430", far: "#141d3c", glow: "#c8d4ff", stars: 0.8, ink: 1 }],
  [6.4, { skyTop: "#3d4c7c", skyBottom: "#f1a98a", sea: "#3b4569", far: "#5b5678", glow: "#ffb486", stars: 0.05, ink: 1 }],
  [8.5, { skyTop: "#7cb2d8", skyBottom: "#f5e6cf", sea: "#2e6ca3", far: "#91a4b6", glow: "#fff1c9", stars: 0, ink: 0 }],
  [13, { skyTop: "#5a9dd1", skyBottom: "#e6f0f2", sea: "#1d5c9c", far: "#a0b4c5", glow: "#fff8e4", stars: 0, ink: 0 }],
  [16.5, { skyTop: "#76a8cf", skyBottom: "#f4dcb4", sea: "#295e8e", far: "#a49b9d", glow: "#ffe2a8", stars: 0, ink: 0 }],
  [18, { skyTop: "#c2634a", skyBottom: "#f8c98a", sea: "#6b4552", far: "#8b5a5e", glow: "#ffb066", stars: 0, ink: 0.15 }],
  [19.2, { skyTop: "#392e5b", skyBottom: "#c8777a", sea: "#2e2640", far: "#4a3550", glow: "#ffb48a", stars: 0.3, ink: 1 }],
  [20.6, { skyTop: "#0e193a", skyBottom: "#38487b", sea: "#0c1530", far: "#1b2344", glow: "#c8d4ff", stars: 0.85, ink: 1 }],
  [24, { skyTop: "#040918", skyBottom: "#142247", sea: "#050b1c", far: "#0b1530", glow: "#c8d4ff", stars: 1, ink: 1 }],
];

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

export const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(" ")})`;
};

export type Daylight = { [K in keyof Palette]: Palette[K] extends number ? number : string };

export function paletteAt(h: number): Daylight {
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
  return out as Daylight;
}

/**
 * Posição de um astro no arco do céu, em frações da área (x: 0→1, y: 0 = topo, 1 = horizonte).
 * `up` = altura no céu (0 no horizonte, 1 no ponto mais alto); fora do horário, `visible` = false.
 */
export function arc(h: number, rise: number, len: number) {
  const a = ((((h - rise) % 24) + 24) % 24) / len;
  if (a > 1) return { x: 0.5, y: 1.2, up: 0, visible: false };
  const up = Math.sin(Math.PI * a);
  return { x: 0.06 + 0.88 * a, y: 1 - up * 0.92, up, visible: true };
}

export const sunAt = (h: number) => arc(h, 6, 12.75);
export const moonAt = (h: number) => arc(h, 18.5, 11.5);

/** "20h30" */
export const fmtHour = (h: number) => {
  const hh = ((h % 24) + 24) % 24;
  const H = Math.floor(hh);
  const M = Math.floor((hh - H) * 60);
  return `${String(H).padStart(2, "0")}h${String(M).padStart(2, "0")}`;
};
