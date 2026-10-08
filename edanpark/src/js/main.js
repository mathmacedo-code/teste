// JS compartilhado: cabeçalho, menu móvel, animações de entrada, contadores, prefetch.
// ~3 KB gzip. Tudo é aprimoramento progressivo: sem JS o site continua legível.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

/* ---------- Cabeçalho + barra de progresso ---------- */
const hdr = $("[data-hdr]");
const bar = document.createElement("div");
bar.className = "progress";
bar.setAttribute("aria-hidden", "true");
document.body.append(bar);
let lastY = scrollY, menuOpen = false, tick = false;

function onScroll() {
  const y = scrollY;
  hdr.classList.toggle("is-solid", y > 16 || menuOpen);
  if (Math.abs(y - lastY) > 6) {
    hdr.classList.toggle("is-hidden", y > 520 && y > lastY && !menuOpen);
    lastY = y;
  }
  const h = root.scrollHeight - innerHeight;
  bar.style.setProperty("--p", h > 0 ? Math.min(1, y / h).toFixed(4) : 0);
}
addEventListener("scroll", () => !tick && (tick = true, requestAnimationFrame(() => ((tick = false), onScroll()))), { passive: true });
onScroll();

/* ---------- Menu móvel ---------- */
const burger = $("[data-burger]");
const menu = $("[data-menu]");
function setMenu(open) {
  menuOpen = open;
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  root.style.overflow = open ? "hidden" : "";
  if (open) {
    menu.hidden = false;
    hdr.classList.remove("is-hidden");
    requestAnimationFrame(() => menu.classList.add("is-open"));
  } else {
    menu.classList.remove("is-open");
    setTimeout(() => !menuOpen && (menu.hidden = true), 400);
  }
  onScroll();
}
burger?.addEventListener("click", () => setMenu(!menuOpen));
menu?.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
addEventListener("keydown", (e) => e.key === "Escape" && menuOpen && setMenu(false));
matchMedia("(min-width:961px)").addEventListener("change", (e) => e.matches && menuOpen && setMenu(false));

/* ---------- Entrada dos elementos ao rolar ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target))),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  $$("[data-reveal],[data-phases]").forEach((el) => io.observe(el));

  // Contadores
  const fmt = new Intl.NumberFormat("pt-BR");
  const co = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        const el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = 1700;
        if (reduce) return;
        (function step(t) {
          const p = Math.min(1, (t - t0) / dur);
          el.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - p, 4))));
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      }),
    { threshold: 0.6 },
  );
  $$("[data-count]").forEach((el) => {
    el.textContent = "0";
    co.observe(el);
  });
} else {
  $$("[data-reveal],[data-phases]").forEach((el) => el.classList.add("is-in"));
}

/* ---------- Prefetch das outras abas (navegação instantânea) ---------- */
const seen = new Set();
const prefetch = (a) => {
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || seen.has(u.pathname) || u.pathname === location.pathname) return;
  if (navigator.connection?.saveData || location.protocol === "file:") return;
  seen.add(u.pathname);
  const l = document.createElement("link");
  l.rel = "prefetch";
  l.href = u.pathname;
  document.head.append(l);
};
document.addEventListener("pointerover", (e) => e.target.closest?.("a[href^='/']") && prefetch(e.target.closest("a")), { passive: true });
document.addEventListener("touchstart", (e) => e.target.closest?.("a[href^='/']") && prefetch(e.target.closest("a")), { passive: true });
