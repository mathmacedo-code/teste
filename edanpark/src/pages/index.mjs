import { site, stats, pillars, phases } from "../data/site.mjs";
import { icon, esc, logoIcon } from "../lib/ui.mjs";
import { ctaBand, segmentsStrip } from "../lib/sections.mjs";
import { lotMapSection } from "../lib/lotmap.mjs";

const stat = (s, i) => `
<div class="stat" data-reveal style="--d:${i}">
  <b>${s.prefix ? `<small>${esc(s.prefix)}</small>` : ""}<span data-count="${s.value}">${s.value}</span>${s.suffix ? `<small>${esc(s.suffix)}</small>` : ""}</b>
  <span>${esc(s.label)}</span><em>${esc(s.note)}</em>
</div>`;

export default {
  path: "/",
  nav: "inicio",
  title: "Início",
  description: "Edan Park: polo industrial e logístico em Estiva, Sul de Minas Gerais. 13 lotes modulares de 5.000 a 35.000 m², estrutura pronta e a Edan como empresa âncora.",
  css: ["lotmap.css"],
  scripts: ["hero.js", "lotmap.js"],
  head: `<link rel="preload" as="image" href="/media/hero-poster.webp" type="image/webp" fetchpriority="high">`,
  body: () => `
<section class="hero grid-bg" data-hero>
  <div class="wrap hero__grid">
    <div class="hero__copy">
      <span class="label" data-reveal>${esc(site.tagline)} · ${esc(site.city)}, ${esc(site.state)}</span>
      <h1 class="hero__title" data-reveal style="--d:1">Lotes industriais e logísticos em Estiva, no Sul de Minas.</h1>
      <p class="lead" data-reveal style="--d:2">13 lotes modulares de 5.000 a 35.000 m². A Edan já escolheu o Edan Park para o seu centro de distribuição e a obra está na reta final.</p>
      <div class="hero__cta" data-reveal style="--d:3">
        <a class="btn btn--primary" href="/contato/">Falar com a equipe ${icon("arrow-right")}</a>
        <a class="btn btn--ghost" href="/tour-360/">${icon("rotate")} Tour 360°</a>
      </div>
      <dl class="specs" data-reveal style="--d:4">
        <div><dt>13</dt><dd>lotes modulares</dd></div>
        <div><dt>5 a 35 mil m²</dt><dd>por lote</dd></div>
        <div><dt>Heliponto</dt><dd>dentro do polo</dd></div>
      </dl>
    </div>
    <div class="hero__frame">
      <div class="hero__pic">
      <div class="vcard" data-vcard>
        <img src="/media/hero-poster.webp" width="720" height="1280" alt="Vista aérea do Edan Park ao pôr do sol, com o galpão da Edan e as serras do Sul de Minas" fetchpriority="high" decoding="async" data-poster>
        <video muted loop playsinline autoplay preload="none" disablepictureinpicture aria-hidden="true" tabindex="-1" data-video data-src-lg="/media/hero.mp4" data-src-sm="/media/hero-sm.mp4"></video>
        <div class="vcard__bar" aria-hidden="true"><i data-vbar></i></div>
        <button class="vcard__ctl" type="button" aria-label="Pausar vídeo" data-vctl>${icon("pause")}${icon("play")}</button>
      </div>
      </div>
      <p class="cap">Obra na reta final · ${esc(site.city)}, ${esc(site.state)}</p>
    </div>
  </div>
</section>

${segmentsStrip()}

<section class="sec" id="sobre" aria-labelledby="why-t">
  <div class="wrap split">
    <div class="sticky">
      <span class="eyebrow" data-reveal>Por que o Edan Park</span>
      <h2 class="h2" id="why-t" data-reveal style="--d:1">Estrutura pronta e lotes que acompanham a operação.</h2>
      <p class="lead" data-reveal style="--d:2">Você escolhe o tamanho que cabe hoje e já sabe onde crescer amanhã, ao lado de uma empresa âncora que já está instalada.</p>
      <a class="btn btn--ghost" href="/empreendimento/" data-reveal style="--d:3">Ver o empreendimento ${icon("arrow-right")}</a>
    </div>
    <ul class="pillars">
      ${pillars.map((p, i) => `<li data-reveal style="--d:${i}">${icon(p.icon)}<h3 class="h3">${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("")}
    </ul>
  </div>
</section>

<section class="sec sec--navy sec--roof" aria-labelledby="num-t">
  <div class="wrap">
    <div class="sec__head">
      <span class="eyebrow" data-reveal>O polo em números</span>
      <h2 class="h2" id="num-t" data-reveal style="--d:1">Dimensões do polo.</h2>
    </div>
    <div class="stats" data-stats>${stats.map(stat).join("")}</div>
    <p class="form__note" style="margin-top:22px;color:var(--muted)" data-reveal>Números divulgados pela imprensa regional; sujeitos a atualização pelo empreendimento.</p>
  </div>
</section>

${lotMapSection()}

<section class="sec" aria-labelledby="obra-t">
  <div class="wrap">
    <div class="sec__head">
      <span class="eyebrow" data-reveal>Andamento da obra</span>
      <h2 class="h2" id="obra-t" data-reveal style="--d:1">Obra na reta final.</h2>
      <p class="lead" data-reveal style="--d:2">O galpão âncora está de pé e a concretagem do piso avança. Faltam os acabamentos e a entrega do polo.</p>
    </div>
    <div class="phases" data-phases>
      ${phases
        .map(
          (p, i) => `<div class="phase ${p.state}" data-reveal style="--d:${i}"><small>${p.state === "done" ? "Concluído" : p.state === "current" ? "Em andamento" : "A seguir"}</small><h3 class="h3">${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`,
        )
        .join("")}
    </div>
  </div>
</section>

${ctaBand()}
`,
};
