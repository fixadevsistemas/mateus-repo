/* ============================================================
   Mateus Oliveira — Portfolio · interações
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------- Ano no footer -------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* -------- Efeito de montagem em quebra-cabeça na imagem principal -------- */
  (function puzzleIntro() {
    const portrait = document.querySelector(".hero__visual .portrait");
    const img = portrait && portrait.querySelector(".portrait__img");
    if (!portrait || !img || prefersReduced) return;

    const COLS = 6, ROWS = 8;

    function build() {
      const src = img.getAttribute("src");
      portrait.classList.add("puzzling");

      const puzzle = document.createElement("div");
      puzzle.className = "puzzle";
      puzzle.setAttribute("aria-hidden", "true");

      const frag = document.createDocumentFragment();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const t = document.createElement("div");
          t.className = "puzzle-tile";

          // Cópia da imagem em tamanho do container, com object-fit cover
          // (igual à foto real) e deslocada para mostrar só o pedaço desta peça.
          const pi = document.createElement("img");
          pi.className = "puzzle-tile__img";
          pi.src = src;
          pi.alt = "";
          pi.setAttribute("aria-hidden", "true");
          pi.style.width = COLS * 100 + "%";
          pi.style.height = ROWS * 100 + "%";
          pi.style.left = -c * 100 + "%";
          pi.style.top = -r * 100 + "%";
          t.appendChild(pi);

          const dx = (Math.random() * 2 - 1) * 85;
          const dy = (Math.random() * 2 - 1) * 85;
          const rot = (Math.random() * 2 - 1) * 55;
          t.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(.35)`;
          t.style.opacity = "0";
          t.style.transitionDelay = (Math.random() * 1.9).toFixed(3) + "s";
          frag.appendChild(t);
        }
      }
      puzzle.appendChild(frag);
      portrait.appendChild(puzzle);

      // dispara a montagem
      requestAnimationFrame(() => requestAnimationFrame(() => puzzle.classList.add("assemble")));

      // ao final (~3s): revela a imagem real por baixo e remove as peças
      setTimeout(() => {
        portrait.classList.remove("puzzling");
        setTimeout(() => puzzle.remove(), 600);
      }, 3000);
    }

    if (img.complete && img.naturalWidth) build();
    else img.addEventListener("load", build, { once: true });
  })();

  /* -------- Revelar a versão robótica sob o cursor (efeito lanterna) -------- */
  (function roboReveal() {
    const portrait = document.querySelector("[data-reveal-robo]");
    const robo = portrait && portrait.querySelector(".portrait__robo");
    if (!portrait || !robo) return;

    // Carrega a versão robótica de forma diferida (não compete com o load inicial).
    function loadRobo() {
      if (robo.dataset.src && !robo.getAttribute("src")) robo.src = robo.dataset.src;
    }
    if (document.readyState === "complete") setTimeout(loadRobo, 500);
    else window.addEventListener("load", () => setTimeout(loadRobo, 500));
    portrait.addEventListener("pointerenter", loadRobo, { once: true });

    function move(e) {
      const point = e.touches ? e.touches[0] : e;
      const r = portrait.getBoundingClientRect();
      portrait.style.setProperty("--mx", (point.clientX - r.left) + "px");
      portrait.style.setProperty("--my", (point.clientY - r.top) + "px");
    }

    portrait.addEventListener("mouseenter", () => portrait.classList.add("revealing"));
    portrait.addEventListener("mousemove", move);
    portrait.addEventListener("mouseleave", () => portrait.classList.remove("revealing"));

    // Suporte a toque: revela enquanto o dedo desliza sobre a foto
    portrait.addEventListener("touchstart", (e) => { portrait.classList.add("revealing"); move(e); }, { passive: true });
    portrait.addEventListener("touchmove", move, { passive: true });
    portrait.addEventListener("touchend", () => portrait.classList.remove("revealing"));
  })();

  /* -------- Nav: fundo ao rolar + barra de progresso -------- */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------- Menu mobile -------- */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  function toggleMenu(force) {
    const open = force !== undefined ? force : !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  }
  burger.addEventListener("click", () => toggleMenu());
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  /* -------- Reveal on scroll -------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--d", d);
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  /* -------- Contador animado -------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        const dur = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => counterIO.observe(el));

  /* -------- Brilho que segue o mouse -------- */
  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow && !prefersReduced) {
    window.addEventListener("mousemove", (e) => {
      cursorGlow.style.opacity = "1";
      cursorGlow.style.left = e.clientX + "px";
      cursorGlow.style.top = e.clientY + "px";
    });
    window.addEventListener("mouseout", () => { cursorGlow.style.opacity = "0"; });
  }

  /* -------- Partículas em canvas (interativas com o mouse) -------- */
  const canvas = document.getElementById("particles");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, particles, raf;
    const COUNT = 62;
    const mouse = { x: -999, y: -999 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function init() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.7 + 0.5,
      }));
    }
    function step() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(236, 233, 245, 0.30)";
        ctx.fill();

        // conexões entre partículas
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 126) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(236, 233, 245, ${0.10 * (1 - dist / 126)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // reação ao mouse — linhas em coral
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(139, 108, 255, ${0.32 * (1 - mdist / 160)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(step);
    }

    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("mouseout", () => { mouse.x = -999; mouse.y = -999; });
    window.addEventListener("resize", () => { resize(); init(); });

    resize();
    init();
    step();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else step();
    });
  }
})();
