/* Fotos de pratos enviadas pela casa (assets/images).
 * recorte-* são os mesmos pratos sem fundo (PNG com transparência), usados como elementos gráficos soltos. */
import type { StaticImageData } from "next/image";

import plateauCru from "@/assets/images/plateau-cru.jpg";
import pratoBurrata from "@/assets/images/prato-burrata.jpg";
import pratoBurrataTopo from "@/assets/images/prato-burrata-topo.jpg";
import pratoPeixeCru from "@/assets/images/prato-peixe-cru.jpg";
import pratoPolvoRisoni from "@/assets/images/prato-polvo-risoni.jpg";
import recorteBurrata from "@/assets/images/recorte-burrata.png";
import recortePeixe from "@/assets/images/recorte-peixe.png";
import recorteRisoni from "@/assets/images/recorte-risoni.png";

export const img = {
  "plateau-cru": plateauCru,
  "prato-burrata": pratoBurrata,
  "prato-burrata-topo": pratoBurrataTopo,
  "prato-peixe-cru": pratoPeixeCru,
  "prato-polvo-risoni": pratoPolvoRisoni,
  /** prato visto de cima, recortado em círculo */
  "recorte-burrata": recorteBurrata,
  /** peixe inteiro em sashimi sobre o prato de gelo, visto de cima */
  "recorte-peixe": recortePeixe,
  /** bowl de orzo com polvo, em perspectiva */
  "recorte-risoni": recorteRisoni,
} satisfies Record<string, StaticImageData>;

export type ImageKey = keyof typeof img;
export type CutoutKey = Extract<ImageKey, `recorte-${string}`>;

/**
 * Ponto focal das fotos em que o prato não está no centro (CSS object-position).
 * Vale em todo lugar onde a foto aparece recortada (object-cover).
 */
export const imgFocus: Partial<Record<ImageKey, string>> = {
  "plateau-cru": "50% 78%",
  "prato-polvo-risoni": "50% 68%",
};

/** Vídeos de ambientação (MP4 H.264, sem áudio, em loop contínuo) e poster WebP. */
export type VideoSource = { mp4: string; poster: string; width: number; height: number };

const v = (name: string, width = 720, height = 1280): VideoSource => ({
  mp4: `/media/video/${name}.mp4`,
  poster: `/media/poster/${name}.webp`,
  width,
  height,
});

export const video = {
  heroDesktop: v("hero-desktop", 1920, 1080),
  heroMobile: v("hero-mobile"),
  forno: v("forno"),
  noite: v("noite"),
  cru: v("cru"),
  miimar: v("miimar"),
} as const;

export type VideoKey = keyof typeof video;
