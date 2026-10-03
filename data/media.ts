/* Fotos de pratos enviadas pela casa (assets/images) e, para os momentos do dia, frames dos reels (amb-*).
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
// ambientes enviados pela casa: bar central e cozinhas
import bar1 from "@/assets/images/bar-1.jpg";
import bar2 from "@/assets/images/bar-2.jpg";
import bar3 from "@/assets/images/bar-3.jpg";
import cozinhaMiimar from "@/assets/images/cozinha-miimar.jpg";
import cozinhaTemperani from "@/assets/images/cozinha-temperani.jpg";
// ambientes (frames dos reels), usados na seção de momentos do dia
import ambCelebracao from "@/assets/images/celebracao.jpg";
import ambDrink from "@/assets/images/drink.jpg";
import ambLabneh from "@/assets/images/prato-labneh.jpg";
import ambMesaLonga from "@/assets/images/mesa-longa.jpg";
import ambMesaPalha from "@/assets/images/mesa-palha.jpg";
import ambRose from "@/assets/images/rose.jpg";

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
  "bar-1": bar1,
  "bar-2": bar2,
  "bar-3": bar3,
  "cozinha-miimar": cozinhaMiimar,
  "cozinha-temperani": cozinhaTemperani,
  "amb-almoco": ambLabneh,
  "amb-sunset": ambRose,
  "amb-jantar": ambMesaPalha,
  "amb-drinks": ambDrink,
  "amb-celebracoes": ambCelebracao,
  "amb-privados": ambMesaLonga,
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

/**
 * Vídeos de ambientação, sem áudio, em loop contínuo, e poster WebP.
 * MP4 (H.264) é o principal: todo celular toca. WebM (VP9) é só reserva para
 * navegadores sem H.264 (ex.: Chromium de Linux) e vem sempre depois.
 */
export type VideoSource = { mp4: string; webm: string; poster: string; width: number; height: number };

const v = (name: string, width = 720, height = 1280): VideoSource => ({
  mp4: `/media/video/${name}.mp4`,
  webm: `/media/video/${name}.webm`,
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
  /** drinks sendo montados (enviados pela casa) */
  drinkTaca: v("drink-taca"),
  drinkSpritz: v("drink-spritz"),
  drinkSpritzDesktop: v("drink-spritz-desktop", 1920, 1080),
} as const;

export type VideoKey = keyof typeof video;
