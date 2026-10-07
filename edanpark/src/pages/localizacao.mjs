import { site } from "../data/site.mjs";
import { icon, esc } from "../lib/ui.mjs";
import { ctaBand, pageHero, mapsUrl } from "../lib/sections.mjs";

const { lat, lon } = site.geo;
const osm = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.04},${lat - 0.025},${lon + 0.04},${lat + 0.025}&layer=mapnik&marker=${lat},${lon}`;

export default {
  path: "/localizacao/",
  nav: "localizacao",
  title: "Localização",
  description: "O Edan Park fica em Estiva, no Sul de Minas Gerais. Veja a localização do polo industrial e logístico e como visitar.",
  scripts: ["map.js"],
  body: () => `
${pageHero({
  eyebrow: "Localização",
  title: `No coração do <span class="grad">Sul de Minas.</span>`,
  lead: "Em Estiva (MG), o Edan Park une o ambiente de serras e a estrutura de um polo industrial e logístico.",
  bg: "/media/tour/modulos-bg.webp",
})}

<section class="sec" style="padding-top:0">
  <div class="wrap loc">
    <div data-reveal>
      <p class="loc__big grad">${esc(site.city)}<br>${esc(site.state)}</p>
      <ul class="loc__list">
        <li><span>Município</span><b>${esc(site.city)}</b></li>
        <li><span>Estado</span><b>Minas Gerais</b></li>
        <li><span>Região</span><b>${esc(site.region)}</b></li>
        ${site.contact.address ? `<li><span>Endereço</span><b>${esc(site.contact.address)}</b></li>` : ""}
      </ul>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:32px">
        <a class="btn btn--primary" href="${mapsUrl}" target="_blank" rel="noopener">Como chegar ${icon("arrow-up-right")}</a>
        <a class="btn btn--ghost" href="/contato/">Agendar visita</a>
      </div>
    </div>
    <div class="map" data-map data-reveal="zoom" style="--bg:url(/media/tour/visao-geral-bg.webp)">
      <div class="map__pin">
        <span class="dot"></span>
        <strong class="h3">${esc(site.name)}</strong>
        <span>${esc(site.city)} · ${esc(site.state)}</span>
        <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
          <button class="btn btn--light btn--sm" type="button" data-load-map data-src="${osm}">Ver no mapa</button>
        </div>
        <small style="color:var(--muted);max-width:30ch">Posição aproximada do município. Peça a localização exata e o roteiro de visita à nossa equipe.</small>
      </div>
    </div>
  </div>
</section>

${ctaBand({ title: "Vamos combinar uma visita?", text: "Conheça o polo pessoalmente e veja de perto os lotes disponíveis." })}
`,
};
