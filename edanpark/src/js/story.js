// Infraestrutura: a imagem fixa troca conforme cada bloco de texto passa pelo meio da tela.
// Só a 1ª imagem vem no HTML; as demais baixam depois do load (a da etapa seguinte primeiro).
const root = document.querySelector("[data-story]");
if (root) {
  const steps = [...root.querySelectorAll("[data-step]")];
  const imgs = [...root.querySelectorAll("[data-img]")];
  const dots = [...root.querySelectorAll(".story__dots i")];
  const tag = root.querySelector("[data-tag]");
  let cur = -1, tick = false;

  const ensure = (i) => {
    const im = imgs[i];
    if (im?.dataset.src) (im.src = im.dataset.src), im.removeAttribute("data-src");
  };
  // espera ~2,5 s depois do load para não competir com a 1ª imagem; show() busca a da etapa seguinte na hora
  const loadRest = () => setTimeout(() => imgs.forEach((_, k) => setTimeout(() => ensure(k), 400 * k)), 2500);
  document.readyState === "complete" ? loadRest() : addEventListener("load", loadRest, { once: true });

  const show = (i) => {
    if (i === cur) return;
    cur = i;
    ensure(i), ensure(i + 1);
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
