/* ================================
   Mobile sidebar toggle
================================ */
const navToggle = document.getElementById('navToggle');
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');

function closeSidebar() {
  sidebar.classList.remove('is-open');
  scrim.classList.remove('is-visible');
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    scrim.classList.toggle('is-visible', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  scrim.addEventListener('click', closeSidebar);
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });
}

/* ================================
   Smooth scrolling
================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ================================
   Section fade-in on scroll
================================ */
const sections = document.querySelectorAll('.section');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(section => revealObserver.observe(section));
} else {
  sections.forEach(section => section.classList.add('is-visible'));
}

/* ================================
   Hero dashboard sequence:
   KPI count-up + bar chart grow + typing line
   Fires once, when hero enters view
================================ */
function animateKpis() {
  document.querySelectorAll('.kpi-value').forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    let current = 0;
    const step = Math.max(1, Math.round(target / 24));
    const tick = () => {
      current = Math.min(target, current + step);
      el.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
  });
}

function animateBars() {
  document.querySelectorAll('.bar').forEach((bar, i) => {
    const h = parseFloat(bar.dataset.h);
    setTimeout(() => {
      bar.setAttribute('height', h);
      bar.setAttribute('y', 100 - h);
    }, i * 120);
  });
}

function typeLine() {
  const el = document.getElementById('typingLine');
  if (!el) return;
  const text = 'building dashboard...';
  let i = 0;
  el.textContent = '';
  const type = () => {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 55);
    }
  };
  type();
}

const heroPanel = document.querySelector('.hero-panel');
let heroAnimated = false;

if (heroPanel && 'IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !heroAnimated) {
        heroAnimated = true;
        animateKpis();
        animateBars();
        typeLine();
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  heroObserver.observe(heroPanel);
} else {
  animateKpis();
  animateBars();
  typeLine();
}

/* ================================
   Project filtering
================================ */
const filterRow = document.getElementById('filterRow');
const projectCards = document.querySelectorAll('.project-card');

if (filterRow) {
  filterRow.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterRow.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('is-hidden', !show);
    });
  });
}

/* ================================
   Contact form (front-end only)
================================ */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    alert("Thanks for reaching out! I'll get back to you soon.");
    contactForm.reset();
  });
}