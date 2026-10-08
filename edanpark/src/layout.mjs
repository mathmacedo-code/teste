import { site, nav } from "./data/site.mjs";
import { esc, icon, logoWord } from "./lib/ui.mjs";

const year = new Date().getFullYear();

export function header(page) {
  const links = nav
    .filter((n) => !n.cta)
    .map((n) => `<a href="${n.href}"${n.id === page.nav ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`)
    .join("");
  const cta = nav.find((n) => n.cta);
  return `
<header class="hdr" data-hdr>
  <div class="hdr__in wrap">
    <a class="brand" href="/">${logoWord()}<span class="sr">${esc(site.tagline)}</span></a>
    <nav class="nav" aria-label="Principal" data-nav>${links}</nav>
    <a class="btn btn--primary btn--sm hdr__cta" href="${cta.href}"${cta.id === page.nav ? ' aria-current="page"' : ""}>Falar com a equipe</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menu" data-burger><span></span><span></span></button>
  </div>
</header>
<div class="menu" id="menu" data-menu hidden>
  <nav aria-label="Menu móvel">
    ${nav.map((n, i) => `<a href="${n.href}" style="--i:${i}"${n.id === page.nav ? ' aria-current="page"' : ""}><span>${String(i + 1).padStart(2, "0")}</span>${esc(n.label)}</a>`).join("")}
  </nav>
  <p class="menu__foot">${esc(site.tagline)} · ${esc(site.city)}, ${esc(site.state)}</p>
</div>`;
}

function contactLines() {
  const c = site.contact;
  const out = [];
  if (c.whatsapp) out.push(`<a href="https://wa.me/${esc(c.whatsapp)}" rel="noopener">${icon("whatsapp")} WhatsApp</a>`);
  if (c.phone) out.push(`<a href="tel:${esc(c.phone.replace(/\D/g, ""))}">${icon("phone")} ${esc(c.phone)}</a>`);
  if (c.email) out.push(`<a href="mailto:${esc(c.email)}">${icon("mail")} ${esc(c.email)}</a>`);
  if (site.social.instagram) out.push(`<a href="${esc(site.social.instagram)}" rel="noopener">${icon("instagram")} Instagram</a>`);
  if (site.social.linkedin) out.push(`<a href="${esc(site.social.linkedin)}" rel="noopener">${icon("linkedin")} LinkedIn</a>`);
  return out;
}

export function footer() {
  const contact = contactLines();
  return `
<footer class="ftr">
  <div class="wrap ftr__grid">
    <div class="ftr__brand">
      <a href="/" aria-label="${esc(site.name)} — início">${logoWord()}</a>
      <p class="ftr__tag">${esc(site.tagline)}</p>
      <p>Lotes modulares de 5.000 a 35.000 m² em ${esc(site.city)}, ${esc(site.region)}.</p>
    </div>
    <nav aria-label="Rodapé"><h2>Navegação</h2><ul>${nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
    <div><h2>Fale com a gente</h2>${
      contact.length
        ? `<ul class="ftr__contact">${contact.map((c) => `<li>${c}</li>`).join("")}</ul>`
        : `<p class="ftr__hint">Envie uma mensagem pelo formulário e retornamos em breve.</p>`
    }<a class="btn btn--ghost btn--sm" href="/contato/">Pedir contato ${icon("arrow-right")}</a></div>
  </div>
  <div class="wrap ftr__base"><span>© ${year} ${esc(site.name)} · ${esc(site.tagline)}</span><span>${esc(site.city)}, ${esc(site.state)}</span></div>
</footer>`;
}

export function jsonLd(page) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.tagline + " em " + site.city + ", " + site.region,
    url: site.url,
    logo: site.url + "/brand/favicon.svg",
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.state, addressCountry: "BR" },
    ...(site.social.instagram || site.social.linkedin ? { sameAs: [site.social.instagram, site.social.linkedin].filter(Boolean) } : {}),
  };
  const graph = [org];
  if (page.nav === "localizacao" || page.nav === "inicio") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "Place",
      name: site.name + " — " + site.tagline,
      geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lon },
      address: org.address,
    });
  }
  return graph.map((g) => `<script type="application/ld+json">${JSON.stringify(g)}</script>`).join("");
}

export function layout(page, ctx) {
  const url = site.url + page.path;
  const title = page.nav === "inicio" ? `${site.name} — ${site.tagline} em ${site.city}, ${site.state}` : `${page.title} · ${site.name}`;
  const css = ["main.css", ...(page.css || [])].map((f) => `<link rel="stylesheet" href="${ctx.asset(f)}">`).join("");
  const js = ["main.js", ...(page.scripts || [])].map((f) => `<script defer src="${ctx.asset(f)}"></script>`).join("");
  return `<!doctype html>
<html lang="pt-BR" data-contact="/contato/">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="theme-color" content="#ffffff">
<script>document.documentElement.className+=" js"</script>
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url}/media/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossorigin>
${page.head || ""}
${css}
${jsonLd(page)}
</head>
<body class="page-${page.nav}${page.bodyClass ? " " + page.bodyClass : ""}">
<a class="skip" href="#main">Pular para o conteúdo</a>
${header(page)}
<main id="main">
${page.body(ctx)}
</main>
${page.nofooter ? "" : footer()}
${js}
</body>
</html>`;
}
