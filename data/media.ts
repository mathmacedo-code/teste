/* Gerado a partir de assets/images (ver scripts/media/build_media.py). */
import type { StaticImageData } from "next/image";

import adega from "@/assets/images/adega.jpg";
import barConvidado from "@/assets/images/bar-convidado.jpg";
import bartender from "@/assets/images/bartender.jpg";
import celebracao from "@/assets/images/celebracao.jpg";
import dj from "@/assets/images/dj.jpg";
import drink from "@/assets/images/drink.jpg";
import equipe from "@/assets/images/equipe.jpg";
import escultura from "@/assets/images/escultura.jpg";
import fachada from "@/assets/images/fachada.jpg";
import forno from "@/assets/images/forno.jpg";
import franjas from "@/assets/images/franjas.jpg";
import frutosDoMar from "@/assets/images/frutos-do-mar.jpg";
import grelha from "@/assets/images/grelha.jpg";
import janela from "@/assets/images/janela.jpg";
import luminarias from "@/assets/images/luminarias.jpg";
import massaMaos from "@/assets/images/massa-maos.jpg";
import massaRolo from "@/assets/images/massa-rolo.jpg";
import mesaLonga from "@/assets/images/mesa-longa.jpg";
import mesaPalha from "@/assets/images/mesa-palha.jpg";
import negroni from "@/assets/images/negroni.jpg";
import ostras from "@/assets/images/ostras.jpg";
import padeiro from "@/assets/images/padeiro.jpg";
import pista from "@/assets/images/pista.jpg";
import pratoChocolate from "@/assets/images/prato-chocolate.jpg";
import pratoCordeiro from "@/assets/images/prato-cordeiro.jpg";
import pratoLabneh from "@/assets/images/prato-labneh.jpg";
import pratoPavlova from "@/assets/images/prato-pavlova.jpg";
import pratoPolvo from "@/assets/images/prato-polvo.jpg";
import pratoRavioli from "@/assets/images/prato-ravioli.jpg";
import pratoTartare from "@/assets/images/prato-tartare.jpg";
import rose from "@/assets/images/rose.jpg";
import salao from "@/assets/images/salao.jpg";
import teto from "@/assets/images/teto.jpg";

export const img = {
  "adega": adega,
  "bar-convidado": barConvidado,
  "bartender": bartender,
  "celebracao": celebracao,
  "dj": dj,
  "drink": drink,
  "equipe": equipe,
  "escultura": escultura,
  "fachada": fachada,
  "forno": forno,
  "franjas": franjas,
  "frutos-do-mar": frutosDoMar,
  "grelha": grelha,
  "janela": janela,
  "luminarias": luminarias,
  "massa-maos": massaMaos,
  "massa-rolo": massaRolo,
  "mesa-longa": mesaLonga,
  "mesa-palha": mesaPalha,
  "negroni": negroni,
  "ostras": ostras,
  "padeiro": padeiro,
  "pista": pista,
  "prato-chocolate": pratoChocolate,
  "prato-cordeiro": pratoCordeiro,
  "prato-labneh": pratoLabneh,
  "prato-pavlova": pratoPavlova,
  "prato-polvo": pratoPolvo,
  "prato-ravioli": pratoRavioli,
  "prato-tartare": pratoTartare,
  "rose": rose,
  "salao": salao,
  "teto": teto,
} satisfies Record<string, StaticImageData>;

export type ImageKey = keyof typeof img;

/** Vídeos de ambientação (WebM VP9 + MP4 H.264, sem áudio, em loop contínuo). */
export type VideoSource = { webm: string; mp4: string; poster: string; width: number; height: number };

const v = (name: string, width = 720, height = 1280): VideoSource => ({
  webm: `/media/video/${name}.webm`,
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
