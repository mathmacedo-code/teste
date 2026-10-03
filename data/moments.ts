/**
 * O Vila Medí ao longo do dia. Cada momento tem a sua "cena": céu, astro e mar
 * (ver sections/home/SkyScene.tsx). Sem fotos: cor e luz contam a hora.
 */
export type Sky = {
  top: string;
  bottom: string;
  sea: string;
  /** astro: sol, lua ou a luz quente de uma luminária */
  body: { x: number; y: number; size: number; color: string; glow: string };
  stars?: boolean;
};

export type Moment = { id: string; name: string; time: string; text: string; sky: Sky };

export const moments: Moment[] = [
  {
    id: "almoco", name: "Almoço", time: "a partir das 12h",
    text: "Luz do dia, mezze para dividir e uma taça de branco gelado.",
    sky: { top: "#bcd7e6", bottom: "#f3ede2", sea: "#2b5390", body: { x: 50, y: 16, size: 15, color: "#fff7e0", glow: "rgb(255 244 210 / 0.75)" } },
  },
  {
    id: "sunset", name: "Sunset", time: "fim de tarde",
    text: "Rosé no balde, a cidade lá fora e a conversa que se estende.",
    sky: { top: "#c46a4c", bottom: "#f4cf9f", sea: "#5b3c4a", body: { x: 70, y: 56, size: 24, color: "#ffcf7d", glow: "rgb(255 190 110 / 0.8)" } },
  },
  {
    id: "jantar", name: "Jantar", time: "à noite",
    text: "Mesas sob luminárias de palha e o salão no seu momento mais bonito.",
    sky: { top: "#0c1630", bottom: "#2a3a5e", sea: "#08112a", body: { x: 28, y: 20, size: 12, color: "#efe8dc", glow: "rgb(239 232 220 / 0.45)" }, stars: true },
  },
  {
    id: "drinks", name: "Drinks", time: "no bar central",
    text: "Clássicos bem feitos e coquetéis autorais servidos no balcão.",
    sky: { top: "#1a110c", bottom: "#5e3417", sea: "#120b07", body: { x: 62, y: 34, size: 17, color: "#e9a253", glow: "rgb(233 162 83 / 0.7)" } },
  },
  {
    id: "celebracoes", name: "Celebrações", time: "sexta e sábado",
    text: "Música, brindes e a noite que não tem pressa de acabar.",
    sky: { top: "#24122c", bottom: "#7c3a4c", sea: "#170a18", body: { x: 74, y: 18, size: 13, color: "#f6e3c8", glow: "rgb(246 210 170 / 0.55)" }, stars: true },
  },
  {
    id: "privados", name: "Eventos privados", time: "sob consulta",
    text: "Uma mesa longa só sua, com menu desenhado para a ocasião.",
    sky: { top: "#23241a", bottom: "#4f5233", sea: "#17180f", body: { x: 46, y: 38, size: 14, color: "#f0c482", glow: "rgb(240 196 130 / 0.65)" } },
  },
];
