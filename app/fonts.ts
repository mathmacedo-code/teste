import localFont from "next/font/local";

// Fontes auto-hospedadas (sem requisição ao Google Fonts) — subset latin cobre o português.
export const newsreader = localFont({
  src: [
    { path: "../assets/fonts/newsreader-opsz.woff2", style: "normal", weight: "200 800" },
    { path: "../assets/fonts/newsreader-opsz-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});

export const jost = localFont({
  src: [{ path: "../assets/fonts/jost.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-jost",
  display: "swap",
  fallback: ["Avenir Next", "Helvetica Neue", "Arial", "sans-serif"],
});
