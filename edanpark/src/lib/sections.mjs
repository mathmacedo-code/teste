import { icon, esc, logoIcon } from "./ui.mjs";
import { site, segments } from "../data/site.mjs";
import { tour } from "../data/tour.mjs";

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

// Anel 3D que gira sozinho — convite para o tour 360° (CSS puro, sem JS).
export function tourTeaser() {
  const n = tour.scenes.length;
  return `
<section class="sec sec--paper" aria-labelledby="teaser-t">
  <div class="wrap teaser">
    <div class="teaser__copy">
      <span class="eyebrow" data-reveal>Tour 360°</span>
      <h2 class="h2" id="teaser-t" data-reveal style="--d:1">Conheça o polo antes de visitar.</h2>
      <p class="lead" data-reveal style="--d:2">Cinco paradas: visão geral, fachada da Edan, heliponto, interior do galpão e módulos de apoio. Arraste para girar 360° e entre em cada cena.</p>
      <a class="btn btn--primary" href="/tour-360/" data-reveal style="--d:3">Abrir o tour ${icon("arrow-right")}</a>
    </div>
    <div class="mini" aria-hidden="true">
      <div class="mini__ring" style="--n:${n}">
        ${tour.scenes
          .map((s, i) => `<figure style="--i:${i}"><img src="${s.img}" width="720" height="1280" alt="" loading="lazy" decoding="async"><figcaption>${esc(s.title)}</figcaption></figure>`)
          .join("")}
      </div>
      <div class="badge360">360°</div>
    </div>
  </div>
</section>`;
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
