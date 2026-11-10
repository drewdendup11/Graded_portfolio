/* Portfolio interactivity: theme toggle, skill bars, project filter,
   contact form validation, back-to-top, mobile menu auto-close. */

(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- Theme toggle (remembers choice) ---------- */
  const themeBtn = document.getElementById("themeToggle");
  const themeIcon = themeBtn.querySelector("i");

  function applyTheme(theme) {
    root.setAttribute("data-bs-theme", theme);
    const isDark = theme === "dark";
    themeIcon.className = isDark ? "bi bi-sun" : "bi bi-moon-stars";
    themeBtn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  }

  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage unavailable */ }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  themeBtn.addEventListener("click", function () {
    const next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });

  /* ---------- Skill bars animate when scrolled into view ---------- */
  const skills = document.querySelectorAll(".skill");
  function fillBar(el) {
    el.querySelector(".progress-bar").style.width = el.dataset.level + "%";
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { fillBar(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    skills.forEach(function (s) { io.observe(s); });
  } else {
    skills.forEach(fillBar);
  }

  /* ---------- Project filter ---------- */
  const filterBar = document.getElementById("projectFilters");
  const projects = document.querySelectorAll("#projectGrid .project");
  filterBar.addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    filterBar.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projects.forEach(function (p) {
      p.classList.toggle("is-hidden", filter !== "all" && p.dataset.category !== filter);
    });
  });

  /* ---------- Contact form: validate, then open the visitor's email app ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  // EDIT: the address that should receive messages
  const RECEIVER = "drewdendup11@gmailcom";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      status.innerHTML = '<div class="alert alert-danger mb-0">Fix the highlighted fields and try again.</div>';
      return;
    }
    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const message = document.getElementById("cMessage").value.trim();
    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
    window.location.href = "mailto:" + RECEIVER + "?subject=" + subject + "&body=" + body;
    status.innerHTML = '<div class="alert alert-success mb-0">Opening your email app to send the message.</div>';
    form.reset();
    form.classList.remove("was-validated");
  });

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    toTop.hidden = window.scrollY < 500;
  }, { passive: true });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0 });
  });

  /* ---------- Close the mobile menu after choosing a link ---------- */
  const menu = document.getElementById("navMenu");
  document.querySelectorAll("#navMenu .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
