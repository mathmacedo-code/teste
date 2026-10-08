import { icon, esc, logoIcon } from "./ui.mjs";
import { site, segments } from "../data/site.mjs";

// Chamada final: bloco azul-petróleo com o recorte em telhado do logo e o ícone desenhado ao fundo.
export function ctaBand({ title = "Traga sua empresa para o Edan Park.", text = "Fale com a equipe comercial para conhecer os lotes disponíveis e agendar uma visita ao polo." } = {}) {
  return `
<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="cta" data-reveal>
      ${logoIcon("cta__mark draw")}
      <h2 class="h2">${esc(title)}</h2>
      <p>${esc(text)}</p>
      <div class="cta__row">
        <a class="btn btn--light" href="/contato/">Falar com a equipe ${icon("arrow-right")}</a>
        <a class="btn btn--ghost" href="/tour-360/">Ver o tour 360°</a>
      </div>
    </div>
  </div>
</section>`;
}

// Faixa com os segmentos atendidos (estática, em linhas finas).
export function segmentsStrip() {
  return `<ul class="segs" aria-label="Segmentos atendidos">${segments.slice(0, 5).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;
}

// Cabeçalho das abas internas: título grande, ícone do logo "desenhando" ao fundo.
export function pageHero({ eyebrow, title, lead, crumb }) {
  return `
<section class="phero grid-bg">
  ${logoIcon("phero__mark draw")}
  <div class="wrap phero__in">
    <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a><span>/</span><span>${esc(crumb || eyebrow)}</span></nav>
    <span class="eyebrow" data-reveal>${esc(eyebrow)}</span>
    <h1 data-reveal style="--d:1">${title}</h1>
    <p class="lead" data-reveal style="--d:2">${esc(lead)}</p>
  </div>
</section>`;
}

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name} ${site.city} ${site.state}`)}`;
