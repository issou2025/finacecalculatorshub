document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav ul');

    if (mobileMenuButton && nav) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenuButton.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && !e.target.closest('.mobile-menu')) {
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuButton.classList.remove('active');
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking a link
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuButton.classList.remove('active');
                }
            }
        });
    });

    // Add loading state to calculator buttons
    document.querySelectorAll('.calculate-btn').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('loading');
            // Remove loading state after calculation (setTimeout simulates calculation time)
            setTimeout(() => {
                button.classList.remove('loading');
            }, 500);
        });
    });

    // Form validation feedback
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });

        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
});

// Input validation helper
function validateInput(input) {
    if (input.checkValidity()) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated sections
document.querySelectorAll('.featured-section, .all-calculators, .about-section, .affiliate-section').forEach(section => {
    section.style.animationPlayState = 'paused';
    observer.observe(section);
}); 