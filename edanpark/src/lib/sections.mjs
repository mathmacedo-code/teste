import { icon, esc } from "./ui.mjs";
import { site, segments } from "../data/site.mjs";
import { tour } from "../data/tour.mjs";

export function ctaBand({ title = "Traga sua empresa para o Edan Park!", text = "Conte o que a sua operação precisa e receba as opções de lotes e a visita guiada ao polo." } = {}) {
  return `
<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="cta" data-reveal="zoom">
      <h2 class="h2">${esc(title)}</h2>
      <p>${esc(text)}</p>
      <div class="cta__row">
        <a class="btn btn--light" href="/contato/">Fale com a gente ${icon("arrow-right")}</a>
        <a class="btn btn--ghost" href="/tour-360/">Ver o tour 360°</a>
      </div>
    </div>
  </div>
</section>`;
}

export function marquee() {
  const run = segments.map((s) => `${esc(s)}<i></i>`).join("");
  return `<div class="marq" aria-hidden="true"><div class="marq__t"><span>${run}</span><span>${run}</span></div></div>`;
}

// Anel 3D que gira sozinho — convite para o tour 360° (CSS puro, sem JS).
export function tourTeaser() {
  const n = tour.scenes.length;
  return `
<section class="sec sec--ink2" aria-labelledby="teaser-t">
  <div class="wrap teaser">
    <div class="teaser__copy">
      <span class="eyebrow" data-reveal>Tour 360°</span>
      <h2 class="h2" id="teaser-t" data-reveal style="--d:1">Gire pelo Edan Park, do galpão ao heliponto.</h2>
      <p class="lead" data-reveal style="--d:2">Cinco paradas, uma cúpula ao entardecer. Arraste para girar 360°, entre em cada cena e descubra a estrutura antes de visitar.</p>
      <a class="btn btn--primary" href="/tour-360/" data-reveal style="--d:3">Entrar no tour ${icon("arrow-right")}</a>
    </div>
    <div class="mini" data-reveal="zoom" aria-hidden="true">
      <div class="mini__ring" style="--n:${n}">
        ${tour.scenes
          .map((s, i) => `<figure style="--i:${i}"><img src="${s.img}" width="720" height="1280" alt="" loading="lazy" decoding="async"><figcaption>${esc(s.title)}</figcaption></figure>`)
          .join("")}
      </div>
      <div class="seal"><svg viewBox="0 0 120 120"><defs><path id="seal-c" d="M60,60 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"/></defs><text><textPath href="#seal-c" textLength="296" lengthAdjust="spacing">Tour 360° • Edan Park • Explore • </textPath></text></svg><b>360°</b></div>
    </div>
  </div>
</section>`;
}

export function pageHero({ eyebrow, title, lead, bg = "/media/tour/visao-geral-bg.webp", crumb }) {
  return `
<section class="phero" style="--bg:url(${bg})">
  <div class="wrap phero__in">
    <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a><span>/</span><span>${esc(crumb || eyebrow)}</span></nav>
    <span class="eyebrow" data-reveal>${esc(eyebrow)}</span>
    <h1 data-reveal style="--d:1">${title}</h1>
    <p class="lead" data-reveal style="--d:2">${esc(lead)}</p>
  </div>
</section>`;
}

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name} ${site.city} ${site.state}`)}`;
