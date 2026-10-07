import { site, anchor, faq } from "../data/site.mjs";
import { icon, esc } from "../lib/ui.mjs";
import { ctaBand, pageHero } from "../lib/sections.mjs";

export default {
  path: "/empreendimento/",
  nav: "empreendimento",
  title: "Empreendimento",
  description: "Conheça o Edan Park: condomínio industrial e logístico em Estiva (MG), com 13 lotes modulares de 5.000 a 35.000 m² e a Edan como empresa âncora.",
  scripts: ["lot.js"],
  body: () => `
${pageHero({
  eyebrow: "Empreendimento",
  title: `Um polo feito para a operação <span class="grad">crescer.</span>`,
  lead: "Condomínio industrial e logístico em Estiva, no Sul de Minas Gerais, com lotes modulares que acompanham o tamanho do seu negócio.",
  bg: "/media/tour/fachada-bg.webp",
})}

<section class="sec" aria-labelledby="proj-t">
  <div class="wrap split">
    <div class="sticky">
      <span class="eyebrow" data-reveal>O projeto</span>
      <h2 class="h2" id="proj-t" data-reveal style="--d:1;margin-top:20px">Modularidade como ponto de partida.</h2>
    </div>
    <div class="prose" data-reveal style="--d:2">
      <p><strong>O Edan Park é um condomínio industrial e logístico em ${esc(site.city)}, ${esc(site.region)}.</strong> São 13 lotes modulares, de 5.000 a 35.000 m², pensados para receber desde uma operação enxuta até um grande centro de distribuição.</p>
      <p>A modularidade está no centro do projeto: a empresa começa no tamanho certo e tem espaço para crescer dentro do polo, com infraestrutura compartilhada e estrutura de apoio já prevista.</p>
      <p>O investimento privado de cerca de R$ 20 milhões na estrutura do polo e a chegada da Edan, como empresa âncora, dão o tom: um empreendimento feito para operar de verdade, e não só para ser inaugurado.</p>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="anchor-card" data-reveal="zoom">
      <span class="eyebrow">Empresa âncora</span>
      <h2 class="h2" style="max-width:20ch">${esc(anchor.name)} no Edan Park</h2>
      <p class="lead">${esc(anchor.text)}</p>
      <div class="facts">${anchor.facts.map((f) => `<div><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join("")}</div>
    </div>
  </div>
</section>

<section class="sec sec--paper" aria-labelledby="lot-t">
  <div class="wrap">
    <div class="sec__head">
      <span class="eyebrow" data-reveal>Lotes modulares</span>
      <h2 class="h2" id="lot-t" data-reveal style="--d:1">De 5.000 a 35.000 m².</h2>
      <p class="lead" data-reveal style="--d:2">Arraste e veja a escala do espaço que a sua operação precisa. É uma referência visual: a disponibilidade e as combinações de lotes são confirmadas com a nossa equipe.</p>
    </div>
    <div class="lot" data-lot data-reveal="zoom">
      <div class="lot__ctl">
        <h3 class="h3">Quanto espaço a sua operação precisa?</h3>
        <div class="lot__out"><span data-out>12.000</span><small>m²</small></div>
        <input class="range" type="range" min="5000" max="35000" step="500" value="12000" aria-label="Área desejada em metros quadrados" data-range>
        <div class="lot__scale"><span>5.000 m²</span><span>35.000 m²</span></div>
        <p class="lot__eq"><span>≈ <b data-eq-pitch>1,7</b> campos de futebol</span><span><b data-eq-pct>34%</b> do maior lote</span></p>
        <a class="btn btn--primary" href="/contato/?area=12000" data-lot-cta style="justify-self:start">Quero um lote deste tamanho ${icon("arrow-right")}</a>
      </div>
      <div class="lot__viz" aria-hidden="true">
        <em>Escala relativa</em>
        <i style="width:100%;height:100%"></i>
        <i style="width:37.8%;height:37.8%"></i>
        <i class="sq" data-sq style="width:58.5%;height:58.5%"><span data-sq-t>12.000 m²</span></i>
      </div>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="faq-t">
  <div class="wrap split">
    <div class="sticky">
      <span class="eyebrow" data-reveal>Dúvidas comuns</span>
      <h2 class="h2" id="faq-t" data-reveal style="--d:1;margin-top:20px">O que mais perguntam sobre o polo.</h2>
    </div>
    <div class="faq" data-reveal style="--d:2">
      ${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}
    </div>
  </div>
</section>

${ctaBand()}
`,
};
