// Navigation scroll behavior
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');

// Handle scroll effects
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Demo capture input functionality
const demoInput = document.getElementById('demo-input');
const suggestions = document.querySelectorAll('.suggestion');

suggestions.forEach(suggestion => {
    suggestion.addEventListener('click', () => {
        demoInput.value = suggestion.getAttribute('data-text');
        demoInput.focus();

        // Animate the input
        demoInput.classList.add('highlight');
        setTimeout(() => {
            demoInput.classList.remove('highlight');
        }, 500);
    });
});

// Placeholder animation for demo input
const placeholders = [
    "What's on your mind?",
    "That insight you just had...",
    "A pattern you're noticing...",
    "Something you want to remember...",
    "How you're feeling right now...",
    "An idea worth capturing..."
];

let placeholderIndex = 0;
function cyclePlaceholder() {
    demoInput.placeholder = placeholders[placeholderIndex];
    placeholderIndex = (placeholderIndex + 1) % placeholders.length;
}

setInterval(cyclePlaceholder, 3000);

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// Pricing toggle
const monthlyBtn = document.querySelector('[data-period="monthly"]');
const yearlyBtn = document.querySelector('[data-period="yearly"]');
const priceElement = document.querySelector('.price-amount[data-monthly]');

if (monthlyBtn && yearlyBtn && priceElement) {
    monthlyBtn.addEventListener('click', () => {
        monthlyBtn.classList.add('active');
        yearlyBtn.classList.remove('active');
        priceElement.textContent = priceElement.getAttribute('data-monthly');
    });

    yearlyBtn.addEventListener('click', () => {
        yearlyBtn.classList.add('active');
        monthlyBtn.classList.remove('active');
        priceElement.textContent = priceElement.getAttribute('data-yearly');
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.classList.add('observe-animation');
    observer.observe(section);
});

// Add animation classes for elements
const animateElements = () => {
    // Stats animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const value = stat.textContent;
        if (stat.classList.contains('animated')) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateValue(stat, value);
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(stat);
    });
};

// Animate number counting
function animateValue(element, value) {
    const isPercentage = value.includes('%');
    const isMultiplier = value.includes('x');
    let numValue = parseFloat(value.replace(/[^\d.-]/g, ''));

    if (value.toLowerCase() === 'zero') {
        element.textContent = 'Zero';
        return;
    }

    const duration = 2000;
    const start = 0;
    const increment = numValue / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= numValue) {
            current = numValue;
            clearInterval(timer);
        }

        if (isPercentage) {
            element.textContent = Math.floor(current) + '%';
        } else if (isMultiplier) {
            element.textContent = current.toFixed(1) + 'x';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

animateElements();

// Capture demo interaction
const captureBox = document.querySelector('.capture-demo');
const captureInput = document.querySelector('.capture-input');
const captureSubmit = document.querySelector('.capture-submit');

if (captureSubmit) {
    captureSubmit.addEventListener('click', (e) => {
        e.preventDefault();

        if (captureInput.value.trim()) {
            // Simulate capture
            captureSubmit.innerHTML = '✓';
            captureSubmit.style.background = 'var(--success)';

            setTimeout(() => {
                captureInput.value = '';
                captureSubmit.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                `;
                captureSubmit.style.background = '';
            }, 2000);
        }
    });
}

// Add input highlight animation CSS
const style = document.createElement('style');
style.textContent = `
    .capture-input.highlight {
        animation: highlight 0.5s ease;
    }

    @keyframes highlight {
        0% { background: rgba(147, 176, 160, 0); }
        50% { background: rgba(147, 176, 160, 0.1); }
        100% { background: rgba(147, 176, 160, 0); }
    }

    .observe-animation {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .observe-animation.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
    console.log('Cohesive Journal Landing Page Loaded');
});

// Handle CTA buttons
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    if (button.textContent.includes('Start') || button.textContent.includes('Get Started')) {
        button.addEventListener('click', (e) => {
            if (!button.href) {
                e.preventDefault();
                // You can redirect to your app or show a signup modal
                console.log('Start journey clicked');
                // window.location.href = '/app';
            }
        });
    }
});