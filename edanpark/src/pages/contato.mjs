import { site, faq } from "../data/site.mjs";
import { icon, esc } from "../lib/ui.mjs";
import { pageHero } from "../lib/sections.mjs";

const c = site.contact;
const channels = [
  c.whatsapp && `<a href="https://wa.me/${esc(c.whatsapp)}" rel="noopener">${icon("whatsapp")}<span>WhatsApp</span></a>`,
  c.phone && `<a href="tel:${esc(c.phone.replace(/\D/g, ""))}">${icon("phone")}<span>${esc(c.phone)}</span></a>`,
  c.email && `<a href="mailto:${esc(c.email)}">${icon("mail")}<span>${esc(c.email)}</span></a>`,
].filter(Boolean);

export default {
  path: "/contato/",
  nav: "contato",
  title: "Contato",
  description: "Traga a sua empresa para o Edan Park. Fale com a nossa equipe, peça informações sobre os lotes e agende uma visita ao polo em Estiva (MG).",
  scripts: ["contact.js"],
  body: () => `
${pageHero({
  eyebrow: "Contato",
  title: `Traga sua empresa para o <span class="grad">Edan Park!</span>`,
  lead: "Conte o que a sua operação precisa. Respondemos com as opções de lotes e a visita guiada ao polo.",
  bg: "/media/tour/heliponto-bg.webp",
})}

<section class="sec" style="padding-top:0">
  <div class="wrap contact">
    <div class="contact__info" data-reveal>
      <h2 class="h3">Como prefere falar com a gente?</h2>
      ${channels.length ? `<div class="channels">${channels.join("")}</div>` : ""}
      <p class="lead" style="font-size:1rem">${esc(site.name)} · ${esc(site.tagline)}<br>${esc(site.city)}, ${esc(site.state)}${c.address ? "<br>" + esc(c.address) : ""}</p>
      <div class="faq">${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
    </div>

    <form class="form" data-form data-reveal style="--d:1" novalidate
      data-whatsapp="${esc(c.whatsapp)}" data-email="${esc(c.email)}" data-endpoint="${esc(c.formEndpoint)}">
      <div class="form__row">
        <div class="field"><label for="f-nome">Nome</label><input id="f-nome" name="nome" autocomplete="name" required></div>
        <div class="field"><label for="f-empresa">Empresa</label><input id="f-empresa" name="empresa" autocomplete="organization" required></div>
      </div>
      <div class="form__row">
        <div class="field"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="f-tel">WhatsApp</label><input id="f-tel" name="telefone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(35) 90000-0000" required></div>
      </div>
      <div class="field">
        <label for="f-seg">Segmento</label>
        <select id="f-seg" name="segmento">
          <option>Logística</option><option>Indústria</option><option>E-commerce</option><option>Distribuição</option><option>Outro</option>
        </select>
      </div>
      <div class="field field--area">
        <label for="f-area">Área desejada</label>
        <div class="lot__out"><span data-out>12.000</span><small>m²</small></div>
        <input class="range" id="f-area" name="area" type="range" min="5000" max="35000" step="500" value="12000" data-range>
        <div class="lot__scale"><span>5.000 m²</span><span>35.000 m²</span></div>
      </div>
      <div class="field"><label for="f-msg">Mensagem (opcional)</label><textarea id="f-msg" name="mensagem" placeholder="Conte um pouco da sua operação e do prazo que você tem em mente."></textarea></div>
      <input class="hp" name="site" tabindex="-1" autocomplete="off" aria-hidden="true">
      <p class="form__warn" data-warn hidden></p>
      <button class="btn btn--primary" type="submit" style="justify-self:start">Enviar mensagem ${icon("arrow-right")}</button>
      <p class="form__note">Ao enviar, você concorda em ser contatado sobre o Edan Park. Não compartilhamos seus dados.</p>
      <div class="form__ok" role="status" aria-live="polite">${icon("check")}<h3 class="h3">Mensagem pronta!</h3><p class="lead" data-ok-text>Obrigado! Entraremos em contato em breve.</p></div>
    </form>
  </div>
</section>
`,
};
