// Build do site estático:  node scripts/build.mjs  →  dist/
//  - empacota/minifica JS e CSS com hash no nome (cache imutável)
//  - gera cada página de src/pages/*.mjs em dist/<rota>/index.html
//  - copia public/ (vídeo, imagens, fontes), gera sitemap, robots, 404 e cabeçalhos de cache
import { build } from "esbuild";
import { mkdir, rm, cp, writeFile, readdir, readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { join, dirname, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const preview = process.argv.includes("--preview"); // versão que abre direto do computador (file://)
const dist = join(root, preview ? "dist-preview" : "dist");

const list = async (dir, ext) => (await readdir(join(root, dir))).filter((f) => f.endsWith(ext)).sort();

// Remove indentação e linhas em branco (o gzip faz o resto). Não mexe em <pre>/<script>/<style>.
const squeeze = (html) =>
  html
    .split(/(<(?:script|style|pre)[\s\S]*?<\/(?:script|style|pre)>)/g)
    .map((chunk, i) => (i % 2 ? chunk : chunk.replace(/\n\s+/g, "\n").replace(/\n{2,}/g, "\n")))
    .join("");

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const fmt = (n) => (n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(1) + " KB" : (n / 1048576).toFixed(2) + " MB");

// Versão "abrir no computador": todos os caminhos viram relativos e links de pasta apontam para index.html.
function relativize(html, path) {
  const depth = path.endsWith(".html") ? 0 : path.split("/").filter(Boolean).length;
  const rel = "../".repeat(depth);
  return html
    .replace(/<link rel="preload" href="\/fonts\/[^>]*>\n?/g, "") // preload de fonte exige CORS: não vale em file://
    .replace(/\b(href|src|srcset|data-src|data-src-lg|data-src-sm|poster)="\/(?!\/)([^"]*)"/g, (_, attr, p) => {
      const [pathPart, tail = ""] = p.split(/(?=[?#])/);
      const target = pathPart === "" || pathPart.endsWith("/") ? pathPart + "index.html" : pathPart;
      return `${attr}="${rel}${target}${tail}"`;
    })
    .replace(/url\(\/(?!\/)/g, `url(${rel}`)
    .replace('data-root="/"', `data-root="${rel}"`)
    .replace('data-idx=""', 'data-idx="index.html"');
}

export async function buildSite() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(join(dist, "assets"), { recursive: true });
  await cp(join(root, "public"), dist, { recursive: true });

  const jsFiles = await list("src/js", ".js");
  const cssFiles = await list("src/css", ".css");
  const result = await build({
    absWorkingDir: root,
    entryPoints: [
      ...jsFiles.map((f) => ({ in: `src/js/${f}`, out: basename(f, ".js") })),
      ...cssFiles.map((f) => ({ in: `src/css/${f}`, out: basename(f, ".css") })),
    ],
    outdir: preview ? "dist-preview/assets" : "dist/assets",
    entryNames: "[name].[hash]",
    bundle: true,
    splitting: false,
    minify: true,
    format: "iife", // scripts clássicos com defer: funcionam também por duplo clique (file://)
    target: ["es2020", "chrome90", "safari14", "firefox90"],
    external: ["/fonts/*", "/media/*", "/brand/*"],
    metafile: true,
    legalComments: "none",
    logLevel: "warning",
  });

  if (preview) {
    for (const f of await list("dist-preview/assets", ".css")) {
      const file = join(dist, "assets", f);
      await writeFile(file, (await readFile(file, "utf8")).replace(/url\(\/(?!\/)/g, "url(../"));
    }
  }

  const assets = {};
  for (const [out, meta] of Object.entries(result.metafile.outputs)) {
    if (!meta.entryPoint) continue;
    assets[basename(meta.entryPoint)] = "/" + out.replace(/^dist(-preview)?\//, "");
  }
  const ctx = {
    asset(name) {
      if (!assets[name]) throw new Error(`Asset desconhecido: ${name}`);
      return assets[name];
    },
  };

  // Páginas
  const { layout } = await import(pathToFileURL(join(root, "src/layout.mjs")).href);
  const { site } = await import(pathToFileURL(join(root, "src/data/site.mjs")).href);
  const pages = [];
  for (const f of await list("src/pages", ".mjs")) {
    const page = (await import(pathToFileURL(join(root, "src/pages", f)).href)).default;
    pages.push(page);
    let html = squeeze(layout(page, ctx));
    if (preview) html = relativize(html, page.path);
    const file = page.path === "/404.html" ? join(dist, "404.html") : join(dist, page.path, "index.html");
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }

  // SEO e hospedagem
  const day = new Date().toISOString().slice(0, 10);
  const urls = pages.filter((p) => !p.noindex);
  await writeFile(
    join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((p) => `<url><loc>${site.url}${p.path}</loc><lastmod>${day}</lastmod></url>`)
      .join("\n")}\n</urlset>\n`,
  );
  await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
  await writeFile(
    join(dist, "_headers"),
    `/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/media/*\n  Cache-Control: public, max-age=31536000, immutable\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/brand/*\n  Cache-Control: public, max-age=604800\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`,
  );

  // Relatório
  const files = await walk(dist);
  const rows = [];
  for (const f of files) {
    const rel = f.slice(dist.length);
    const buf = await readFile(f);
    rows.push({ rel, size: buf.length, gz: /\.(html|css|js|svg|xml|txt)$/.test(rel) ? gzipSync(buf).length : buf.length });
  }
  const sum = (re) => rows.filter((r) => re.test(r.rel)).reduce((a, r) => ({ size: a.size + r.size, gz: a.gz + r.gz }), { size: 0, gz: 0 });
  const html = sum(/\.html$/), css = sum(/\.css$/), js = sum(/\.js$/), media = sum(/\/media\//), fonts = sum(/\/fonts\//);
  console.log(`\n✔ ${pages.length} páginas | HTML ${fmt(html.gz)} | CSS ${fmt(css.gz)} | JS ${fmt(js.gz)} (gzip) | fontes ${fmt(fonts.size)} | mídia ${fmt(media.size)}`);
  for (const r of rows.filter((r) => /\/assets\//.test(r.rel))) console.log(`   ${r.rel.padEnd(34)} ${fmt(r.size).padStart(9)}  gzip ${fmt(r.gz)}`);

  const todo = [];
  if (!site.contact.whatsapp && !site.contact.email && !site.contact.formEndpoint) todo.push("contato: preencha whatsapp, e-mail ou formEndpoint em src/data/site.mjs (o formulário depende de um deles)");
  if (!site.contact.phone) todo.push("telefone (opcional)");
  if (!site.contact.address) todo.push("endereço (opcional)");
  if (todo.length) console.log("\n⚠ Pendências (src/data/site.mjs):\n" + todo.map((t) => "   • " + t).join("\n"));
  return { pages, assets };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  buildSite().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
