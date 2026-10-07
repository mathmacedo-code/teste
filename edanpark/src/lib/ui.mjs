// Helpers de marcação: ícones SVG inline (sem fonte de ícones, sem requisição extra) e escape de HTML.

export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const P = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-up-right": "M7 17L17 7M8 7h9v9",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  anchor: "M12 8a3 3 0 100-6 3 3 0 000 6zM12 8v14M5 12H2a10 10 0 0020 0h-3",
  layers: "M12 2l10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5",
  pin: "M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  play: "M8 5l11 7-11 7z",
  pause: "M8 5h3v14H8zM14 5h3v14h-3z",
  close: "M6 6l12 12M18 6L6 18",
  check: "M4 12.5l5 5L20 6.5",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  whatsapp:
    "M3 21l1.7-5A9 9 0 1112 21a9 9 0 01-4.3-1.1zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a5 5 0 01-2.3-2.3l.8-1-1-2z",
  rotate: "M3 12a9 9 0 019-9 9 9 0 016.7 3M21 3v5h-5M21 12a9 9 0 01-9 9 9 9 0 01-6.7-3M3 21v-5h5",
  expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  swap: "M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4",
  compass: "M12 22a10 10 0 100-20 10 10 0 000 20zM16 8l-2 6-6 2 2-6z",
  instagram: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 8a4 4 0 100 8 4 4 0 000-8zM17.5 6.5h.01",
  linkedin:
    "M4 9h4v12H4zM6 3.5a2 2 0 110 4 2 2 0 010-4zM10 9h4v2c.8-1.4 2.2-2.2 4-2.2 3 0 4 2 4 5V21h-4v-6.2c0-1.5-.5-2.3-1.8-2.3S14 13.4 14 15V21h-4z",
  gyro: "M12 3a9 9 0 019 9M12 21a9 9 0 01-9-9M12 7v5l3 2M19 3v4h-4M5 21v-4h4",
};

export function icon(name, cls = "") {
  const fill = name === "play";
  return `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" ${
    fill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'
  }><path d="${P[name]}"/></svg>`;
}

// Ícone do logotipo (galpão em linhas) — redesenhado a partir do cartão final do vídeo.
// Para usar o arquivo oficial, troque este SVG (e public/brand/favicon.svg).
export function logoMark(cls = "") {
  return `<svg class="logo-mark ${cls}" viewBox="90 90 490 340" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M103 412V295l140-107 297 124v100"/><path d="M283 100v168l282 114"/><path d="M103 375l87-50v65"/></svg>`;
}
