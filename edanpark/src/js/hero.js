// Hero da Início: o vídeo começa sozinho (mudo, em loop). Na versão em várias páginas só baixa depois que a
// página terminou de carregar; no arquivo único ele já está dentro do HTML e começa assim que chega.
// Se o aparelho bloquear o autoplay (economia de bateria, "reproduzir prévias" desligado), o vídeo
// começa no primeiro toque em qualquer lugar da página, sem precisar achar o botão.
const hero = document.querySelector("[data-hero]");
if (hero) {
  const card = hero.querySelector("[data-vcard]");
  const video = card.querySelector("[data-video]");
  const ctl = card.querySelector("[data-vctl]");
  const bar = card.querySelector("[data-vbar]");
  const single = document.documentElement.hasAttribute("data-single");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = navigator.connection;
  // (no arquivo único os bytes já vieram no HTML: economizar dados não adianta)
  const saver = !single && !!(conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")));

  video.muted = video.defaultMuted = true;
  video.setAttribute("playsinline", "");

  let loaded = false, loading = null, userPaused = false, visible = true, armed = false;

  const decode = (b64) => {
    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new Blob([u8], { type: "video/mp4" });
  };
  const load = () =>
    (loading ||= (async () => {
      if (single) {
        // o vídeo vem no fim do arquivo (base64); espera chegar, se ainda não chegou
        if (document.readyState === "loading") await new Promise((r) => addEventListener("DOMContentLoaded", r, { once: true }));
        const embedded = document.getElementById("hv");
        video.src = URL.createObjectURL(decode(embedded.textContent.trim()));
        embedded.textContent = ""; // libera a cópia em texto
      } else {
        video.src = matchMedia("(min-width:900px)").matches ? video.dataset.srcLg : video.dataset.srcSm;
      }
      loaded = true;
    })());

  // Autoplay bloqueado: o próximo toque/tecla em qualquer lugar da página inicia o vídeo.
  const EV = ["touchend", "pointerup", "click", "keydown"];
  const onGesture = (e) => {
    disarm();
    if (e.target.closest?.("[data-vctl]")) return; // o próprio botão trata o clique
    if (!userPaused) play();
  };
  const arm = () => {
    if (armed) return;
    armed = true;
    EV.forEach((t) => addEventListener(t, onGesture, { capture: true, passive: true }));
  };
  const disarm = () => {
    armed = false;
    EV.forEach((t) => removeEventListener(t, onGesture, { capture: true }));
  };

  const play = () =>
    load()
      .then(() => video.play())
      .catch((e) => {
        if (e && e.name === "NotAllowedError") (card.classList.add("is-paused"), arm());
      });
  const sync = () => (userPaused || !visible || document.hidden ? video.pause() : loaded && video.play().catch(() => {}));

  video.addEventListener("playing", () => {
    card.classList.add("is-playing");
    card.classList.remove("is-paused");
    ctl.setAttribute("aria-label", "Pausar vídeo");
    disarm();
  });
  video.addEventListener("pause", () => {
    if (userPaused) {
      card.classList.add("is-paused");
      ctl.setAttribute("aria-label", "Reproduzir vídeo");
    }
  });
  video.addEventListener("error", () => card.classList.add("is-failed")); // formato não suportado: fica o poster, sem botão inútil
  video.addEventListener("timeupdate", () => video.duration && bar.style.setProperty("--p", (video.currentTime / video.duration).toFixed(4)));

  ctl.addEventListener("click", () => {
    if (!loaded || video.paused) {
      userPaused = false;
      play();
    } else {
      userPaused = true;
      video.pause();
    }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => ((visible = e.isIntersecting), loaded && sync()), { threshold: 0.15 }).observe(card);
  }
  document.addEventListener("visibilitychange", () => loaded && sync());

  const kickoff = () => {
    if (reduce || saver) {
      card.classList.add("is-paused");
      userPaused = true;
      ctl.setAttribute("aria-label", "Reproduzir vídeo");
      return;
    }
    play();
  };
  if (single) document.readyState === "loading" ? addEventListener("DOMContentLoaded", kickoff, { once: true }) : kickoff();
  // várias páginas: espera a página terminar de carregar para não disputar banda com o conteúdo
  else document.readyState === "complete" ? kickoff() : addEventListener("load", () => (window.requestIdleCallback || ((f) => setTimeout(f, 200)))(kickoff), { once: true });
}
