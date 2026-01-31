/* ================================
   Smooth Scrolling (Safe)
================================ */
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ================================
   Section Fade-in Animation
================================ */
const sections = document.querySelectorAll('section');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(section => observer.observe(section));
}

/* ================================
   Typewriter Effect (Clean)
================================ */
const typewriter = document.querySelector('.typewriter');
const text = "Data Analyst | Analytics & AI | Strong Development Foundation";
let index = 0;

function typeEffect() {
  if (typewriter && index < text.length) {
    typewriter.textContent += text.charAt(index);
    index++;
    setTimeout(typeEffect, 70);
  }
}

if (typewriter) {
  typewriter.textContent = ""; // reset on load
  typeEffect();
}

/* ================================
   Charts (Only if Canvas Exists)
================================ */
function loadCharts() {
  const chart1 = document.getElementById('chart1');
  const chart2 = document.getElementById('chart2');

  if (chart1) {
    new Chart(chart1.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Sales Growth (%)',
          data: [12, 18, 28, 35],
          backgroundColor: '#00d4ff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  if (chart2) {
    new Chart(chart2.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Efficiency Improvement (%)',
          data: [5, 12, 22, 30],
          borderColor: '#00d4ff',
          tension: 0.4,
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}

if (typeof Chart !== 'undefined') {
  loadCharts();
}

/* ================================
   Contact Form (Clean UX)
================================ */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    alert("Thanks for reaching out! I'll get back to you soon.");
    contactForm.reset();
  });
}
