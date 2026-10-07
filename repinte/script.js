/* Repinte — comportamento da página */

/* >>> CONFIRMAR: número oficial do WhatsApp (somente dígitos, com 55 + DDD) <<< */
const WHATSAPP = "5519900000000";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

/* links de WhatsApp */
$$("[data-wa]").forEach((a) => {
  a.href = wa(a.dataset.wa);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
});
$("#yr").textContent = new Date().getFullYear();

/* ---------------- abertura: rolo pintando em zigue-zague ---------------- */
function runLoader() {
  const loader = $("#loader");
  if (!loader) return Promise.resolve();
  if (reduced) { loader.remove(); return Promise.resolve(); }

  document.body.classList.add("lock");
  const N = 5;
  const W = innerWidth, H = innerHeight;
  const bandH = H / N;
  const bands = $(".bands", loader);
  for (let i = 0; i < N; i++) bands.appendChild(document.createElement("i"));
  const els = $$("i", bands);

  const roller = $(".roller", loader);
  const rw = Math.max(22, Math.min(bandH * 0.3, 46));
  roller.style.width = rw + "px";
  roller.style.height = bandH * 0.9 + "px";
  roller.style.setProperty("--hh", Math.max(18, bandH * 0.22) + "px");
  roller.style.setProperty("--hg", Math.max(30, bandH * 0.5) + "px");

  let skipped = false;
  const skip = () => (skipped = true);
  loader.addEventListener("click", skip);

  const pass = 330;
  const ease = "cubic-bezier(.55,.05,.3,1)";
  const timeline = async () => {
    for (let i = 0; i < N && !skipped; i++) {
      const ltr = i % 2 === 0;
      const y = i * bandH + bandH * 0.05;
      const from = ltr ? -rw : W;
      const to = ltr ? W : -rw;
      els[i].style.transformOrigin = ltr ? "left" : "right";
      roller.animate(
        [{ transform: `translate(${from}px,${y}px)` }, { transform: `translate(${to}px,${y}px)` }],
        { duration: pass, easing: ease, fill: "forwards" }
      );
      const b = els[i].animate(
        [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
        { duration: pass, easing: ease, fill: "forwards" }
      );
      await b.finished.catch(() => {});
    }
    els.forEach((e) => (e.style.transform = "scaleX(1)"));
    roller.style.display = "none";
    const brand = $(".loader-brand", loader);
    const show = brand.animate(
      [{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "scale(1)" }],
      { duration: skipped ? 1 : 380, easing: "ease-out", fill: "forwards" }
    );
    await show.finished.catch(() => {});
    if (!skipped) await new Promise((r) => setTimeout(r, 420));
    const out = loader.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }],
      { duration: skipped ? 400 : 800, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }
    );
    root.classList.add("ready");     // o herói entra enquanto a tinta sobe
    await out.finished.catch(() => {});
    loader.remove();
    document.body.classList.remove("lock");
  };
  return timeline();
}

/* salvaguarda: se algo falhar, o site aparece */
setTimeout(() => {
  root.classList.add("ready");
  $("#loader")?.remove();
  document.body.classList.remove("lock");
}, 6500);

runLoader().catch(() => {
  root.classList.add("ready");
  $("#loader")?.remove();
  document.body.classList.remove("lock");
});

/* ---------------- barra de tinta + menu ---------------- */
const bar = $(".progress");
const nav = $("#nav");
const steps = $("#steps");
const fab = $(".fab");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleY(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  nav.classList.toggle("solid", scrollY > 40);
  fab.classList.toggle("show", scrollY > innerHeight * 0.7);

  if (steps) {
    const r = steps.getBoundingClientRect();
    const p = (innerHeight * 0.62 - r.top) / r.height;
    steps.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
  }
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();

/* ---------------- revelar ao rolar ---------------- */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }),
  { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
);
$$(".rv").forEach((el) => io.observe(el));

/* ---------------- logo inclina com o mouse ---------------- */
const logo = $(".hero-media");
if (logo && matchMedia("(hover:hover)").matches && !reduced) {
  addEventListener("pointermove", (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    logo.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
    logo.style.setProperty("--rx", (-y * 12).toFixed(2) + "deg");
  }, { passive: true });
}

/* ---------------- antes e depois: o rolo passa e revela a casa pintada ---------------- */
const ba = $("#ba");
const range = $(".ba-range", ba);
const setBA = (v) => ba.style.setProperty("--p", v + "%");
let touched = false;
const markTouched = () => { touched = true; ba.classList.add("touched"); };
range.addEventListener("pointerdown", markTouched);
range.addEventListener("input", () => { markTouched(); setBA(range.value); });
range.addEventListener("keydown", markTouched);
setBA(range.value);

if (!reduced) {
  // começa tudo "antes" e, ao entrar na tela, o rolo cruza da direita para a esquerda pintando
  range.value = 100; setBA(100);
  const demo = new IntersectionObserver((es) => {
    if (!es[0].isIntersecting) return;
    demo.disconnect();
    const t0 = performance.now(), dur = 2600;
    const tick = (t) => {
      if (touched) return;
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);          // desacelera no final
      const v = 100 - e * 50;                    // 100% -> 50%
      range.value = v; setBA(v.toFixed(1));
      if (k < 1) requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), 450);
  }, { threshold: 0.55 });
  demo.observe(ba);
}

/* ---------------- toque (celular): sem "passar o mouse", o item no meio da tela ativa o efeito ---------------- */
if (matchMedia("(hover:none)").matches) {
  const lit = new IntersectionObserver(
    (es) => es.forEach((e) => e.target.classList.toggle("lit", e.isIntersecting)),
    { rootMargin: "-40% 0px -40% 0px" }
  );
  $$(".card, .cities a").forEach((el) => lit.observe(el));
}

/* ---------------- cidades -> formulário ---------------- */
$$("[data-city]").forEach((a) =>
  a.addEventListener("click", () => {
    const r = $(`input[name=cidade][value="${a.dataset.city}"]`);
    if (r) r.checked = true;
  })
);

/* ---------------- formulário -> WhatsApp ---------------- */
const form = $("#form");
const err = $("#err");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const tipo = d.get("tipo"), cidade = d.get("cidade");
  if (!tipo || !cidade) { err.hidden = false; return; }
  err.hidden = true;

  const nome = (d.get("nome") || "").toString().trim();
  const serv = d.getAll("servico");
  const det = (d.get("detalhes") || "").toString().trim();
  const linhas = [
    `Olá! ${nome ? `Me chamo ${nome}. ` : ""}Quero um orçamento de pintura.`,
    "",
    `Imóvel: ${tipo}`,
    `Cidade: ${cidade}`,
  ];
  if (serv.length) linhas.push(`Preciso de: ${serv.join(", ")}`);
  if (det) linhas.push(`Detalhes: ${det}`);
  linhas.push("", "Vou enviar fotos das paredes.");
  window.open(wa(linhas.join("\n")), "_blank", "noopener");
});
$$("input", form).forEach((i) => i.addEventListener("change", () => (err.hidden = true)));

/* ---------------- vídeos: tocam só quando aparecem; o primeiro toque libera se o celular bloquear ---------------- */
const vids = $$("video[data-auto]");
vids.forEach((v) => { v.muted = true; v.defaultMuted = true; v.playsInline = true; });
if (reduced) {
  vids.forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });
} else {
  const seen = new Set();
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { seen.add(v); v.play().catch(() => {}); }
    else { seen.delete(v); v.pause(); }
  }), { threshold: 0.2 });
  vids.forEach((v) => vio.observe(v));
  addEventListener("pointerdown", () => seen.forEach((v) => v.paused && v.play().catch(() => {})), { once: true, passive: true });
}
