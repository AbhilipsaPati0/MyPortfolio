// Smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Intersection Observer for fade-in animations
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// Typewriter effect for hero
const typewriterText = "Business Analyst  | Switched from Software Development"; // Update this text if needed
let i = 0;
function typeWriter() {
    if (i < typewriterText.length) {
        document.querySelector('.typewriter').innerHTML += typewriterText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}
typeWriter();

// Simple charts for projects (using Chart.js)
const ctx1 = document.getElementById('chart1').getContext('2d');
new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'], // Add your data labels
        datasets: [{
            label: 'Sales Growth (%)', // Add your label
            data: [10, 20, 30, 40], // Add your data points
            backgroundColor: '#00d4ff'
        }]
    }
});

const ctx2 = document.getElementById('chart2').getContext('2d');
new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Add your data labels
        datasets: [{
            label: 'Efficiency Improvement (%)', // Add your label
            data: [5, 15, 25, 35], // Add your data points
            borderColor: '#00d4ff',
            fill: false
        }]
    }
});

// Contact form submission (basic alert - replace with backend if needed)
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message!'); // Add your form handling logic here
});