import { icon } from "../lib/ui.mjs";

export default {
  path: "/404.html",
  nav: "none",
  noindex: true,
  title: "Página não encontrada",
  description: "Página não encontrada.",
  head: '<meta name="robots" content="noindex">',
  body: () => `
<section class="phero" style="min-height:80svh;display:grid;align-content:center">
  <div class="wrap phero__in">
    <span class="eyebrow">Erro 404</span>
    <h1>Essa rota <span class="grad">não existe.</span></h1>
    <p class="lead">O endereço pode ter mudado. Volte ao início ou entre no tour 360°.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--primary" href="/">Ir para o início ${icon("arrow-right")}</a><a class="btn btn--ghost" href="/tour-360/">Tour 360°</a></div>
  </div>
</section>`,
};
