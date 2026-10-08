// Arquivo único: as "abas" são áreas da mesma página, trocadas pelo endereço (#empreendimento, #tour…).
// Voltar/avançar do navegador funcionam; sem JS todas as áreas aparecem uma abaixo da outra.
const doc = document.documentElement;
const views = [...document.querySelectorAll("[data-view]")];
const ids = views.map((v) => v.dataset.view);

function route(first) {
  const raw = decodeURIComponent(location.hash.slice(1)).split("?")[0];
  let id = raw === "" ? "inicio" : raw;
  if (!ids.includes(id)) {
    if (raw && document.getElementById(raw)) return; // âncora dentro da aba atual (ex.: "Role"): só rola
    id = "inicio";
  }
  if (id === doc.dataset.v && !first) return; // mesma aba (ex.: só mudou ?area=…)
  doc.dataset.v = id;
  document.body.classList.toggle("is-tour", id === "tour");
  document.title = views.find((v) => v.dataset.view === id).dataset.title;
  document.querySelectorAll("[data-nav] a, [data-menu] a, .hdr__cta").forEach((a) => {
    a.getAttribute("href") === "#" + id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  });
  if (!first) scrollTo({ top: 0, behavior: "instant" });
  dispatchEvent(new Event("navchange"));
}
addEventListener("hashchange", () => route(false));
route(true);
