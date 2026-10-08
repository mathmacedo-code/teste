// Mapa estratégico (Localização): escolhe a cidade (clique, toque, teclado), anima a entrada e passeia sozinho
// até a primeira interação. Não mede nada: a posição é toda CSS, então vale também na aba oculta do arquivo único.
const root = document.querySelector("[data-geomap]");
if (root) {
  const all = (s) => [...root.querySelectorAll(s)];
  const pins = all(".gm__pin"), rows = all(".gm__row"), calls = all(".gm__call"), lines = all(".gm__on");
  const live = root.querySelector("[data-live]");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = 0, timer = 0, auto = !still, seen = false, held = false;

  const show = (i, move) => {
    cur = (i + pins.length) % pins.length;
    pins.forEach((p, k) => (p.setAttribute("aria-pressed", k === cur), p.toggleAttribute("aria-current", k === cur), (p.tabIndex = k === cur ? 0 : -1)));
    rows.forEach((r, k) => r.setAttribute("aria-pressed", k === cur));
    calls.forEach((c, k) => c.classList.toggle("is-on", k === cur));
    lines.forEach((l, k) => l.classList.toggle("is-on", k === cur));
    if (move) pins[cur].focus();
  };
  // passeio automático: só com o mapa na tela, sem mouse/foco em cima, aba visível e antes de qualquer interação
  const run = () => {
    clearInterval(timer);
    if (auto && seen && !held && !document.hidden) timer = setInterval(() => show(cur + 1), 3500);
  };
  const pick = (i, move) => {
    i = (i + pins.length) % pins.length;
    auto = false, run();
    live.textContent = pins[i].textContent.trim().replace(/\s+,/, ",");
    show(i, move);
  };

  pins.forEach((p, k) => p.addEventListener("click", () => pick(k)));
  rows.forEach((r, k) => r.addEventListener("click", () => pick(k)));
  root.addEventListener("keydown", (e) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (d && pins.includes(document.activeElement)) e.preventDefault(), pick(cur + d, true);
  });
  root.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && ((held = true), run()));
  root.addEventListener("pointerleave", () => ((held = false), run()));
  root.addEventListener("focusin", () => ((held = true), run()));
  root.addEventListener("focusout", () => ((held = false), run()));
  document.addEventListener("visibilitychange", run);

  show(0);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen && !root.classList.contains("is-in")) root.classList.add("is-in"), setTimeout(() => root.classList.add("is-set"), 2200);
      run();
    }, { threshold: 0.3 }).observe(root.querySelector(".gm__map"));
  } else root.classList.add("is-in");
}
