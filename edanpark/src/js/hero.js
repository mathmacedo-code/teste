// Hero da Home: o vídeo só começa a baixar depois que a página terminou de carregar,
// escolhe a versão certa para o aparelho e respeita economia de dados / movimento reduzido.
const hero = document.querySelector("[data-hero]");
if (hero) {
  const card = hero.querySelector("[data-vcard]");
  const video = card.querySelector("[data-video]");
  const ctl = card.querySelector("[data-vctl]");
  const bar = card.querySelector("[data-vbar]");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = navigator.connection;
  const saver = !!(conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")));

  let loaded = false, loading = null, userPaused = false, visible = true;

  const load = () =>
    (loading ||= (async () => {
      if (document.documentElement.hasAttribute("data-single")) {
        // arquivo único: o vídeo vem dentro do HTML (base64), no fim do arquivo; espera chegar (se ainda não chegou) e decodifica
        if (document.readyState === "loading") await new Promise((r) => addEventListener("DOMContentLoaded", r, { once: true }));
        const embedded = document.getElementById("hv");
        const blob = await (await fetch("data:video/mp4;base64," + embedded.textContent.trim())).blob();
        embedded.textContent = ""; // libera a cópia em texto
        video.src = URL.createObjectURL(blob);
      } else {
        video.src = matchMedia("(min-width:900px)").matches ? video.dataset.srcLg : video.dataset.srcSm;
      }
      loaded = true;
    })());
  const play = () =>
    load()
      .then(() => video.play())
      .catch(() => card.classList.add("is-paused"));
  const sync = () => (userPaused || !visible || document.hidden ? video.pause() : loaded && video.play().catch(() => {}));

  video.addEventListener("playing", () => {
    card.classList.add("is-playing");
    card.classList.remove("is-paused");
    ctl.setAttribute("aria-label", "Pausar vídeo");
  });
  video.addEventListener("pause", () => {
    if (userPaused) {
      card.classList.add("is-paused");
      ctl.setAttribute("aria-label", "Reproduzir vídeo");
    }
  });
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

  // Começa quando a página já terminou de carregar (não disputa banda com o conteúdo)
  const kickoff = () => {
    if (reduce || saver) {
      card.classList.add("is-paused");
      userPaused = true;
      ctl.setAttribute("aria-label", "Reproduzir vídeo");
      return;
    }
    (window.requestIdleCallback || ((f) => setTimeout(f, 200)))(play);
  };
  document.readyState === "complete" ? kickoff() : addEventListener("load", kickoff, { once: true });
}
