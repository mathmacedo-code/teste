// Hero da Home: o vídeo só começa a baixar depois que a página terminou de carregar,
// escolhe a versão certa para o aparelho e respeita economia de dados / movimento reduzido.
const hero = document.querySelector("[data-hero]");
if (hero) {
  const card = hero.querySelector("[data-vcard]");
  const video = card.querySelector("[data-video]");
  const ctl = card.querySelector("[data-vctl]");
  const bar = card.querySelector("[data-vbar]");
  const poster = card.querySelector("[data-poster]");
  const ambient = hero.querySelector("[data-ambient]");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const conn = navigator.connection;
  const saver = !!(conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")));

  let loaded = false, userPaused = false, visible = true;

  const load = () => {
    if (loaded) return;
    loaded = true;
    video.src = matchMedia("(min-width:900px)").matches ? video.dataset.srcLg : video.dataset.srcSm;
  };
  const play = () => {
    load();
    video.play().catch(() => card.classList.add("is-paused"));
  };
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

  /* Brilho ambiente: a cor do vídeo "vaza" para o fundo (canvas minúsculo + blur em CSS) */
  if (ambient && matchMedia("(min-width:900px)").matches) {
    const ctx = ambient.getContext("2d", { alpha: false });
    const paint = (src) => {
      try {
        ctx.drawImage(src, 0, 0, ambient.width, ambient.height);
        ambient.classList.add("is-on");
      } catch {}
    };
    poster.complete ? paint(poster) : poster.addEventListener("load", () => paint(poster), { once: true });
    if ("requestVideoFrameCallback" in video) {
      let last = 0;
      const frame = (t) => {
        if (t - last > 90) (last = t), paint(video);
        video.requestVideoFrameCallback(frame);
      };
      video.requestVideoFrameCallback(frame);
    } else {
      setInterval(() => !video.paused && paint(video), 120);
    }
  }

  /* Inclinação 3D do cartão acompanhando o mouse */
  if (fine && !reduce) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      card.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * -9 + "deg");
      card.style.setProperty("--rx", ((e.clientY - r.top) / r.height - 0.5) * 6 + "deg");
    });
    hero.addEventListener("pointerleave", () => (card.style.removeProperty("--ry"), card.style.removeProperty("--rx")));
  }
}
