
/* =========================================================
   ABHILIPSA PATI — PORTFOLIO INTERACTIONS
   File: script.js
========================================================= */

"use strict";

/* ---------- 1. DOM HELPERS ---------- */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- 2. MOBILE NAVIGATION ---------- */

const sidebar = $("#sidebar");
const navToggle = $("#navToggle");
const scrim = $("#scrim");
const body = document.body;

function openMenu() {
  if (!sidebar || !navToggle) return;

  body.classList.add("menu-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation");

  if (scrim) {
    scrim.setAttribute("aria-hidden", "false");
  }
}

function closeMenu() {
  body.classList.remove("menu-open");

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  }

  if (scrim) {
    scrim.setAttribute("aria-hidden", "true");
  }
}

if (navToggle) {
  navToggle.setAttribute("aria-expanded", "false");

  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.contains("menu-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

if (scrim) {
  scrim.addEventListener("click", closeMenu);
}

$$('#sidebar a[href^="#"]').forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});

/* ---------- 3. SMOOTH SECTION NAVIGATION ---------- */

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href === "#") return;

    let target;

    try {
      target = document.querySelector(href);
    } catch {
      return;
    }

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    // Update the URL without triggering a second jump.
    if (history.replaceState) {
      history.replaceState(null, "", href);
    }
  });
});

/* ---------- 4. ACTIVE SIDEBAR SECTION ---------- */

const navLinks = $$('#sidebar a[href^="#"]');

const observedSections = navLinks
  .map((link) => {
    const href = link.getAttribute("href");

    try {
      return href ? document.querySelector(href) : null;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isActive = href === `#${sectionId}`;

    link.classList.toggle("active", isActive);
    link.classList.toggle("is-current", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio - a.intersectionRatio
        );

      if (visibleSections.length) {
        setActiveNav(visibleSections[0].target.id);
      }
    },
    {
      root: null,
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0, 0.1, 0.25, 0.5],
    }
  );

  observedSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* ---------- 5. PROJECT FILTERING ---------- */

const filterButtons = $$("#filterRow [data-filter]");
const projectCards = $$(".project-card[data-cat]");

function filterProjects(category) {
  projectCards.forEach((card) => {
    const cardCategories = (card.dataset.cat || "")
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean);

    const shouldShow =
      category === "all" ||
      cardCategories.includes(category.toLowerCase());

    card.hidden = !shouldShow;

    if (shouldShow) {
      card.classList.remove("filter-hidden");
    }
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

filterButtons.forEach((button) => {
  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active"))
  );

  button.addEventListener("click", () => {
    filterProjects(button.dataset.filter || "all");
  });
});

/* ---------- 6. SCROLL REVEAL ANIMATIONS ---------- */

const revealCandidates = [
  ".section-heading",
  ".about-card",
  ".about-panel",
  ".skill-card",
  ".project-card",
  ".cert-card",
  ".certification-card",
  ".timeline-item",
  ".achievement-card",
  ".contact-panel",
  ".contact-form-card",
  ".stat-card",
];

const revealElements = [
  ...new Set(
    revealCandidates.flatMap((selector) => $$(selector))
  ),
];

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -35px 0px",
    }
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

/* ---------- 7. ANIMATED COUNTERS ---------- */

function animateCounter(element) {
  if (element.dataset.countAnimated === "true") return;

  const target = Number(element.dataset.count);

  if (!Number.isFinite(target)) return;

  element.dataset.countAnimated = "true";

  if (prefersReducedMotion) {
    element.textContent = String(target);
    return;
  }

  const duration = 1100;
  const startTime = performance.now();

  function updateCounter(now) {
    const progress = Math.min((now - startTime) / duration, 1);

    // Ease-out cubic.
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(target * eased);

    element.textContent = currentValue.toLocaleString("en-IN");

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = String(target);
    }
  }

  requestAnimationFrame(updateCounter);
}

const counterElements = $$("[data-count]");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.5,
    }
  );

  counterElements.forEach((element) => {
    counterObserver.observe(element);
  });
} else {
  counterElements.forEach(animateCounter);
}

/* ---------- 8. DASHBOARD SVG BAR ANIMATIONS ---------- */

/*
  IMPORTANT:
  These bars are SVG <rect> elements.
  Animate their SVG attributes, not CSS height or width.
  The chart in the supplied HTML uses y=100 as its baseline.
*/

const dashboardBars = $$("svg rect.bar[data-h]");

function animateBars() {
  dashboardBars.forEach((bar, index) => {
    const rawHeight = Number(bar.dataset.h);

    if (!Number.isFinite(rawHeight)) return;

    const height = Math.max(0, Math.min(100, rawHeight));
    const baseline = Number(bar.dataset.baseline || 100);

    // Remove any conflicting CSS geometry or animation.
    bar.style.removeProperty("height");
    bar.style.removeProperty("width");
    bar.style.removeProperty("--bar-height");
    bar.style.removeProperty("animation");
    bar.style.animation = "none";

    // Ensure the SVG bars have a visible color.
    bar.setAttribute("fill", "#A7E8D3");

    if (prefersReducedMotion) {
      bar.setAttribute("height", String(height));
      bar.setAttribute("y", String(baseline - height));
      return;
    }

    // Begin at zero height, then grow to the target.
    bar.setAttribute("height", "0");
    bar.setAttribute("y", String(baseline));

    window.setTimeout(() => {
      bar.setAttribute("height", String(height));
      bar.setAttribute("y", String(baseline - height));
    }, index * 65);
  });
}

animateBars();

/* ---------- 9. PROJECT CARD HOVER POLISH ---------- */

$$(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (
      prefersReducedMotion ||
      event.pointerType === "touch"
    ) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--pointer-x", `${x}px`);
    card.style.setProperty("--pointer-y", `${y}px`);
  });
});

/* ---------- 10. EXTERNAL LINK SAFETY ---------- */

$$('a[target="_blank"]').forEach((link) => {
  const relTokens = new Set(
    (link.getAttribute("rel") || "")
      .split(/\s+/)
      .filter(Boolean)
  );

  relTokens.add("noopener");
  relTokens.add("noreferrer");

  link.setAttribute("rel", [...relTokens].join(" "));
});

/* ---------- 11. CONTACT FORM VALIDATION ---------- */

const contactForm = $("#contact-form");
const formStatus = $("#formStatus");

function showFormStatus(message, type = "success") {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.classList.toggle("error", type === "error");
  formStatus.setAttribute("role", "status");
  formStatus.setAttribute("aria-live", "polite");
}

function getFieldValue(form, fieldName) {
  const field = form.elements.namedItem(fieldName);

  return field && "value" in field
    ? field.value.trim()
    : "";
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = getFieldValue(contactForm, "name");
    const email = getFieldValue(contactForm, "email");
    const subject = getFieldValue(contactForm, "subject");
    const message = getFieldValue(contactForm, "message");

    if (!name || !email || !message) {
      showFormStatus(
        "Please complete your name, email address, and message.",
        "error"
      );
      return;
    }

    // Correct email validation pattern.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showFormStatus(
        "Please enter a valid email address.",
        "error"
      );

      const emailField = contactForm.elements.namedItem("email");

      if (emailField && typeof emailField.focus === "function") {
        emailField.focus();
      }

      return;
    }

    /*
      This portfolio has no backend email service.
      Prepare the enquiry in the visitor's email application.
    */

    const recipient = "abhilipsapati2@gmail.com";
    const emailSubject =
      subject || `Portfolio enquiry from ${name}`;

    const emailBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailtoURL =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(emailSubject)}` +
      `&body=${encodeURIComponent(emailBody)}`;

    showFormStatus(
      "Opening your email application. If it does not open, email abhilipsapati2@gmail.com directly."
    );

    window.location.href = mailtoURL;
  });
}

/* ---------- 12. FOOTER YEAR ---------- */

const yearElements = $$(".current-year");

yearElements.forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const footerYear = $("#year");

if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}

/* ---------- 13. INITIAL PAGE STATE ---------- */

function initializePortfolio() {
  closeMenu();

  // Apply the default project filter if one exists.
  const defaultFilter = filterButtons.find(
    (button) => button.classList.contains("active")
  );

  if (defaultFilter) {
    filterProjects(defaultFilter.dataset.filter || "all");
  }

  // Support opening the page directly at a section URL.
  if (window.location.hash) {
    let target = null;

    try {
      target = document.querySelector(window.location.hash);
    } catch {
      target = null;
    }

    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: "auto",
          block: "start",
        });
      });
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePortfolio);
} else {
  initializePortfolio();
}

/* ---------- 14. DEBUG MESSAGE ---------- */

console.log(
  "%cAbhilipsa Pati | Portfolio",
  "color: #167D78; font-size: 16px; font-weight: bold;"
);

console.log("Portfolio interactions initialized successfully.");
