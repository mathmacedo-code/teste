// Tour 360° — gira um "mundo" CSS 3D com as paradas num arco ao redor da câmera (que fica no centro).
// Arrastar (com inércia e snap), setas do teclado, trackpad horizontal, giroscópio, tour guiado,
// "entrar" na cena (dolly) e hotspots. Só roda quadros enquanto algo se move.
const root = document.querySelector("[data-tour]");
if (root) init(root);

function init(root) {
  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const M = +root.dataset.n; // paradas (cenas + cartão final)
  const SCENES = +root.dataset.scenes;
  const STEP = +root.dataset.step; // graus entre paradas
  const SITE = document.documentElement.dataset;

  const world = $("[data-world]");
  const cam = $("[data-cam]");
  const sun = $("[data-sun]");
  const hills = $$("[data-hills]");
  const auras = $$("[data-aura]");
  const sky = $(".tour__sky");
  const stops = $$("[data-stop]");
  const dots = $$("[data-dot]");
  const rdots = $$("[data-rdot]");
  const radar = $("[data-radar]");
  const card = $(".hud__card");
  const kick = $(".hud [data-kicker]");
  const titleEl = $(".hud [data-title]");
  const textEl = $(".hud [data-text]");
  const curEl = $("[data-cur]");
  const enterBtn = $("[data-enter]");
  const enterT = $("[data-enter-t]");
  const guideBtn = $("[data-guide]");
  const gyroBtn = $("[data-gyro]");
  const fullBtn = $("[data-full]");

  const mod = (n, m) => ((n % m) + m) % m;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const angDist = (a, b) => Math.abs(mod(a - b + 180, 360) - 180);
  // parada mais próxima de um ângulo (pode estar no meio do arco vazio atrás de você)
  const nearest = (a) => {
    let best = 0, bd = 1e9;
    for (let i = 0; i < M; i++) {
      const d = angDist(a, i * STEP);
      if (d < bd) (bd = d), (best = i);
    }
    return best;
  };
  // ângulo "desenrolado" da parada i mais perto de `near` (o giro sempre pega o caminho mais curto)
  const angleOf = (i, near) => i * STEP + 360 * Math.round((near - i * STEP) / 360);

  // Estado (graus). yaw = para onde a câmera olha; target = para onde ela está indo.
  let yaw = 0, target = 0, pitch = 0, pitchT = 0, dolly = 0, dollyT = 0;
  let px = 0, pxT = 0, py = 0, pyT = 0; // paralaxe do mouse (só dentro da cena)
  let focus = 0, raf = 0, last = 0, dragging = false, visible = false, started = false;
  let P = 880, dollyPx = 160;

  /* ---------- Medidas ---------- */
  function measure() {
    P = parseFloat(getComputedStyle(cam).perspective) || 880;
    const ph = $("[data-photo]").offsetHeight || 600;
    const s = Math.max((root.clientHeight * 0.96) / ph, 1.14); // quanto a foto cresce ao "entrar"
    dollyPx = P * (1 - 1 / s);
    sizePano();
    render();
  }

  /* ---------- Imagem 360° (opcional) ---------- */
  // Mapeamento cilíndrico simples: a imagem inteira (360°) ocupa 360 × (px por grau no centro da tela).
  let pano = $("[data-pano]");
  let panoW = 0, panoAspect = 0;
  const ppd = () => (P * Math.PI) / 180;
  function sizePano() {
    if (!pano || !panoAspect) return;
    panoW = 360 * ppd();
    const h = panoW / panoAspect;
    Object.assign(pano.style, { width: panoW * 3 + "px", height: h + "px", left: `calc(50% - ${panoW * 1.5}px)`, top: `calc(50% - ${h / 2}px)`, backgroundSize: `${panoW}px ${h}px` });
  }
  function setPano(url) {
    const im = new Image();
    im.onload = () => {
      if (!pano) {
        pano = document.createElement("div");
        pano.className = "tour__pano";
        sky.prepend(pano);
      }
      pano.style.backgroundImage = `url("${url}")`;
      panoAspect = im.naturalWidth / im.naturalHeight;
      root.setAttribute("data-has-pano", "");
      sizePano();
      render();
      requestAnimationFrame(() => pano.classList.add("is-on"));
    };
    im.src = url;
  }
  if (pano?.dataset.src) setPano(pano.dataset.src);
  // Modo prévia (/tour-360/#preview): arraste uma imagem 360° para testar sem editar nada
  if (location.hash === "#preview") {
    $("[data-preview]").hidden = false;
    addEventListener("dragover", (e) => e.preventDefault());
    addEventListener("drop", (e) => {
      e.preventDefault();
      const f = [...e.dataTransfer.files].find((f) => f.type.startsWith("image/"));
      if (f) setPano(URL.createObjectURL(f));
    });
  }

  /* ---------- Desenho ---------- */
  function render() {
    // A câmera fica no centro do arco: o mundo é empurrado P px para a frente (a parada em foco cai no plano z=0)
    const dzD = dollyPx * ease(clamp(dolly, 0, 1)); // avanço extra da câmera ao "entrar" na cena
    const dz = P + dzD;
    world.style.transform = `translate3d(0,0,${dz.toFixed(1)}px) rotateX(${(pitch + py).toFixed(3)}deg) rotateY(${(-(yaw + px)).toFixed(3)}deg)`;
    // Cenário acompanha o giro em velocidades diferentes (paralaxe): serras longe, serras perto, sol
    for (const h of hills) h.style.transform = `translate3d(${(-mod(yaw * h.dataset.hills * 9, 1600)).toFixed(1)}px,0,0)`;
    // Halos de cor atrás de cada parada: camadas 2D posicionadas pela mesma projeção em perspectiva
    // (no espaço 3D, planos translúcidos vizinhos se cruzam e criam emendas visíveis)
    for (let i = 0; i < M; i++) {
      const d = mod(i * STEP - (yaw + px) + 180, 360) - 180;
      const a = (d * Math.PI) / 180;
      const depth = P * Math.cos(a) - dzD;
      const el = auras[i];
      if (Math.abs(d) > 80 || depth < 80) {
        el.style.opacity = 0;
        continue;
      }
      el.style.opacity = (Math.pow(1 - Math.abs(d) / 80, 1.3) * (i === focus ? 1 : 0.9)).toFixed(3);
      el.style.transform = `translate3d(${((P * P * Math.sin(a)) / depth).toFixed(1)}px,0,0) scale(${(P / depth).toFixed(3)})`;
    }
    sun.style.transform = `translate3d(${((mod(yaw + 180, 360) - 180) * -9).toFixed(1)}px,0,0)`;
    if (pano && panoW) {
      pano.style.transform = `translate3d(${(-mod((yaw + px) * ppd(), panoW)).toFixed(1)}px,${((pitch + py) * ppd()).toFixed(1)}px,0)`;
    }
    radar.setAttribute("transform", `rotate(${(-yaw).toFixed(2)})`);
  }

  /* ---------- Loop (para sozinho quando nada se move) ---------- */
  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;
    const k = (rate) => 1 - Math.exp(-dt * (reduce ? 80 : rate));
    if (!dragging) yaw += (target - yaw) * k(8);
    pitch += (pitchT - pitch) * k(7);
    dolly += (dollyT - dolly) * k(4.6);
    px += (pxT - px) * k(4);
    py += (pyT - py) * k(4);
    render();
    syncFocus(nearest(dragging ? yaw : target));
    const still = !dragging && Math.abs(target - yaw) < 0.02 && Math.abs(pitchT - pitch) < 0.02 && Math.abs(dollyT - dolly) < 0.001 && Math.abs(pxT - px) < 0.02 && Math.abs(pyT - py) < 0.02;
    raf = still ? 0 : requestAnimationFrame(frame);
  }
  const wake = () => {
    if (!raf && visible) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  /* ---------- Imagens: só a 1ª vem no HTML; as outras baixam depois (vizinhas da parada em foco primeiro) ---------- */
  const ensure = (i) => {
    const im = stops[mod(i, M)].querySelector("img[data-src]");
    if (im) (im.src = im.dataset.src), im.removeAttribute("data-src");
  };
  // espera ~2,5 s depois do load para não competir com a 1ª imagem; ensure() cobre quem navegar antes disso
  const loadRest = () => setTimeout(() => stops.forEach((_, k) => setTimeout(() => ensure(k), 300 * k)), 2500);
  document.readyState === "complete" ? loadRest() : addEventListener("load", loadRest, { once: true });

  /* ---------- HUD / foco ---------- */
  let swapTimer = 0;
  function syncFocus(i) {
    if (i === focus) return;
    focus = i;
    ensure(i - 1), ensure(i), ensure(i + 1);
    const isCta = i >= SCENES;
    stops.forEach((s, k) => s.classList.toggle("is-focus", k === i));
    dots.forEach((d, k) => (k === i ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current")));
    rdots.forEach((d, k) => d.classList.toggle("is-on", k === i));
    curEl.textContent = isCta ? "Fim" : String(i + 1).padStart(2, "0");
    $$(".spot.is-open").forEach((s) => s.classList.remove("is-open"));
    if (isCta && dollyT) setEntered(false);
    card.classList.add("is-swap");
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => {
      const d = stops[i].dataset;
      kick.textContent = d.kicker;
      titleEl.textContent = d.title;
      textEl.textContent = d.text;
      enterT.textContent = isCta ? "Falar com a equipe" : dollyT ? "Sair da cena" : "Entrar na cena";
      card.classList.remove("is-swap");
    }, reduce ? 0 : 200);
  }

  function goTo(i) {
    ensure(i);
    target = angleOf(i, target);
    wake();
  }
  const step = (d) => goTo(mod(nearest(target) + d, M));
  function setEntered(on) {
    if (on && focus >= SCENES) return;
    dollyT = on ? 1 : 0;
    root.classList.toggle("is-entered", on);
    enterT.textContent = focus >= SCENES ? "Falar com a equipe" : on ? "Sair da cena" : "Entrar na cena";
    if (!on) (pxT = 0), (pyT = 0);
    wake();
  }
  // Botão principal / tecla Enter: entra/sai da cena, ou segue para o contato no cartão final
  const primary = () => (focus >= SCENES ? (location.href = SITE.contact ?? "/contato/") : setEntered(!dollyT));
  const touched = () => root.classList.add("is-touched");

  /* ---------- Mouse / toque ---------- */
  const K = 0.085; // graus por pixel arrastado
  let sx = 0, sy = 0, syaw = 0, spitch = 0, moved = 0, samples = [], downOn = null;

  root.addEventListener("pointerdown", (e) => {
    if (e.button || e.target.closest("[data-nodrag]")) return;
    stopGuide();
    stopGyro();
    dragging = true;
    downOn = e.target;
    sx = e.clientX; sy = e.clientY; syaw = yaw; spitch = pitchT; moved = 0;
    samples = [[performance.now(), yaw]];
    root.setPointerCapture(e.pointerId);
    root.classList.add("is-drag");
    touched();
    wake();
  });

  root.addEventListener("pointermove", (e) => {
    if (!dragging) {
      if (e.pointerType === "mouse" && dollyT) {
        const r = root.getBoundingClientRect();
        pxT = ((e.clientX - r.left) / r.width - 0.5) * 5;
        pyT = ((e.clientY - r.top) / r.height - 0.5) * -3.2;
        wake();
      }
      return;
    }
    const dx = e.clientX - sx, dy = e.clientY - sy;
    moved = Math.max(moved, Math.hypot(dx, dy));
    yaw = target = syaw - dx * K;
    if (e.pointerType === "mouse") pitchT = clamp(spitch + dy * 0.05, -9, 9);
    const now = performance.now();
    samples.push([now, yaw]);
    while (samples.length > 2 && now - samples[0][0] > 110) samples.shift();
    wake();
  });

  function release() {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("is-drag");
    pitchT = 0;
    if (moved < 6) {
      // foi um clique, não um arrasto
      const stop = downOn?.closest?.("[data-photo]")?.closest("[data-stop]");
      const spot = downOn?.closest?.("[data-spot]");
      target = angleOf(nearest(target), target);
      if (stop) {
        const i = +stop.dataset.stop;
        if (i !== focus) goTo(i);
        else if (spot) {
          const open = spot.classList.contains("is-open");
          $$(".spot.is-open").forEach((s) => s.classList.remove("is-open"));
          spot.classList.toggle("is-open", !open);
        } else primary();
      }
    } else {
      const a = samples[0], b = samples[samples.length - 1];
      const v = b[0] - a[0] > 8 ? (b[1] - a[1]) / (b[0] - a[0]) : 0; // graus por ms
      const here = nearest(yaw);
      let to = nearest(yaw + v * 260);
      // no máximo duas paradas por "empurrão"
      const diff = clamp(Math.round(mod(to - here + M / 2, M) - M / 2), -2, 2);
      if (diff === 0 && Math.abs(v) < 0.02) to = here;
      else to = mod(here + (to === here ? 0 : diff), M);
      target = angleOf(to, yaw);
    }
    wake();
  }
  root.addEventListener("pointerup", release);
  root.addEventListener("pointercancel", release);
  root.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse" && !dragging && dollyT) (pxT = 0), (pyT = 0), wake();
  });

  // Trackpad / roda lateral gira; a rolagem vertical continua rolando a página
  let wheelTimer = 0;
  root.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return;
      e.preventDefault();
      stopGuide();
      touched();
      target += e.deltaX * 0.07;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => ((target = angleOf(nearest(target), target)), wake()), 140);
      wake();
    },
    { passive: false },
  );

  /* ---------- Teclado ---------- */
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") (stopGuide(), step(1), touched());
    else if (e.key === "ArrowLeft") (stopGuide(), step(-1), touched());
    else if ((e.key === "Enter" || e.key === " ") && e.target === root) primary();
    else if (e.key === "Escape" && dollyT) setEntered(false);
    else return;
    e.preventDefault();
  });

  /* ---------- Botões ---------- */
  $("[data-next]").addEventListener("click", () => (stopGuide(), touched(), step(1)));
  $("[data-prev]").addEventListener("click", () => (stopGuide(), touched(), step(-1)));
  enterBtn.addEventListener("click", () => (stopGuide(), touched(), primary()));
  dots.forEach((d, i) => d.addEventListener("click", () => (stopGuide(), touched(), goTo(i))));
  document.querySelectorAll("[data-jump]").forEach((b) =>
    b.addEventListener("click", () => {
      stopGuide();
      touched();
      goTo(+b.dataset.jump);
      root.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }),
  );

  /* ---------- Tour guiado ---------- */
  let guided = false, guideId = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  function setGuide(on) {
    guided = on;
    guideBtn.setAttribute("aria-pressed", on);
    guideBtn.setAttribute("aria-label", on ? "Pausar tour guiado" : "Iniciar tour guiado");
  }
  function stopGuide() {
    if (!guided) return;
    guideId++;
    setGuide(false);
  }
  async function runGuide() {
    const id = ++guideId;
    setGuide(true);
    touched();
    if (focus >= SCENES) {
      goTo(0);
      await wait(2200);
    }
    while (id === guideId) {
      setEntered(true);
      await wait(5200);
      if (id !== guideId) return;
      setEntered(false);
      await wait(1000);
      if (id !== guideId) return;
      step(1);
      await wait(2200);
      if (id === guideId && focus >= SCENES) return stopGuide(); // chegou ao fim: para no cartão de contato
    }
  }
  guideBtn.addEventListener("click", () => (guided ? stopGuide() : runGuide()));

  /* ---------- Giroscópio (celular) ---------- */
  let gyro = false, a0 = null, base = 0;
  const onOri = (e) => {
    if (e.alpha == null) return;
    if (a0 == null) (a0 = e.alpha), (base = yaw);
    yaw = target = base - (mod(e.alpha - a0 + 180, 360) - 180);
    wake();
  };
  function stopGyro() {
    if (!gyro) return;
    gyro = false;
    removeEventListener("deviceorientation", onOri);
    gyroBtn.setAttribute("aria-pressed", "false");
    target = angleOf(nearest(target), target);
    wake();
  }
  if ("DeviceOrientationEvent" in window && matchMedia("(pointer:coarse)").matches) {
    gyroBtn.hidden = false;
    gyroBtn.addEventListener("click", async () => {
      if (gyro) return stopGyro();
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const r = await DeviceOrientationEvent.requestPermission().catch(() => "denied");
        if (r !== "granted") return;
      }
      stopGuide();
      gyro = true;
      a0 = null;
      gyroBtn.setAttribute("aria-pressed", "true");
      touched();
      addEventListener("deviceorientation", onOri);
    });
  }

  /* ---------- Tela cheia ---------- */
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  if (!(root.requestFullscreen || root.webkitRequestFullscreen)) fullBtn.hidden = true;
  fullBtn.addEventListener("click", () => (fsEl() ? (document.exitFullscreen || document.webkitExitFullscreen).call(document) : (root.requestFullscreen || root.webkitRequestFullscreen).call(root)));
  document.addEventListener("fullscreenchange", () => setTimeout(measure, 120));

  /* ---------- Visibilidade e abertura ---------- */
  function intro() {
    if (started) return;
    started = true;
    if (!reduce) {
      yaw = -46; // chega girando até a primeira parada
      target = 0;
      render();
    }
    wake();
  }
  new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        measure(); // no arquivo único a aba do tour fica oculta até ser aberta: mede de novo ao aparecer
        intro();
        wake();
      } else {
        stopGuide();
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { threshold: 0.25 },
  ).observe(root);

  addEventListener("resize", measure);
  document.fonts?.ready.then(measure);
  rdots[0]?.classList.add("is-on");
  measure();
}
