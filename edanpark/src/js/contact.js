// Formulário de contato (sem servidor): envia para o endpoint configurado, ou abre o WhatsApp / e-mail
// com a mensagem pronta. Os canais são configurados em src/data/site.mjs.
const form = document.querySelector("[data-form]");
if (form) {
  const nf = new Intl.NumberFormat("pt-BR");
  const range = form.querySelector("[data-range]");
  const out = form.querySelector("[data-out]");
  const warn = form.querySelector("[data-warn]");
  const okText = form.querySelector("[data-ok-text]");
  const { whatsapp, email, endpoint } = form.dataset;

  const upd = () => {
    out.textContent = nf.format(+range.value);
    range.style.setProperty("--pct", ((range.value - range.min) / (range.max - range.min)) * 100 + "%");
  };
  range.addEventListener("input", upd);

  const q = new URLSearchParams(location.search);
  const a = parseInt(q.get("area"), 10);
  if (a >= +range.min && a <= +range.max) range.value = Math.round(a / 500) * 500;
  upd();

  const done = (msg) => {
    okText.textContent = msg;
    form.classList.add("is-sent");
    form.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const fail = (msg) => ((warn.textContent = msg), (warn.hidden = false));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    warn.hidden = true;
    if (!form.checkValidity()) return form.reportValidity();
    const d = Object.fromEntries(new FormData(form));
    if (d.site) return done("Obrigado! Entraremos em contato em breve."); // honeypot
    const area = nf.format(+d.area);
    const text = [
      "Olá! Gostaria de saber mais sobre o Edan Park.",
      `Nome: ${d.nome}`,
      `Empresa: ${d.empresa}`,
      `E-mail: ${d.email}`,
      `WhatsApp: ${d.telefone}`,
      `Segmento: ${d.segmento}`,
      `Área desejada: ${area} m²`,
      d.mensagem ? `Mensagem: ${d.mensagem}` : "",
    ].filter(Boolean).join("\n");

    const viaWhatsApp = () => (window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener") || (location.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`), done("Abrimos o WhatsApp com a sua mensagem pronta. É só enviar!"));
    const viaEmail = () => ((location.href = `mailto:${email}?subject=${encodeURIComponent("Contato pelo site — Edan Park")}&body=${encodeURIComponent(text)}`), done("Abrimos o seu e-mail com a mensagem pronta. É só enviar!"));

    if (endpoint) {
      try {
        const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...d, area: +d.area }) });
        if (!r.ok) throw new Error(r.status);
        return done("Recebemos a sua mensagem! Entraremos em contato em breve.");
      } catch {
        if (whatsapp) return viaWhatsApp();
        if (email) return viaEmail();
        return fail("Não foi possível enviar agora. Tente novamente em instantes.");
      }
    }
    if (whatsapp) return viaWhatsApp();
    if (email) return viaEmail();
    fail("Os canais de contato ainda não foram configurados neste site (veja contact em src/data/site.mjs).");
  });
}
