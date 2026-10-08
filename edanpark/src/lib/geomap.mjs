import { esc, icon, logoIcon } from "./ui.mjs";
import { geo } from "../data/geo.mjs";
import { site } from "../data/site.mjs";

// Mapa estratégico da aba Localização: MG/SP/RJ em SVG (só o desenho) + pinos, marcador da Edan e caixa de
// destaque em HTML posicionados por % (posição por CSS: nada é medido no carregamento, funciona em aba oculta).
// Dados em src/data/geo.mjs (gerado por scripts/geo.mjs). Estilo: src/css/geomap.css · comportamento: src/js/geomap.js.
// O recorte (zoom) do mapa é feito só por CSS (--x0 --y0 --w --h, em unidades do viewBox).

const [W, H] = geo.viewBox;
const { edan, cities, states, labels, credit } = geo;
const first = cities[0].id;

// "161 km" (valor do site atual) ou "~200 km" (estimativa a confirmar)
const approx = (c) => c.source === "estimado";
const kmText = (c) => `${approx(c) ? "~" : ""}${c.km} km`;
const kmSr = (c) => `${approx(c) ? "aproximadamente " : ""}${c.km} quilômetros`;
const pos = (o) => `--x:${o.x};--y:${o.y}`;

// Lado do rótulo de cada pino: [mapa estreito, mapa largo]  (b = baixo, t = cima, l = esquerda, r = direita)
const RIGHT = new Set(["sao-paulo", "santos"]); // caixa de destaque ao lado do pino (os demais: acima)
const SIDE = { campinas: ["b", "l"], "sao-paulo": ["r", "l"], santos: ["r", "r"], "belo-horizonte": ["l", "r"], "rio-de-janeiro": ["t", "r"] };

const row = (c, i) => `
<li><button class="gm__row" type="button" data-city="${c.id}" aria-pressed="${c.id === first}">
  <i class="gm__sq" aria-hidden="true"></i>
  <span class="gm__nm"><b>${esc(c.name)}</b><small>${esc(c.note)}</small></span>
  <span class="gm__km">${approx(c) ? '<span aria-hidden="true">~</span>' : ""}<b>${c.km}</b> km<span class="sr"> por rodovia${approx(c) ? ", aproximadamente" : ""}</span></span>
</button></li>`;

const pin = (c, i) => `
<button class="gm__pin" type="button" data-city="${c.id}" data-s="${SIDE[c.id][0]}" data-w="${SIDE[c.id][1]}" style="${pos(c)};--i:${i}" aria-pressed="${c.id === first}"${c.id === first ? ' aria-current="true"' : ""}>
  <i class="gm__dot" aria-hidden="true"></i>
  <span class="gm__tag">${esc(c.name)}</span>
  <span class="sr">, ${kmSr(c)} por rodovia a partir de Estiva</span>
</button>`;

const call = (c) => `
<div class="gm__call${c.id === first ? " is-on" : ""}" data-city="${c.id}"${RIGHT.has(c.id) ? ' data-dir="r"' : ""} style="${pos(c)}" aria-hidden="true">
  <span class="gm__box"><b class="gm__bk">${kmText(c)}</b> <span>de <b>${esc(c.name)}</b></span></span>
</div>`;

const line = (cls, c, i) => `<line class="${cls}" data-city="${c.id}" x1="${edan.x}" y1="${edan.y}" x2="${c.x}" y2="${c.y}" style="--i:${i};transform-origin:${edan.x}px ${edan.y}px"/>`;

export function geoMap() {
  return `
<section class="sec gm-sec" aria-labelledby="gm-t">
  <div class="wrap gm" data-geomap>
    <div class="gm__head">
      <span class="eyebrow" data-reveal>Mapa da região</span>
      <h2 class="h2" id="gm-t" data-reveal style="--d:1">A distância até as principais cidades.</h2>
      <p class="lead" data-reveal style="--d:2">Escolha uma cidade para ver a distância por rodovia até o Edan Park, saindo de ${esc(site.city)}.</p>
    </div>

    <figure class="gm__fig">
      <div class="gm__map" style="--W:${W};--H:${H}" role="group" aria-label="Mapa esquemático do Sudeste: Edan Park e as cidades próximas">
        <svg class="gm__svg" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">
          <g class="gm__states">
            <path class="gm__s gm__s--sp" d="${states.sp}"/>
            <path class="gm__s gm__s--rj" d="${states.rj}"/>
            <path class="gm__s gm__s--mg" d="${states.mg}"/>
          </g>
          <g class="gm__lines" fill="none">
            ${cities.map((c, i) => line("gm__ln", c, i)).join("\n            ")}
            ${cities.map((c, i) => line("gm__on", c, i)).join("\n            ")}
          </g>
        </svg>
        ${["mg", "sp", "rj"].map((k) => `<span class="gm__st gm__st--${k}" style="${pos(labels[k])}" aria-hidden="true">${esc(labels[k].name)}</span>`).join("\n        ")}
        <div class="gm__edan" style="${pos(edan)}" role="img" aria-label="Edan Park, em ${esc(site.city)} (${esc(site.state)})">
          ${logoIcon("gm__logo")}
          <span class="gm__tag gm__tag--edan">Edan Park</span>
        </div>
        <div class="gm__pins" role="group" aria-label="Cidades">${cities.map(pin).join("")}</div>
        <div class="gm__calls">${cities.map(call).join("")}</div>
      </div>
      <p class="sr" role="status" aria-live="polite" data-live></p>
      <figcaption>Mapa esquemático, fora de escala. Contornos adaptados de <a href="${esc(credit.url)}" rel="noopener">${esc(credit.name)}</a> (${esc(credit.author)}, <a href="${esc(credit.licenseUrl)}" rel="noopener">${esc(credit.license)}</a>).</figcaption>
    </figure>

    <div class="gm__side">
      <p class="gm__from">${icon("pin")} Saindo de ${esc(site.city)} (${esc(site.state)})</p>
      <ul class="gm__list" aria-label="Distâncias rodoviárias aproximadas a partir de ${esc(site.city)}">${cities.map(row).join("")}
      </ul>
      <p class="gm__note">Distâncias rodoviárias aproximadas; o trajeto real depende da rota escolhida.</p>
    </div>
  </div>
</section>`;
}
