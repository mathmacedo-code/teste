// Servidor local:  npm run dev  →  http://localhost:4173  (reconstrói ao salvar; --no-watch desliga)
// Suporta Range requests (obrigatório para o vídeo tocar/buscar corretamente).
import { createServer } from "node:http";
import { createReadStream, watch } from "node:fs";
import { stat, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { execFile } from "node:child_process";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const port = Number(process.env.PORT || 4173);
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4", ".woff2": "font/woff2",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon",
};

function rebuild() {
  return new Promise((res) => execFile("node", [join(root, "scripts/build.mjs")], (err, out, errout) => {
    if (err) console.error(errout || err);
    else console.log(out.split("\n").find((l) => l.startsWith("✔")) || "build ok");
    res();
  }));
}

async function resolvePath(url) {
  let p = normalize(decodeURIComponent(url.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  let f = join(dist, p);
  try {
    const s = await stat(f);
    if (s.isDirectory()) f = join(f, "index.html");
  } catch {
    if (!extname(f)) f = join(f, "index.html");
  }
  return f;
}

const server = createServer(async (req, res) => {
  try {
    const f = await resolvePath(req.url);
    const s = await stat(f);
    const type = MIME[extname(f)] || "application/octet-stream";
    const headers = { "Content-Type": type, "Cache-Control": "no-cache", "Accept-Ranges": "bytes" };
    const range = req.headers.range;
    if (range) {
      const [a, b] = range.replace("bytes=", "").split("-");
      const start = Number(a) || 0;
      const end = b ? Number(b) : s.size - 1;
      res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${s.size}`, "Content-Length": end - start + 1 });
      createReadStream(f, { start, end }).pipe(res);
    } else if (/^(text\/|application\/(json|xml)|image\/svg)/.test(type) && /gzip/.test(req.headers["accept-encoding"] || "")) {
      // como as hospedagens reais: texto vai comprimido
      const body = gzipSync(await readFile(f));
      res.writeHead(200, { ...headers, "Content-Encoding": "gzip", "Content-Length": body.length, Vary: "Accept-Encoding" });
      res.end(body);
    } else {
      res.writeHead(200, { ...headers, "Content-Length": s.size });
      createReadStream(f).pipe(res);
    }
  } catch {
    try {
      const f = join(dist, "404.html");
      const s = await stat(f);
      res.writeHead(404, { "Content-Type": MIME[".html"], "Content-Length": s.size });
      createReadStream(f).pipe(res);
    } catch {
      res.writeHead(404).end("404");
    }
  }
});

await rebuild();
server.listen(port, () => console.log(`Edan Park → http://localhost:${port}`));

if (!process.argv.includes("--no-watch")) {
  let t;
  for (const d of ["src", "public"]) {
    watch(join(root, d), { recursive: true }, () => {
      clearTimeout(t);
      t = setTimeout(rebuild, 200);
    });
  }
}
