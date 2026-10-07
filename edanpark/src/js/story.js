// Infraestrutura: a imagem fixa troca conforme cada bloco de texto passa pelo meio da tela.
const root = document.querySelector("[data-story]");
if (root) {
  const steps = [...root.querySelectorAll("[data-step]")];
  const imgs = [...root.querySelectorAll("[data-img]")];
  const dots = [...root.querySelectorAll(".story__dots i")];
  const tag = root.querySelector("[data-tag]");
  let cur = -1, tick = false;

  const show = (i) => {
    if (i === cur) return;
    cur = i;
    steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
    imgs.forEach((m, k) => m.classList.toggle("is-on", k === i));
    dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
    tag.textContent = steps[i].dataset.kicker;
  };
  // etapa cujo centro está mais perto do meio da tela (vale também no topo e no fim da seção)
  const pick = () => {
    const mid = innerHeight * 0.5;
    let best = 0, bd = Infinity;
    steps.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bd) (bd = d), (best = i);
    });
    show(best);
  };
  addEventListener("scroll", () => !tick && (tick = true, requestAnimationFrame(() => ((tick = false), pick()))), { passive: true });
  addEventListener("resize", pick);
  pick();
}
