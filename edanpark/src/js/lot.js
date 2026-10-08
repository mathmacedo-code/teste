// Simulador de lote: mostra a escala relativa da área escolhida (referência visual).
const nf = new Intl.NumberFormat("pt-BR");
const FIELD = 7140; // campo de futebol oficial (105 × 68 m)
const ROOT = document.documentElement.dataset.root ?? "/";
const IDX = document.documentElement.dataset.idx ?? "";

document.querySelectorAll("[data-lot]").forEach((root) => {
  const range = root.querySelector("[data-range]");
  const out = root.querySelector("[data-out]");
  const sq = root.querySelector("[data-sq]");
  const sqt = root.querySelector("[data-sq-t]");
  const pitch = root.querySelector("[data-eq-pitch]");
  const pct = root.querySelector("[data-eq-pct]");
  const cta = root.querySelector("[data-lot-cta]");
  const min = +range.min, max = +range.max;

  const update = () => {
    const v = +range.value;
    out.textContent = nf.format(v);
    sq.style.width = sq.style.height = Math.sqrt(v / max) * 100 + "%";
    sqt.textContent = nf.format(v) + " m²";
    pitch.textContent = (v / FIELD).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    pct.textContent = Math.round((v / max) * 100) + "%";
    range.style.setProperty("--pct", ((v - min) / (max - min)) * 100 + "%");
    cta.href = `${ROOT}contato/${IDX}?area=${v}`;
  };
  range.addEventListener("input", update);
  update();
});
