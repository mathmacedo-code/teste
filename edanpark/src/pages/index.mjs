import { site, stats, pillars, phases } from "../data/site.mjs";
import { icon, esc } from "../lib/ui.mjs";
import { ctaBand, marquee, tourTeaser } from "../lib/sections.mjs";

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
  scripts: ["hero.js"],
  head: `<link rel="preload" as="image" href="/media/hero-poster-sm.webp" type="image/webp" media="(max-width:899px)" fetchpriority="high">
<link rel="preload" as="image" href="/media/hero-poster.webp" type="image/webp" media="(min-width:900px)" fetchpriority="high">`,
  body: () => `
<section class="hero" data-hero>
  <canvas class="hero__ambient" width="48" height="86" aria-hidden="true" data-ambient></canvas>
  <div class="wrap hero__grid">
    <div class="hero__copy">
      <p class="chip" data-reveal><span class="dot"></span>${esc(site.tagline)} · ${esc(site.city)}, ${esc(site.state)}</p>
      <h1 class="hero__title" aria-label="Espaço para a sua operação crescer." data-reveal style="--d:1">Espaço para a sua <span class="rotator" aria-hidden="true"><span>logística</span><span>indústria</span><span>distribuição</span><span>e-commerce</span></span> crescer.</h1>
      <p class="lead" data-reveal style="--d:2">Lotes modulares de 5.000 a 35.000 m² no Sul de Minas, com a Edan como empresa âncora e a obra na reta final.</p>
      <div class="hero__cta" data-reveal style="--d:3">
        <a class="btn btn--primary" href="/contato/" data-magnet>Fale com a gente ${icon("arrow-right")}</a>
        <a class="btn btn--ghost" href="/tour-360/" data-magnet>${icon("rotate")} Tour 360°</a>
      </div>
      <ul class="hero__facts" data-reveal style="--d:4">
        <li><b>13</b><span>lotes modulares</span></li>
        <li><b>5–35 mil m²</b><span>por lote</span></li>
        <li><b>Heliponto</b><span>dentro do polo</span></li>
      </ul>
    </div>
    <div class="hero__media">
      <div class="vcard" data-vcard data-tilt>
        <picture>
          <source media="(min-width:900px)" srcset="/media/hero-poster.webp" type="image/webp">
          <img src="/media/hero-poster-sm.webp" width="540" height="960" alt="Vista aérea do Edan Park ao pôr do sol, com o galpão da Edan e as serras do Sul de Minas" fetchpriority="high" decoding="async" data-poster>
        </picture>
        <video muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true" tabindex="-1" data-video data-src-lg="/media/hero.mp4" data-src-sm="/media/hero-sm.mp4"></video>
        <div class="vcard__bar" aria-hidden="true"><i data-vbar></i></div>
        <button class="vcard__ctl" type="button" aria-label="Pausar vídeo" data-vctl>${icon("pause")}${icon("play")}</button>
      </div>
      <div class="float float--a" aria-hidden="true">${icon("compass")}<span>Obra na reta final<small>${esc(site.city)} · ${esc(site.state)}</small></span></div>
      <div class="float float--b" aria-hidden="true">${icon("layers")}<span>Heliponto no polo<small>Estrutura completa</small></span></div>
    </div>
  </div>
  <a class="scroll-cue" href="#sobre" aria-label="Role para o conteúdo"><span>Role</span><i></i></a>
</section>

${marquee()}

<section class="sec" id="sobre" aria-labelledby="why-t">
  <div class="wrap split">
    <div class="sticky">
      <span class="eyebrow" data-reveal>Por que o Edan Park</span>
      <h2 class="h2" id="why-t" data-reveal style="--d:1;margin:20px 0 22px">Um polo pensado para a sua operação <span class="grad">crescer.</span></h2>
      <p class="lead" data-reveal style="--d:2">Estrutura pronta, lotes que acompanham o tamanho do negócio e uma empresa âncora que já escolheu o endereço.</p>
      <a class="btn btn--ghost" href="/empreendimento/" style="margin-top:28px;--d:3" data-reveal>Conheça o empreendimento ${icon("arrow-right")}</a>
    </div>
    <ol class="pillars">
      ${pillars
        .map(
          (p, i) => `<li data-reveal style="--d:${i}"><span class="n">${String(i + 1).padStart(2, "0")}</span><h3 class="h3">${icon(p.icon)}${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`,
        )
        .join("")}
    </ol>
  </div>
</section>

<section class="sec sec--ink2" aria-labelledby="num-t" style="padding-top:clamp(56px,8vw,110px)">
  <div class="wrap">
    <div class="sec__head">
      <span class="eyebrow" data-reveal>O Edan Park em números</span>
      <h2 class="h2" id="num-t" data-reveal style="--d:1">Escala para quem pensa grande.</h2>
    </div>
    <div class="stats" data-stats>${stats.map(stat).join("")}</div>
    <p class="form__note" style="margin-top:18px" data-reveal>Números divulgados pela imprensa regional; sujeitos a atualização pelo empreendimento.</p>
  </div>
</section>

${tourTeaser()}

<section class="sec sec--paper" aria-labelledby="obra-t">
  <div class="wrap">
    <div class="sec__head">
      <span class="eyebrow" data-reveal><span class="dot" style="margin-right:4px"></span>Andamento da obra</span>
      <h2 class="h2" id="obra-t" data-reveal style="--d:1">Obra na reta final.</h2>
      <p class="lead" data-reveal style="--d:2">O galpão âncora já está de pé e a concretagem do piso avança. A reta final traz os acabamentos e a entrega do polo.</p>
    </div>
    <div class="phases" data-phases style="--fill:${(phases.findIndex((p) => p.state === "current") / phases.length) * 100 + 3}%">
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
