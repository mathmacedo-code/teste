import { tour } from "../data/tour.mjs";
import { icon, esc } from "../lib/ui.mjs";
import { ctaBand } from "../lib/sections.mjs";

const N = tour.scenes.length;
const STEP = tour.step;
const pad = (n) => String(n).padStart(2, "0");

// Partículas de poeira dourada (posições fixas: gerado no build, sem JS)
const rnd = (() => {
  let a = 0x9e3779b9;
  return () => ((a = (a + 0x6d2b79f5) | 0), (Math.imul(a ^ (a >>> 15), 1 | a) >>> 0) / 4294967296);
})();
const motes = Array.from({ length: 26 }, () => `<i style="--x:${(rnd() * 100).toFixed(1)}%;--y:${(rnd() * 100).toFixed(1)}%;--s:${(2 + rnd() * 4).toFixed(1)}px;--t:${(9 + rnd() * 12).toFixed(1)}s;--d:-${(rnd() * 14).toFixed(1)}s"></i>`).join("");

const stop = (s, i) => `
<figure class="stop${i === 0 ? " is-focus" : ""}" data-stop="${i}" data-kicker="${esc(s.kicker)}" data-title="${esc(s.title)}" data-text="${esc(s.text)}" style="--a:${i * STEP}deg">
  <div class="stop__photo" data-photo>
    <img ${i === 0 ? `src="${s.img}" fetchpriority="high"` : `data-src="${s.img}"`} width="720" height="1280" alt="${esc(s.title)}: ${esc(s.text)}" decoding="async" draggable="false">
    ${s.spots.map((p) => `<button class="spot" type="button" style="left:${p.x}%;top:${p.y}%" aria-label="${esc(p.label)}" data-spot><i></i><span>${esc(p.label)}</span></button>`).join("")}
  </div>
</figure>`;

const M = N + 1; // paradas + cartão final
const cta = tour.cta;
const ctaStop = `
<figure class="stop" data-stop="${N}" data-cta data-kicker="${esc(cta.kicker)}" data-title="${esc(cta.title)}" data-text="${esc(cta.text)}" style="--a:${N * STEP}deg">
  <div class="stop__photo stop__cta" data-photo>
    <span class="eyebrow">${esc(cta.kicker)}</span>
    <h2>Traga sua empresa para o Edan Park!</h2>
    <a class="btn btn--light" href="/contato/" data-nodrag>Fale com a gente ${icon("arrow-right")}</a>
  </div>
</figure>`;

export default {
  path: "/tour-360/",
  nav: "tour",
  title: "Tour 360°",
  description: "Tour 360° do Edan Park: gire pelo polo industrial e logístico, entre no galpão, no heliponto e nos módulos de apoio, em Estiva (MG).",
  css: ["tour.css"],
  scripts: ["tour.js"],
  bodyClass: "is-tour",
  head: `<link rel="preload" as="image" href="${tour.scenes[0].img}" type="image/webp" fetchpriority="high">`,
  body: () => `
<section class="tour" data-tour data-n="${M}" data-scenes="${N}" data-step="${STEP}" tabindex="0" role="region" aria-roledescription="tour 360 graus" aria-label="Tour 360° do Edan Park. Use as setas do teclado para girar e Enter para entrar na cena.">
  <h1 class="sr">Tour 360° do Edan Park</h1>
  <div class="tour__sky" aria-hidden="true">
    ${tour.panorama ? `<div class="tour__pano" data-pano data-src="${esc(tour.panorama.src)}"></div>` : ""}
    <div class="tour__sun" data-sun></div>
    <div class="tour__hills tour__hills--far" data-hills="0.35"></div>
    <div class="tour__hills tour__hills--near" data-hills="0.7"></div>
    <div class="tour__motes">${motes}</div>
  </div>

  <div class="tour__auras" aria-hidden="true">${[...tour.scenes, cta].map((s, i) => `<div class="aura${i === N ? " aura--cta" : ""}" data-aura style="--bg:url(${s.aura})"></div>`).join("")}</div>

  <div class="tour__cam" data-cam>
    <div class="tour__world" data-world>${tour.scenes.map(stop).join("")}${ctaStop}</div>
  </div>

  <div class="hud" data-nodrag-wrap>
    <div class="hud__top">
      <span class="hud__badge">${icon("rotate")} Tour 360°</span>
      <span class="hud__preview" data-preview hidden>Modo prévia: arraste uma imagem 360° (JPG 2:1) para cá</span>
      <span class="hud__count" aria-hidden="true"><b data-cur>01</b> / ${pad(N)}</span>
    </div>

    <div class="radar" aria-hidden="true">
      <svg viewBox="-50 -50 100 100">
        <circle r="44" class="radar__ring"/><circle r="26" class="radar__ring radar__ring--in"/>
        <g data-radar>${[...tour.scenes, cta].map((_, i) => `<circle class="radar__dot" data-rdot="${i}" cx="${(35 * Math.sin((i * STEP * Math.PI) / 180)).toFixed(2)}" cy="${(-35 * Math.cos((i * STEP * Math.PI) / 180)).toFixed(2)}" r="3.6"/>`).join("")}</g>
        <path class="radar__cone" d="M0 0 L-17 -42 A45 45 0 0 1 17 -42 Z"/>
      </svg>
    </div>

    <div class="hint" data-hint aria-hidden="true">${icon("swap")}<span>Arraste para girar</span></div>

    <div class="hud__card" data-nodrag>
      <div class="hud__row hud__row--head">
        <small class="hud__kicker" data-kicker>${esc(tour.scenes[0].kicker)}</small>
        <nav class="dots" aria-label="Paradas do tour">${[...tour.scenes, { title: "Contato" }].map((s, i) => `<button type="button" data-dot="${i}" aria-label="${esc(s.title)}"${i === 0 ? ' aria-current="true"' : ""}></button>`).join("")}</nav>
      </div>
      <h2 class="hud__title" data-title aria-live="polite">${esc(tour.scenes[0].title)}</h2>
      <p class="hud__text" data-text>${esc(tour.scenes[0].text)}</p>
      <div class="hud__row">
        <button class="rbtn" type="button" data-prev aria-label="Parada anterior">${icon("arrow-left")}</button>
        <button class="btn btn--primary btn--sm hud__enter" type="button" data-enter><span data-enter-t>Entrar na cena</span></button>
        <button class="rbtn" type="button" data-next aria-label="Próxima parada">${icon("arrow-right")}</button>
      </div>
    </div>

    <div class="hud__tools" data-nodrag>
      <button class="rbtn" type="button" data-guide aria-pressed="false" aria-label="Iniciar tour guiado" title="Tour guiado">${icon("play")}${icon("pause")}</button>
      <button class="rbtn" type="button" data-gyro hidden aria-pressed="false" aria-label="Usar o giroscópio do aparelho" title="Giroscópio">${icon("gyro")}</button>
      <button class="rbtn" type="button" data-full aria-label="Tela cheia" title="Tela cheia">${icon("expand")}</button>
    </div>
  </div>
  <noscript><p class="tour__ns">Ative o JavaScript para girar o tour. Abaixo, as cinco paradas.</p></noscript>
</section>

<section class="sec" aria-labelledby="stops-t">
  <div class="wrap">
    <div class="sec__head">
      <span class="eyebrow" data-reveal>As paradas</span>
      <h2 class="h2" id="stops-t" data-reveal style="--d:1">Cinco cenas, um só polo.</h2>
    </div>
    <ol class="stops">
      ${tour.scenes
        .map(
          (s, i) => `<li data-reveal style="--d:${i}"><button type="button" data-jump="${i}">
        <img src="${s.img}" width="360" height="640" alt="" loading="lazy" decoding="async">
        <span class="stops__n">${pad(i + 1)}</span><strong>${esc(s.title)}</strong><span>${esc(s.text)}</span></button></li>`,
        )
        .join("")}
    </ol>
  </div>
</section>

${ctaBand({ title: "Gostou do que viu?", text: "Agende uma visita ao polo e conheça de perto os lotes disponíveis." })}
`,
};
