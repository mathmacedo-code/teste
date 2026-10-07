// Mapa "sob demanda": o iframe de terceiros só carrega se a pessoa clicar (zero custo na abertura da página).
const map = document.querySelector("[data-map]");
const btn = map?.querySelector("[data-load-map]");
btn?.addEventListener("click", () => {
  const f = document.createElement("iframe");
  f.src = btn.dataset.src;
  f.title = "Mapa da região do Edan Park";
  f.loading = "lazy";
  f.referrerPolicy = "no-referrer";
  map.append(f);
  map.querySelector(".map__pin").hidden = true;
});
