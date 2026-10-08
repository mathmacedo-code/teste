// Gera UM ÚNICO ARQUIVO:  node scripts/build-single.mjs  →  dist-single/index.html
// Tudo dentro dele: CSS, JS, fontes, imagens, vídeo e as 6 abas (trocadas por #endereço).
// Ordem do documento pensada para a página aparecer enquanto o resto ainda chega:
//   <head> com CSS+fontes → cabeçalho/abas (poster do hero já embutido) → imagens → vídeo (base64, por último) → JS
import { build } from "esbuild";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist-single");
const imp = (f) => import(pathToFileURL(join(root, f)).href);
const b64 = async (file) => (await readFile(file)).toString("base64");
const uri = async (file, mime) => `data:${mime};base64,${await b64(file)}`;
const kb = (n) => (n / 1024).toFixed(0) + " KB";

const { site, nav } = await imp("src/data/site.mjs");
const { header, footer, jsonLd } = await imp("src/layout.mjs");
const pageFiles = ["index", "empreendimento", "infraestrutura", "localizacao", "tour-360", "contato"];
const pages = [];
for (const f of pageFiles) pages.push((await imp(`src/pages/${f}.mjs`)).default);

// ---------- CSS (+ fontes embutidas) e JS
const css = await build({
  absWorkingDir: root,
  entryPoints: ["src/css/main.css", "src/css/tour.css"],
  outdir: "out",
  bundle: true,
  minify: true,
  write: false,
  external: ["/fonts/*", "/media/*", "/brand/*"],
  logLevel: "warning",
});
let styles = css.outputFiles.map((f) => f.text).join("\n");
for (const [name, file] of [["sora", "sora.woff2"], ["manrope", "manrope.woff2"]]) {
  styles = styles.replaceAll(`url(/fonts/${file})`, `url(${await uri(join(root, "public/fonts", file), "font/woff2")})`);
}
const views = pages.map((p) => p.nav);
styles += `.js [data-view]{display:none}${views.map((v) => `.js[data-v="${v}"] [data-view="${v}"]`).join(",")}{display:block;animation:viewin .45s var(--ease)}@keyframes viewin{from{transform:translateY(14px)}}`;

const js = (
  await build({ absWorkingDir: root, entryPoints: ["src/single/single.js"], bundle: true, minify: true, write: false, format: "iife", target: ["es2020", "chrome90", "safari14", "firefox90"], logLevel: "warning" })
).outputFiles[0].text.replaceAll("</script", "<\\/script");

// ---------- Mídia embutida
const tourDir = join(root, "public/media/tour");
const imgDict = {}; // "/media/tour/x.webp" -> data URI (fotos leves 540x960)
const photoUri = async (path) => (imgDict[path] ||= await uri(join(root, "single/lite", basename(path)), "image/webp"));
const tileUri = async (path) => uri(join(tourDir, basename(path)), "image/webp"); // halos/fundos minúsculos (~1 KB)
const posterUri = await uri(join(root, "public/media/hero-poster-sm.webp"), "image/webp");
const videoB64 = await b64(join(root, "single/hero-lite.mp4"));

// ---------- Abas
const LINKS = { "": "#inicio", empreendimento: "#empreendimento", infraestrutura: "#infraestrutura", localizacao: "#localizacao", "tour-360": "#tour", contato: "#contato" };
async function transform(html) {
  html = html.replace(/href="\/([a-z0-9-]*)\/?"/g, (m, k) => (k in LINKS ? `href="${LINKS[k]}"` : m));
  // poster do hero: imagem embutida direto no HTML (é o LCP)
  html = html.replace(/<picture>[\s\S]*?<img[^>]*alt="([^"]*)"[^>]*>\s*<\/picture>/, (_, alt) => `<img src="${posterUri}" width="540" height="960" alt="${alt}" decoding="async" data-poster>`);
  // fotos: viram data-src="/media/tour/x.webp" e são preenchidas pelo dicionário (sem repetir o base64)
  html = html.replace(/(?<![\w-])src="(\/media\/tour\/[^"]+\.webp)"/g, 'data-src="$1"'); // (não pega o data-src já existente)
  for (const m of html.matchAll(/data-src="(\/media\/tour\/[^"]+\.webp)"/g)) await photoUri(m[1]);
  // halos e fundos minúsculos: embutidos onde são usados
  for (const m of [...html.matchAll(/url\((\/media\/tour\/[^)]+)\)/g)]) html = html.replace(m[0], `url(${await tileUri(m[1])})`);
  return html;
}
const bodies = [];
for (const p of pages) {
  const inner = await transform(p.body({ asset: () => "" }));
  bodies.push(`<div data-view="${p.nav}" data-title="${(p.nav === "inicio" ? `${site.name} — ${site.tagline} em ${site.city}, ${site.state}` : `${p.title} · ${site.name}`).replace(/"/g, "&quot;")}">${inner}</div>`);
}
const hdr = await transform(header({ nav: null }));
const ftr = await transform(footer());

const home = pages[0];
const favicon = `data:image/svg+xml;base64,${await b64(join(root, "public/brand/favicon.svg"))}`;
const first = `(function(d){d.className+=" js";var h=decodeURIComponent(location.hash.slice(1)).split("?")[0],m={"":"inicio",inicio:1,empreendimento:1,infraestrutura:1,localizacao:1,tour:1,contato:1};d.setAttribute("data-v",m[h]?(h||"inicio"):"inicio")})(document.documentElement)`;
const hydrate = `(function(){var d=JSON.parse(document.getElementById("imgs").textContent);window.__imgs=d;document.querySelectorAll("img[data-src]").forEach(function(i){var u=d[i.getAttribute("data-src")];if(u){i.src=u;i.removeAttribute("data-src")}})})()`;

const html = `<!doctype html>
<html lang="pt-BR" data-contact="#contato">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${site.name} — ${site.tagline} em ${site.city}, ${site.state}</title>
<meta name="description" content="${home.description.replace(/"/g, "&quot;")}">
<meta name="theme-color" content="#0a0d12">
<link rel="canonical" href="${site.url}/">
<meta property="og:type" content="website">
<meta property="og:title" content="${site.name} — ${site.tagline}">
<meta property="og:description" content="${home.description.replace(/"/g, "&quot;")}">
<meta property="og:url" content="${site.url}/">
<link rel="icon" href="${favicon}" type="image/svg+xml">
<script>${first}</script>
<style>${styles}</style>
${jsonLd({ nav: "inicio" })}
</head>
<body>
<a class="skip" href="#main">Pular para o conteúdo</a>
${hdr}
<main id="main">
${bodies.join("\n")}
</main>
${ftr}
<script id="imgs" type="application/json">${JSON.stringify(imgDict)}</script>
<script>${hydrate}</script>
<script id="hv" type="application/octet-stream">${videoB64}</script>
<script>${js}</script>
</body>
</html>
`.replace(/\n\s+/g, "\n");

await mkdir(out, { recursive: true });
await writeFile(join(out, "index.html"), html);
const size = (await stat(join(out, "index.html"))).size;
console.log(`✔ dist-single/index.html — ${kb(size)} (${(size / 1048576).toFixed(2)} MB)`);
console.log(`   CSS+fontes ${kb(styles.length)} · JS ${kb(js.length)} · fotos ${kb(JSON.stringify(imgDict).length)} · poster ${kb(posterUri.length)} · vídeo ${kb(videoB64.length)}`);
