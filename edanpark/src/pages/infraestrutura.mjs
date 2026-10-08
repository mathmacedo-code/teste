import { infra } from "../data/site.mjs";
import { esc } from "../lib/ui.mjs";
import { ctaBand, pageHero } from "../lib/sections.mjs";

export default {
  path: "/infraestrutura/",
  nav: "infraestrutura",
  title: "Infraestrutura",
  description: "Infraestrutura do Edan Park: galpões em estrutura metálica, piso industrial, vias pavimentadas, heliponto e módulos administrativos em Estiva (MG).",
  scripts: ["story.js"],
  body: () => `
${pageHero({
  eyebrow: "Infraestrutura",
  title: `Estrutura de escala <span class="grad">industrial.</span>`,
  lead: "Do galpão ao heliponto: o que já está de pé no Edan Park, visto de perto.",
  bg: "/media/tour/galpao-bg.webp",
})}

<section class="sec" style="padding-top:0">
  <div class="wrap story" data-story>
    <div class="story__stage">
      <div class="story__frame">
        ${infra.map((s, i) => `<img ${i === 0 ? `src="${s.img}" class="is-on" fetchpriority="high"` : `data-src="${s.img}"`} width="720" height="1280" alt="${esc(s.title)}" decoding="async" data-img>`).join("")}
        <div class="story__tag"><span data-tag>${esc(infra[0].kicker)}</span><span class="story__dots" aria-hidden="true">${infra.map((_, i) => `<i${i === 0 ? ' class="is-on"' : ""}></i>`).join("")}</span></div>
      </div>
    </div>
    <div class="story__steps">
      ${infra
        .map(
          (s, i) => `<article class="step${i === 0 ? " is-on" : ""}" data-step data-kicker="${esc(s.kicker)}">
        <span class="n">${String(i + 1).padStart(2, "0")} / ${String(infra.length).padStart(2, "0")} · ${esc(s.kicker).toUpperCase()}</span>
        <h2 class="h2">${esc(s.title)}</h2>
        <p class="lead">${esc(s.text)}</p>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>

${ctaBand({ title: "Quer conhecer de perto?", text: "Agende uma visita guiada ao polo e peça o memorial descritivo com as especificações técnicas." })}
`,
};
