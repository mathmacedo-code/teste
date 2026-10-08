// Helpers de marcação: ícones SVG inline (sem fonte de ícones, sem requisição extra) e escape de HTML.
// Traço reto e cantos vivos, como as linhas do logotipo.
export { logoWord, logoIcon, frameLines } from "./logo.mjs";

export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const P = {
  "arrow-right": "M4 12h16M14 6l6 6-6 6",
  "arrow-up-right": "M6 18L18 6M8 6h10v10",
  "arrow-left": "M20 12H4M10 6l-6 6 6 6",
  // pictogramas: linhas retas, como o galpão do logo
  grid: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  anchor: "M3 21V9l9-6 9 6v12M3 21h18M9 21v-7h6v7",
  layers: "M3 18h18M3 18V9l5-4 5 4v9M13 18V12l4-3 4 3v6",
  pin: "M12 22L5 11V8a7 7 0 0114 0v3zM10 8h4v4h-4z",
  play: "M8 5l11 7-11 7z",
  pause: "M7 5h4v14H7zM13 5h4v14h-4z",
  close: "M6 6l12 12M18 6L6 18",
  check: "M4 12.5l5 5L20 6.5",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  whatsapp: "M3 21l1.7-5A9 9 0 1112 21a9 9 0 01-4.3-1.1zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a5 5 0 01-2.3-2.3l.8-1-1-2z",
  rotate: "M3 12a9 9 0 019-9 9 9 0 016.7 3M21 3v5h-5M21 12a9 9 0 01-9 9 9 9 0 01-6.7-3M3 21v-5h5",
  expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  swap: "M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4",
  compass: "M12 22a10 10 0 100-20 10 10 0 000 20zM16 8l-2 6-6 2 2-6z",
  instagram: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 8a4 4 0 100 8 4 4 0 000-8zM17.5 6.5h.01",
  linkedin: "M4 9h4v12H4zM6 3.5a2 2 0 110 4 2 2 0 010-4zM10 9h4v2c.8-1.4 2.2-2.2 4-2.2 3 0 4 2 4 5V21h-4v-6.2c0-1.5-.5-2.3-1.8-2.3S14 13.4 14 15V21h-4z",
  gyro: "M12 3a9 9 0 019 9M12 21a9 9 0 01-9-9M12 7v5l3 2M19 3v4h-4M5 21v-4h4",
};

export function icon(name, cls = "") {
  const fill = name === "play";
  return `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" ${
    fill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="miter"'
  }><path d="${P[name]}"/></svg>`;
}
