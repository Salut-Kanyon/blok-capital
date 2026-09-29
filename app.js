document.documentElement.classList.add("js");

const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".menu");

toggle.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Close" : "Menu";
  if (!open) {
    const services = menu.querySelector(".menu-item");
    services?.classList.remove("is-open");
    services?.querySelector("a")?.setAttribute("aria-expanded", "false");
  }
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const servicesLink = link.matches(".menu-item > a");
    const phone = window.matchMedia("(max-width: 980px)").matches;
    if (servicesLink && phone) {
      event.preventDefault();
      const item = link.parentElement;
      const open = item.classList.toggle("is-open");
      link.setAttribute("aria-expanded", String(open));
      return;
    }
    document.body.classList.remove("nav-open");
    menu.querySelector(".menu-item")?.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  });
});

const revealNodes = document.querySelectorAll(
  ".hero-copy, .hero-photo, .service, .metrics, .foot-copy, .foot-photo, .section-head, .project, .partner-cta, .contact, .partners, .page-hero, .block, .person, .press-card, .card, .advisor, .thesis li, .strategy-steps li, .market-stat"
);

const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.hidden = true;
    const done = document.querySelector(".form-success");
    if (done) done.hidden = false;
  });
}
revealNodes.forEach((node, index) => {
  node.classList.add("rise");
  node.style.setProperty("--d", `${(index % 3) * 0.08}s`);
});

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const heroVideo = document.querySelector(".hero-video");
if (heroVideo) {
  heroVideo.controls = false;
  heroVideo.muted = true;
  heroVideo.removeAttribute("controls");
  const stopTouch = (event) => event.preventDefault();
  heroVideo.addEventListener("contextmenu", stopTouch);
  heroVideo.addEventListener("pointerdown", stopTouch);
  const startHero = () => {
    if (reduce) {
      heroVideo.pause();
      return;
    }
    const playing = heroVideo.play();
    if (playing) playing.catch(() => {});
  };
  if (heroVideo.readyState >= 3) startHero();
  else heroVideo.addEventListener("canplay", startHero, { once: true });
}
if (reduce) {
  revealNodes.forEach((node) => node.classList.add("in"));
} else {
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      seen.unobserve(entry.target);
    });
  }, { threshold: 0.16 });
  revealNodes.forEach((node) => seen.observe(node));
}

const bar = document.querySelector(".progress");
function paintProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}
paintProgress();
window.addEventListener("scroll", paintProgress, { passive: true });

function countUp(node) {
  const target = Number(node.dataset.count);
  const prefix = node.dataset.prefix || "";
  const suffix = node.dataset.suffix || "";
  if (reduce) {
    node.textContent = `${prefix}${target}${suffix}`;
    return;
  }
  const start = performance.now();
  const duration = 1100;
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    node.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const portfolio = document.querySelector(".portfolio-preview");
const portfolioToggle = document.querySelector(".portfolio-toggle");
if (portfolio && portfolioToggle) {
  portfolioToggle.addEventListener("click", () => {
    const open = portfolio.classList.toggle("is-open");
    portfolioToggle.setAttribute("aria-expanded", String(open));
    portfolioToggle.setAttribute("aria-label", open ? "Show fewer properties" : "Show more properties");
    if (open) portfolio.querySelectorAll(".project").forEach((node) => node.classList.add("in"));
  });
}

const counters = document.querySelectorAll("[data-count]");
const counted = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    countUp(entry.target);
    counted.unobserve(entry.target);
  });
}, { threshold: 0.6 });
counters.forEach((node) => counted.observe(node));
