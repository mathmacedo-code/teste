// Gerador do mapa estratégico da aba Localização.   node scripts/geo.mjs [caminho/para/@svg-maps/brazil/index.js]
// Roda UMA vez; a saída (src/data/geo.mjs) é versionada. Não é dependência do projeto.
//
// Como obter o pacote (fora do projeto, sem mexer no package.json):
//   mkdir /tmp/svgmaps && cd /tmp/svgmaps && npm init -y && npm i --no-save @svg-maps/brazil
//   node scripts/geo.mjs /tmp/svgmaps/node_modules/@svg-maps/brazil/index.js
//
// Contornos: pacote npm @svg-maps/brazil 2.0.0, de Victor Cazanave, licença CC BY 4.0
// (https://creativecommons.org/licenses/by/4.0/) — exige crédito e aviso de modificação (reprojetado,
// simplificado e suavizado aqui). O crédito sai em geo.credit e é mostrado na legenda do mapa.
//
// Etapas: lê MG/SP/RJ → converte para o viewBox final → suaviza (Chaikin, 1 iteração) → escreve caminhos
// relativos com 1 casa decimal. As cidades usam a mesma projeção (lat/lon → x/y), calibrada por mínimos quadrados
// com as extremidades conhecidas dos estados (resíduo < 1 px no SVG original):
//   x = 15.6058 * lon + 1155.161      y = -16.4345 * lat + 70.998      (SVG original, 613 × 639)
import { writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src/data/geo.mjs");

// ---------------------------------------------------------------- dados de entrada
const STATES = ["mg", "sp", "rj"]; // ES ficou de fora de propósito (contexto desnecessário)
const SCALE = 3.75; // ampliação sobre o SVG original (~4x)
const VIEW = [820, 730]; // viewBox final
const MIN_ISLAND = 40; // ilhas menores que isto (em unidades² do viewBox final) são descartadas

const proj = (lat, lon) => [15.6058 * lon + 1155.161, -16.4345 * lat + 70.998];

const EDAN = { lat: -22.4589, lon: -46.0214 }; // Estiva (MG)

// km = distância RODOVIÁRIA aproximada a partir de Estiva.
// CONFIRMAR: só Campinas veio do site atual do cliente (161 km). As outras são ESTIMATIVAS — validar antes de publicar.
const CITIES = [
  { id: "campinas", name: "Campinas", note: "SP", lat: -22.9099, lon: -47.0626, km: 161, source: "site-atual" },
  { id: "sao-paulo", name: "São Paulo", note: "SP", lat: -23.5505, lon: -46.6333, km: 200, source: "estimado" }, // CONFIRMAR
  { id: "santos", name: "Santos", note: "SP", lat: -23.9608, lon: -46.3336, km: 275, source: "estimado" }, // CONFIRMAR
  { id: "belo-horizonte", name: "Belo Horizonte", note: "MG", lat: -19.9167, lon: -43.9345, km: 400, source: "estimado" }, // CONFIRMAR
  { id: "rio-de-janeiro", name: "Rio de Janeiro", note: "RJ", lat: -22.9068, lon: -43.1729, km: 400, source: "estimado" }, // CONFIRMAR
];

// Onde ficam os nomes dos estados (lat/lon) — sempre em área livre de pinos.
const LABELS = {
  mg: { name: "Minas Gerais", lat: -20.3, lon: -46.0 },
  sp: { name: "São Paulo", lat: -24.15, lon: -47.35 },
  rj: { name: "Rio de Janeiro", lat: -22.335, lon: -43.36 },
};

// ---------------------------------------------------------------- leitura do pacote
async function loadPackage() {
  let file = process.argv[2] || process.env.SVG_MAPS_BRAZIL;
  if (!file) {
    try {
      file = createRequire(join(root, "package.json")).resolve("@svg-maps/brazil");
    } catch {
      console.error("Informe o caminho do pacote:  node scripts/geo.mjs /caminho/node_modules/@svg-maps/brazil/index.js\n(instale-o fora do projeto: npm i --no-save @svg-maps/brazil)");
      process.exit(1);
    }
  }
  return (await import(pathToFileURL(resolve(file)).href)).default;
}

// "m 30.7,238 l ..." (m/l/h/v/z, relativos ou absolutos) → lista de contornos [[x,y],...]
function parsePath(d) {
  const t = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  const subs = [];
  let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0, cur = null;
  const num = () => parseFloat(t[i++]);
  while (i < t.length) {
    if (/[a-zA-Z]/.test(t[i])) cmd = t[i++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    if (C === "Z") {
      if (cur) subs.push(cur), (cur = null);
      x = sx, y = sy;
    } else if (C === "M" || C === "L") {
      const a = num(), b = num();
      x = rel ? x + a : a, y = rel ? y + b : b;
      if (C === "M") {
        if (cur) subs.push(cur);
        sx = x, sy = y, cur = [];
        cmd = rel ? "l" : "L"; // pares seguintes do M são L
      }
      cur.push([x, y]);
    } else if (C === "H") {
      x = rel ? x + num() : num();
      cur.push([x, y]);
    } else if (C === "V") {
      y = rel ? y + num() : num();
      cur.push([x, y]);
    } else throw new Error(`comando de path não suportado: ${cmd}`);
  }
  if (cur) subs.push(cur);
  return subs.map((s) => (s.length > 1 && s[0][0] === s.at(-1)[0] && s[0][1] === s.at(-1)[1] ? s.slice(0, -1) : s));
}

// Chaikin em polígono fechado: cada aresta vira dois pontos a 1/4 e 3/4.
function chaikin(pts) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
    out.push([0.75 * ax + 0.25 * bx, 0.75 * ay + 0.25 * by], [0.25 * ax + 0.75 * bx, 0.25 * ay + 0.75 * by]);
  }
  return out;
}

const area = (p) => Math.abs(p.reduce((a, [x, y], i) => a + x * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * y, 0)) / 2;
const r1 = (n) => Math.round(n * 10) / 10;
const fmt = (n) => (Object.is(n, -0) ? 0 : n); // evita "-0"

// contorno → "Mx y" + "l" relativo (1 casa decimal, sem acumular erro) + "z"
function toPath(pts) {
  const q = pts.map(([x, y]) => [r1(x), r1(y)]).filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
  let s = `M${fmt(q[0][0])} ${fmt(q[0][1])}l`;
  let prev = null;
  for (let i = 1; i < q.length; i++) {
    for (const v of [r1(q[i][0] - q[i - 1][0]), r1(q[i][1] - q[i - 1][1])].map(fmt)) {
      const str = String(v);
      s += prev !== null && !str.startsWith("-") ? " " + str : str;
      prev = str;
    }
  }
  return s + "z";
}

// ---------------------------------------------------------------- geração
const pkg = await loadPackage();
const raw = Object.fromEntries(STATES.map((id) => [id, parsePath(pkg.locations.find((l) => l.id === id).path)]));

// caixa do conjunto (SVG original) → deslocamento para centralizar no viewBox final
let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
for (const subs of Object.values(raw)) for (const s of subs) for (const [x, y] of s) (mnx = Math.min(mnx, x)), (mxx = Math.max(mxx, x)), (mny = Math.min(mny, y)), (mxy = Math.max(mxy, y));
const ox = (VIEW[0] - (mxx - mnx) * SCALE) / 2 - mnx * SCALE;
const oy = (VIEW[1] - (mxy - mny) * SCALE) / 2 - mny * SCALE;
const T = ([x, y]) => [x * SCALE + ox, y * SCALE + oy];
const place = (lat, lon) => {
  const [x, y] = T(proj(lat, lon));
  return { x: r1(x), y: r1(y) };
};

const states = {};
let dropped = 0;
for (const id of STATES) {
  states[id] = raw[id]
    .map((s) => chaikin(s.map(T)))
    .filter((s) => (area(s) < MIN_ISLAND ? (dropped++, false) : true))
    .map(toPath)
    .join("");
}

const geo = {
  viewBox: VIEW,
  states,
  labels: Object.fromEntries(Object.entries(LABELS).map(([id, l]) => [id, { name: l.name, ...place(l.lat, l.lon) }])),
  edan: { ...place(EDAN.lat, EDAN.lon), lat: EDAN.lat, lon: EDAN.lon },
  cities: CITIES.map(({ lat, lon, ...c }) => ({ id: c.id, name: c.name, ...place(lat, lon), lat, lon, km: c.km, note: c.note, source: c.source })),
  credit: { name: "@svg-maps/brazil", author: "Victor Cazanave", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/", url: "https://github.com/VictorCazanave/svg-maps", note: "reprojetado, simplificado e suavizado" },
};

const header = `// GERADO por scripts/geo.mjs — não edite à mão (rode o gerador de novo).
// Contornos de MG, SP e RJ: @svg-maps/brazil 2.0.0, de Victor Cazanave, licença CC BY 4.0
// (https://creativecommons.org/licenses/by/4.0/). Modificados: reprojetados, simplificados e suavizados.
//
// CONFIRMAR: distâncias RODOVIÁRIAS aproximadas a partir de Estiva (MG). Só Campinas (161 km) veio do site atual
// do cliente (source: "site-atual"); São Paulo, Santos, Belo Horizonte e Rio de Janeiro são estimativas (source: "estimado").
`;
const j = JSON.stringify;
const body = `export const geo = {
  viewBox: ${j(geo.viewBox)},
  states: {
${Object.entries(geo.states).map(([k, v]) => `    ${k}: ${j(v)},`).join("\n")}
  },
  labels: ${j(geo.labels)},
  edan: ${j(geo.edan)},
  cities: [
${geo.cities.map((c) => `    ${j(c)},`).join("\n")}
  ],
  credit: ${j(geo.credit)},
};

export default geo;
`;
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, header + body);

const bytes = Object.values(states).reduce((a, s) => a + s.length, 0);
console.log(`geo.mjs: estados ${(bytes / 1024).toFixed(1)} KB (${Object.entries(states).map(([k, v]) => `${k} ${(v.length / 1024).toFixed(1)}`).join(", ")}), ilhas descartadas: ${dropped}, viewBox ${VIEW.join("×")}`);
for (const c of geo.cities) console.log(`  ${c.name.padEnd(15)} x=${c.x} y=${c.y} ${c.km} km (${c.source})`);
console.log(`  Edan (Estiva)   x=${geo.edan.x} y=${geo.edan.y}`);
