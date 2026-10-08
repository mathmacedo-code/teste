import { icon, esc } from "./ui.mjs";
import { lotMap } from "../data/lotes.mjs";

const { views, lotes, quadras, route } = lotMap;
const KEYS = { plan: "plan", "3d": "p3d" };
const CEN = { plan: "cp", "3d": "c3" };

const view = (mode, on) => {
  const v = views[mode];
  const k = KEYS[mode];
  return `
<div class="lm__view${on ? " is-on" : ""}" data-vista="${mode}" data-route="${route[k]}" style="--w:${v.w};--h:${v.h}">
  <img data-src="${v.src}" width="${v.w}" height="${v.h}" alt="${esc(v.alt)}" decoding="async" draggable="false">
  <svg viewBox="0 0 ${v.w} ${v.h}" aria-hidden="true" focusable="false">
    <polyline class="lm__route" points="${route[k]}"/>
    <polyline class="lm__trail" points=""/>
    ${lotes.map((l) => `<polygon data-lote="${l.id}" points="${l[k]}"/>`).join("")}
  </svg>
  ${lotes.map((l) => `<button class="lm__tag" type="button" tabindex="-1" aria-hidden="true" data-lote="${l.id}" data-cx="${l[CEN[mode]][0]}" data-cy="${l[CEN[mode]][1]}" style="--x:${l[CEN[mode]][0]};--y:${l[CEN[mode]][1]}">${l.id}</button>`).join("")}
  <i class="lm__me" data-me aria-hidden="true"></i>
</div>`;
};

const chips = Object.entries(quadras)
  .map(
    ([q, name]) => `
<div class="lm__q" role="group" aria-label="${esc(name)}">
  <span>${esc(name)}</span>
  ${lotes
    .filter((l) => l.q === q)
    .map((l) => `<button type="button" data-lote="${l.id}" data-q="${esc(name)}" data-n="${l.n}" data-rel="${l.rel}" data-area="${l.area ?? ""}" aria-pressed="false" aria-label="${esc(name)}, lote ${l.n}">${l.n}</button>`)
    .join("")}
</div>`,
  )
  .join("");

// Mapa de lotes: planta 2D e vista 3D clicáveis, com percurso guiado pelas vias internas.
export function lotMapSection() {
  return `
<section class="sec sec--paper" id="lotes" aria-labelledby="lm-t">
  <div class="wrap">
    <div class="sec__head">
      <span class="eyebrow" data-reveal>Mapa de lotes</span>
      <h2 class="h2" id="lm-t" data-reveal style="--d:1">Lotes a partir de 5.000&nbsp;m², prontos para construir.</h2>
      <p class="lead" data-reveal style="--d:2">Toque num lote para ver os detalhes ou faça o percurso: passamos por todos, do portão da Edan até a última quadra.</p>
    </div>

    <div class="lm" data-lotmap data-reveal>
      <div class="lm__top">
        <div class="lm__modes" role="group" aria-label="Tipo de vista">
          <button type="button" data-mode="plan" aria-pressed="true">Planta 2D</button>
          <button type="button" data-mode="3d" aria-pressed="false">Vista 3D</button>
        </div>
        <div class="lm__tools">
          <button class="lm__nav" type="button" data-prev aria-label="Lote anterior">${icon("arrow-left")}</button>
          <button class="lm__nav" type="button" data-next aria-label="Próximo lote">${icon("arrow-right")}</button>
          <button class="btn btn--primary btn--sm lm__go" type="button" data-go data-on="false">${icon("play")}${icon("pause")}<span data-go-t>Fazer o percurso</span></button>
        </div>
      </div>

      <div class="lm__main">
        <div class="lm__stage" data-stage role="group" aria-label="Mapa interativo dos lotes. Para navegar pelo teclado, use a lista de lotes ao lado.">
          ${view("plan", true)}
          ${view("3d", false)}
          <div class="lm__prog" aria-hidden="true"><i data-prog></i></div>
          <noscript><img src="${views.plan.src}" width="${views.plan.w}" height="${views.plan.h}" alt="${esc(views.plan.alt)}"></noscript>
        </div>

        <aside class="lm__card" aria-live="polite">
          <p class="lm__kick" data-kick>Edan Park</p>
          <h3 class="lm__title" data-title>13 lotes em 3 quadras</h3>
          <p class="lm__text" data-text>Escolha um lote no mapa ou na lista abaixo para ver a quadra e o tamanho em relação aos outros. Para a metragem e as condições, fale com a equipe.</p>
          <dl class="lm__facts" data-facts hidden>
            <div><dt>Área</dt><dd data-area>Sob consulta</dd></div>
            <div><dt>Tamanho no polo</dt><dd><span class="lm__meter"><i data-meter></i></span></dd></div>
          </dl>
          <div class="lm__cta">
            <a class="btn btn--primary btn--sm" data-ask href="/contato/"><span data-ask-t>Falar sobre lotes</span> ${icon("arrow-right")}</a>
            <button class="lm__reset" type="button" data-reset hidden>Ver todos os lotes</button>
          </div>
          <div class="lm__list">${chips}</div>
        </aside>
      </div>
      <p class="lm__note">Contornos e numeração conforme a planta do empreendimento. A área de cada lote é informada pela equipe comercial.</p>
    </div>
  </div>
</section>`;
}
