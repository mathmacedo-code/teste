// Mapa de lotes (Início): planta 2D / vista 3D clicáveis e percurso guiado pelas vias internas.
// A "câmera" é um transform no bloco da imagem. Nada aqui mede o DOM escondido (no arquivo único as abas
// ficam em display:none): a geometria vem dos atributos e o tamanho do palco, do ResizeObserver.
const root = document.querySelector("[data-lotmap]");
if (root) {
  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CONTACT = document.documentElement.dataset.contact ?? "/contato/";
  const nf = new Intl.NumberFormat("pt-BR");
  const stage = $("[data-stage]");
  const card = { kick: $("[data-kick]"), title: $("[data-title]"), text: $("[data-text]"), facts: $("[data-facts]"), area: $("[data-area]"), meter: $("[data-meter]"), ask: $("[data-ask]"), askT: $("[data-ask-t]"), reset: $("[data-reset]") };
  const goBtn = $("[data-go]");
  const goT = $("[data-go-t]");
  const prog = $("[data-prog]");

  const pairs = (str) => str.trim().split(/\s+/).map((p) => p.split(",").map(Number));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Dados lidos do HTML ---------- */
  const info = {};
  $$(".lm__list [data-lote]").forEach((b) => (info[b.dataset.lote] = { id: b.dataset.lote, q: b.dataset.q, n: b.dataset.n, rel: +b.dataset.rel, area: +b.dataset.area || 0, chip: b }));
  const ids = Object.keys(info);

  const views = {};
  $$(".lm__view").forEach((el) => {
    const img = $("img", el);
    const v = (views[el.dataset.vista] = { el, img, w: +img.getAttribute("width"), h: +img.getAttribute("height"), polys: {}, tags: {}, route: pairs(el.dataset.route), trail: $(".lm__trail", el), me: $("[data-me]", el) });
    $$("polygon", el).forEach((p) => {
      const pts = pairs(p.getAttribute("points"));
      const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
      v.polys[p.dataset.lote] = { el: p, box: { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) } };
    });
    $$(".lm__tag", el).forEach((t) => (v.tags[t.dataset.lote] = { el: t, x: +t.dataset.cx, y: +t.dataset.cy }));
    // comprimento acumulado da rota
    v.len = [0];
    for (let i = 1; i < v.route.length; i++) v.len[i] = v.len[i - 1] + Math.hypot(v.route[i][0] - v.route[i - 1][0], v.route[i][1] - v.route[i - 1][1]);
    v.total = v.len[v.len.length - 1];
  });

  const pointAt = (v, s) => {
    s = clamp(s, 0, v.total);
    let i = 1;
    while (i < v.len.length - 1 && v.len[i] < s) i++;
    const t = (s - v.len[i - 1]) / (v.len[i] - v.len[i - 1] || 1);
    const a = v.route[i - 1], b = v.route[i];
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, i };
  };
  // ponto da rota mais perto de (x, y): devolve a posição (s) ao longo do caminho
  const nearest = (v, x, y) => {
    let best = { d: Infinity, s: 0 };
    for (let i = 1; i < v.route.length; i++) {
      const [ax, ay] = v.route[i - 1], [bx, by] = v.route[i];
      const dx = bx - ax, dy = by - ay;
      const t = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1);
      const d = Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
      if (d < best.d) best = { d, s: v.len[i - 1] + t * Math.sqrt(dx * dx + dy * dy) };
    }
    return best.s;
  };

  /* ---------- Câmera ---------- */
  let mode = "plan", sel = null;
  let size = { w: 0, h: 0 };
  const cur = () => views[mode];

  const allCam = (v) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of Object.values(v.polys)) ((x0 = Math.min(x0, p.box.x0)), (x1 = Math.max(x1, p.box.x1)), (y0 = Math.min(y0, p.box.y0)), (y1 = Math.max(y1, p.box.y1)));
    for (const [x, y] of v.route) ((x0 = Math.min(x0, x)), (x1 = Math.max(x1, x)), (y0 = Math.min(y0, y)), (y1 = Math.max(y1, y)));
    const s = Math.min(size.w / ((x1 - x0) * 1.14), size.h / ((y1 - y0) * 1.2));
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 + (y1 - y0) * 0.02, s };
  };
  const lotCam = (v, id) => {
    const { box } = v.polys[id];
    const all = allCam(v);
    const s = clamp(Math.min(size.w / (box.x1 - box.x0 + 300), size.h / (box.y1 - box.y0 + 230)), all.s * 1.12, 2.2);
    return { x: (box.x0 + box.x1) / 2, y: (box.y0 + box.y1) / 2, s };
  };
  const pointCam = (v, x, y) => ({ x, y, s: allCam(v).s * 1.55 });
  const camFor = (v, t) => (t === "all" ? allCam(v) : typeof t === "string" ? lotCam(v, t) : t); // "all" | id do lote | {x,y,s}
  // a imagem sempre cobre o palco (sem faixas vazias nas bordas)
  const place = (v, c) => {
    const s = Math.max(c.s, size.w / v.w, size.h / v.h);
    const hw = size.w / (2 * s), hh = size.h / (2 * s);
    const x = clamp(c.x, hw, v.w - hw), y = clamp(c.y, hh, v.h - hh);
    v.el.style.setProperty("--s", s.toFixed(4));
    v.el.style.transform = `translate(${(size.w / 2 - x * s).toFixed(1)}px,${(size.h / 2 - y * s).toFixed(1)}px) scale(${s.toFixed(4)})`;
  };
  const look = (target, animate = true) => {
    if (!size.w) return;
    if (!animate) root.classList.remove("is-cam");
    place(cur(), camFor(cur(), target));
    if (!animate) requestAnimationFrame(() => root.classList.add("is-cam"));
  };
  const lookNow = () => look(sel || "all", false);

  /* ---------- Cartão e seleção ---------- */
  const setCard = (kick, title, text, lot) => {
    card.kick.textContent = kick;
    card.title.textContent = title;
    card.text.textContent = text;
    card.facts.hidden = !lot;
    if (lot) {
      card.area.textContent = lot.area ? nf.format(lot.area) + " m²" : "Sob consulta";
      card.meter.style.setProperty("--r", lot.rel);
    }
    card.reset.hidden = !lot && !run;
    card.ask.href = lot ? `${CONTACT}?lote=${lot.id}` : CONTACT;
    card.askT.textContent = lot ? "Quero este lote" : "Falar sobre lotes";
  };
  const mark = (id) => {
    for (const v of Object.values(views)) {
      for (const [k, p] of Object.entries(v.polys)) p.el.classList.toggle("is-sel", k === id);
      for (const [k, t] of Object.entries(v.tags)) t.el.classList.toggle("is-sel", k === id);
    }
    ids.forEach((k) => info[k].chip.setAttribute("aria-pressed", String(k === id)));
    root.classList.toggle("has-sel", !!id);
  };
  const showLot = (id, extra = "") => {
    const l = info[id];
    setCard(l.q + extra, "Lote " + l.n, l.area ? `Lote de ${nf.format(l.area)} m². Fale com a equipe para receber a planta e as condições.` : "Área sob consulta. Fale com a equipe para receber a metragem, a planta e as condições deste lote.", l);
  };
  const showAll = () => setCard("Edan Park", "13 lotes em 3 quadras", "Escolha um lote no mapa ou na lista abaixo para ver a quadra e o tamanho em relação aos outros. Para a metragem e as condições, fale com a equipe.", null);

  function select(id, { cam = true } = {}) {
    if (run) halt(false);
    sel = id;
    mark(id);
    showLot(id);
    if (cam) look(id);
  }
  function clear() {
    if (run) halt(false);
    sel = null;
    mark(null);
    showAll();
    look("all");
  }

  /* ---------- Percurso ---------- */
  let run = null, raf = 0, last = 0;
  const DWELL = 2900, DWELL0 = 1700, SPEED = 0.32;

  const stopsFor = (v) => {
    const lots = ids
      .map((id) => ({ id, s: nearest(v, v.tags[id].x, v.tags[id].y) }))
      .sort((a, b) => a.s - b.s);
    const start = pointAt(v, 0);
    return [{ id: null, s: 0, cam: pointCam(v, start.x, start.y) }, ...lots.map((l) => ({ ...l, cam: lotCam(v, l.id) }))];
  };
  const orderIds = () => stopsFor(cur()).slice(1).map((s) => s.id);

  const setMarker = (v, s) => {
    const p = pointAt(v, s);
    v.me.style.setProperty("--mx", p.x.toFixed(1));
    v.me.style.setProperty("--my", p.y.toFixed(1));
    const pts = v.route.slice(0, p.i).map((q) => q.join(",")).concat(p.x.toFixed(1) + "," + p.y.toFixed(1));
    v.trail.setAttribute("points", pts.join(" "));
  };
  const setGo = (on) => {
    goBtn.dataset.on = on;
    goT.textContent = on ? "Pausar percurso" : run ? "Continuar percurso" : "Fazer o percurso";
  };
  const arrive = (st, k, n) => {
    if (!st.id) {
      mark(null);
      sel = null;
      setCard("Percurso · início", "Entrada do polo", "Daqui seguimos pelas vias internas, passando por cada lote, até a última quadra.", null);
    } else {
      sel = st.id;
      mark(st.id);
      showLot(st.id, ` · ${k} de ${n - 1}`);
    }
    card.reset.hidden = false;
  };

  function startRun() {
    const v = cur();
    const S = stopsFor(v);
    let k = 0;
    if (sel) k = Math.max(0, S.findIndex((s) => s.id === sel));
    run = { S, k, phase: "dwell", t: 0, dur: 0, v };
    root.classList.add("has-run");
    arrive(S[k], k, S.length);
    setMarker(v, S[k].s);
    look(S[k].cam); // a câmera vai até o ponto de partida (com transição); o quadro a quadro começa no 1º deslocamento
    prog.style.setProperty("--p", k / (S.length - 1));
    resume();
  }
  function resume() {
    if (!run) return startRun();
    setGo(true);
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    cancelAnimationFrame(raf);
    setGo(false);
  }
  // encerra o percurso (voltar=true: câmera volta para o mapa todo)
  function halt(voltar) {
    cancelAnimationFrame(raf);
    run = null;
    root.classList.remove("has-run", "is-fly");
    setGo(false);
    if (voltar) {
      sel = null;
      mark(null);
      look("all");
    }
  }
  function finish() {
    halt(true);
    setCard("Fim do percurso", "Gostou de algum lote?", "Fale com a equipe para receber a metragem, a planta e as condições dos lotes que mais combinam com a sua operação.", null);
    card.reset.hidden = true;
  }

  function frame(now) {
    if (!run) return;
    const dt = Math.min(now - last, 64);
    last = now;
    const { S, v } = run;
    run.t += dt;
    if (run.phase === "dwell") {
      if (run.t >= (run.k === 0 ? DWELL0 : DWELL)) {
        if (run.k >= S.length - 1) return finish();
        run.phase = "move";
        root.classList.add("is-fly");
        run.t = 0;
        run.dur = reduce ? 1 : clamp(Math.abs(S[run.k + 1].s - S[run.k].s) / SPEED, 1100, 2600);
      }
    }
    if (run.phase === "move") {
      const u = clamp(run.t / run.dur, 0, 1);
      const e = ease(u);
      const a = S[run.k], b = S[run.k + 1];
      setMarker(v, a.s + (b.s - a.s) * e);
      place(v, { x: a.cam.x + (b.cam.x - a.cam.x) * e, y: a.cam.y + (b.cam.y - a.cam.y) * e, s: a.cam.s + (b.cam.s - a.cam.s) * e });
      prog.style.setProperty("--p", ((run.k + u) / (S.length - 1)).toFixed(4));
      if (u >= 1) {
        run.k++;
        run.phase = "dwell";
        run.t = 0;
        arrive(S[run.k], run.k, S.length);
      }
    }
    raf = requestAnimationFrame(frame);
  }

  /* ---------- Modo (2D / 3D) e imagens ---------- */
  const loadImg = (v) => {
    const im = v.img;
    if (im.dataset.src) {
      im.src = im.dataset.src;
      im.removeAttribute("data-src");
    }
  };
  for (const v of Object.values(views)) {
    const done = () => v.img.classList.add("is-in");
    v.img.addEventListener("load", done);
    if (v.img.complete && v.img.naturalWidth) done();
  }

  function setMode(m) {
    if (m === mode) return;
    mode = m;
    $$("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    for (const [k, v] of Object.entries(views)) v.el.classList.toggle("is-on", k === m);
    loadImg(cur());
    if (run) {
      // continua no mesmo lote (a ordem das paradas pode mudar de uma vista para a outra)
      const at = run.S[run.k].id, playing = goBtn.dataset.on === "true";
      halt(false);
      sel = at;
      startRun();
      if (!playing) pause();
      return;
    }
    lookNow();
  }

  /* ---------- Eventos ---------- */
  root.addEventListener("click", (e) => {
    const lot = e.target.closest("polygon[data-lote],.lm__tag,.lm__list [data-lote]");
    if (lot) return select(lot.dataset.lote);
    const mb = e.target.closest("[data-mode]");
    if (mb) return setMode(mb.dataset.mode);
    if (e.target.closest("[data-go]")) return run && goBtn.dataset.on === "true" ? pause() : resume();
    if (e.target.closest("[data-reset]")) return clear();
    const step = e.target.closest("[data-prev],[data-next]");
    if (step) {
      const order = orderIds();
      const i = order.indexOf(sel);
      const d = step.hasAttribute("data-next") ? 1 : -1;
      select(order[i < 0 ? (d > 0 ? 0 : order.length - 1) : (i + d + order.length) % order.length]);
    }
  });
  root.addEventListener("keydown", (e) => e.key === "Escape" && sel && clear());
  $('[data-mode="3d"]').addEventListener("pointerenter", () => loadImg(views["3d"]), { once: true });
  $('[data-mode="3d"]').addEventListener("focus", () => loadImg(views["3d"]), { once: true });

  // tamanho do palco: recalcula a câmera (também quando a aba do arquivo único passa a ficar visível)
  new ResizeObserver(() => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || (w === size.w && h === size.h)) return;
    size = { w, h };
    if (run) {
      run.S = stopsFor(run.v);
      place(run.v, run.S[run.k].cam);
    } else lookNow();
  }).observe(stage);

  // a planta só baixa quando o mapa está perto da tela
  new IntersectionObserver(
    (es, io) => {
      if (es.some((x) => x.isIntersecting)) (loadImg(views.plan), io.disconnect());
    },
    { rootMargin: "700px 0px" },
  ).observe(stage);

  showAll();
}
