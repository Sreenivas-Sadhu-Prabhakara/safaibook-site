/* SafaiBook explainer — tiny interactions, no dependencies.
   1) Sticky-nav active-link highlight on scroll.
   2) Smooth scroll for in-page anchors (with reduced-motion respect).
   3) Signature touch: the hero collection register "collects itself" —
      Iqbal's due fee moves reminder -> paid -> numbered receipt, and the
      Collected / Pending totals tick over. A live demo of the promise. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            a.style.color = "var(--accent)";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 2. Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Signature: the register collects itself ---------- */
  var rows = document.getElementById("reg-rows");
  var liveTag = document.getElementById("reg-live-tag");
  var caption = document.getElementById("reg-caption");
  var collectedEl = document.getElementById("reg-collected");
  var pendingEl = document.getElementById("reg-pending");

  if (!rows || !liveTag || !collectedEl || !pendingEl) return;

  // Iqbal Sheikh's row is the one that "collects itself".
  var iqbalRow = rows.querySelector('[data-state="due"]');

  var IQBAL_AMOUNT = 100;      // his monthly fee
  var BASE_COLLECTED = 220;    // Kamala's fee already in
  var BASE_PENDING = 250;      // Iqbal (100) + Lakshmi's overdue (150)

  function rupee(n) {
    return "Rs " + n.toLocaleString("en-IN");
  }

  // Cycle: reminder sent (idle) -> home pays -> numbered receipt -> reset.
  var stages = [
    {
      tag: "Reminder sent",
      tagClass: "tag--due",
      caption: "Iqbal pays on UPI → receipt SB-2607-018 goes out automatically.",
      collected: BASE_COLLECTED,
      pending: BASE_PENDING,
      state: "due",
      flash: false
    },
    {
      tag: "Paid ✓",
      tagClass: "tag--paid",
      caption: "Rs 100 received from Iqbal — due cleared, no re-visit needed.",
      collected: BASE_COLLECTED + IQBAL_AMOUNT,
      pending: BASE_PENDING - IQBAL_AMOUNT,
      state: "paid",
      flash: true
    },
    {
      tag: "Receipt sent",
      tagClass: "tag--paid",
      caption: "Receipt SB-2607-018 delivered on WhatsApp. That's the whole cycle.",
      collected: BASE_COLLECTED + IQBAL_AMOUNT,
      pending: BASE_PENDING - IQBAL_AMOUNT,
      state: "paid",
      flash: false
    }
  ];

  var i = 0;

  function applyStage(s) {
    liveTag.textContent = s.tag;
    liveTag.className = "reg-row__tag " + s.tagClass;
    if (iqbalRow) iqbalRow.setAttribute("data-state", s.state);
    caption.textContent = s.caption;
    collectedEl.textContent = rupee(s.collected);
    pendingEl.textContent = rupee(s.pending);
    if (iqbalRow) {
      if (s.flash) {
        iqbalRow.classList.add("flash");
        setTimeout(function () {
          iqbalRow.classList.remove("flash");
        }, 900);
      }
    }
  }

  function advance() {
    i = (i + 1) % stages.length;
    applyStage(stages[i]);
  }

  // If the user prefers reduced motion, just show the "paid" end-state
  // once (the promise fulfilled) and don't loop.
  if (reduceMotion) {
    applyStage(stages[1]);
    liveTag.textContent = "Paid ✓";
    caption.textContent =
      "Reminder → paid → numbered receipt — the whole collection cycle, hands-free.";
    return;
  }

  // Only animate while the widget is on screen (saves work, feels intentional).
  var running = false;
  var timer = null;

  function loop() {
    timer = setTimeout(function () {
      advance();
      loop();
    }, i === 0 ? 2600 : 2000);
  }

  var vis = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!e.isIntersecting && running) {
          running = false;
          clearTimeout(timer);
        }
      });
    },
    { threshold: 0.35 }
  );
  vis.observe(rows.closest(".register"));
})();
