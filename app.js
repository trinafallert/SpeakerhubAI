// SpeakerAI — Main JS

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Beta form
const form = document.getElementById('betaForm');
const betaSuccess = document.getElementById('betaSuccess');
const betaBtnText = document.getElementById('betaBtnText');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('betaName').value.trim();
  const email = document.getElementById('betaEmail').value.trim();
  const role = document.getElementById('betaRole').value;

  if (!name || !email) return;

  betaBtnText.textContent = 'Joining...';

  // Simulate submission (replace with real API call)
  setTimeout(() => {
    form.style.display = 'none';
    betaSuccess.style.display = 'flex';

    // Store locally for demo
    const signups = JSON.parse(localStorage.getItem('speakerai_signups') || '[]');
    signups.push({ name, email, role, ts: Date.now() });
    localStorage.setItem('speakerai_signups', JSON.stringify(signups));
  }, 1000);
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.feature-card, .step, .testimonial-card, .pricing-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Add CSS for fade-in
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  .feature-card:nth-child(2) { transition-delay: 0.1s; }
  .feature-card:nth-child(3) { transition-delay: 0.15s; }
  .feature-card:nth-child(4) { transition-delay: 0.2s; }
  .testimonial-card:nth-child(2) { transition-delay: 0.1s; }
  .testimonial-card:nth-child(3) { transition-delay: 0.2s; }
`;
document.head.appendChild(style);
