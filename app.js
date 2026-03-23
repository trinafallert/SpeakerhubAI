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

// ---- SPEECH ANALYZER DEMO ----
const analyzeDemoBtn = document.getElementById('analyzeDemoBtn');
const resultsIdle = document.getElementById('resultsIdle');
const resultsActive = document.getElementById('resultsActive');

const demoData = {
  overallScore: 84,
  pace:    { value: '127 wpm', pct: 72, note: '✓ Ideal range (120–150 wpm). Great rhythm.' },
  clarity: { value: '84%',    pct: 84, note: '↑ Simplify sentence structure in the second half.' },
  energy:  { value: 'High',   pct: 88, note: '✓ Excellent — top 15% of speakers.' },
  vocab:   { value: '71%',    pct: 71, note: '↑ Reduce repeated phrases like "innovative".' },
  fillers: [
    { word: '"um"',        count: 8, cls: 'filler-red' },
    { word: '"like"',      count: 5, cls: 'filler-orange' },
    { word: '"uh"',        count: 4, cls: 'filler-orange' },
    { word: '"basically"', count: 3, cls: 'filler-yellow' },
    { word: '"you know"',  count: 2, cls: 'filler-yellow' },
  ],
  coaching: [
    { icon: '⚡', priority: 'high',     label: 'High Priority',  text: 'Reduce "um" usage — detected 8 times. Practice the pause technique: replace filler sounds with 1-second deliberate silence.' },
    { icon: '🎯', priority: 'medium',   label: 'Improve',        text: 'Clarity drops after the 2-minute mark. Add concrete examples and verbal signposting ("First… Second… Finally…") in your second half.' },
    { icon: '🔥', priority: 'strength', label: 'Strength',       text: 'Exceptional vocal energy throughout — your enthusiasm is a major audience asset. Keep it consistent across all your talks.' },
    { icon: '📈', priority: 'medium',   label: 'Improve',        text: 'Vocabulary repetition detected: "innovative" ×7, "leverage" ×5. Diversify your word choice for more rhetorical impact.' },
  ],
};

function animateBar(id, targetPct) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transition = 'width 0.9s cubic-bezier(0.4,0,0.2,1)';
  el.style.width = targetPct + '%';
}

function animateCount(id, end, duration, suffix) {
  const el = document.getElementById(id);
  if (!el) return;
  const startTime = performance.now();
  const tick = (now) => {
    const t = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.round(t * end) + (suffix || '');
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

if (analyzeDemoBtn) {
  // Tab switching
  document.querySelectorAll('.atab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const icons = { video: '🎬', audio: '🎤', text: '📝' };
      const titles = { video: 'Drop your speech recording here', audio: 'Drop your audio file here', text: 'Paste your speech text below' };
      const subs   = { video: 'MP4, MOV, AVI — up to 2 GB', audio: 'MP3, WAV, M4A — up to 500 MB', text: 'Minimum 200 words for accurate analysis' };
      const t = tab.dataset.tab;
      const zone = document.querySelector('.analyzer-upload-zone .upload-icon');
      const title = document.querySelector('.analyzer-upload-zone .upload-title');
      const sub   = document.querySelector('.analyzer-upload-zone .upload-sub');
      if (zone) zone.textContent = icons[t];
      if (title) title.textContent = titles[t];
      if (sub) sub.textContent = subs[t];
    });
  });

  analyzeDemoBtn.addEventListener('click', () => {
    if (analyzeDemoBtn.disabled) return;
    analyzeDemoBtn.textContent = '⏳ Analyzing…';
    analyzeDemoBtn.disabled = true;

    setTimeout(() => {
      // Show results panel
      if (resultsIdle) resultsIdle.style.display = 'none';
      if (resultsActive) resultsActive.classList.add('active');

      // Overall score counter
      animateCount('overallScore', demoData.overallScore, 1200, '');

      // Staggered metrics
      const metrics = [
        { val: 'metricPace',    note: 'paceNote',    fill: 'paceFill',    data: demoData.pace },
        { val: 'metricClarity', note: 'clarityNote', fill: 'clarityFill', data: demoData.clarity },
        { val: 'metricEnergy',  note: 'energyNote',  fill: 'energyFill',  data: demoData.energy },
        { val: 'metricVocab',   note: 'vocabNote',   fill: 'vocabFill',   data: demoData.vocab },
      ];
      metrics.forEach((m, i) => {
        setTimeout(() => {
          const valEl  = document.getElementById(m.val);
          const noteEl = document.getElementById(m.note);
          if (valEl)  valEl.textContent  = m.data.value;
          if (noteEl) noteEl.textContent = m.data.note;
          animateBar(m.fill, m.data.pct);
        }, 200 + i * 200);
      });

      // Filler words
      setTimeout(() => {
        const total = demoData.fillers.reduce((s, f) => s + f.count, 0);
        const totalEl = document.getElementById('fillerTotal');
        if (totalEl) totalEl.textContent = total + ' total';
        const container = document.getElementById('fillerWords');
        if (container) {
          container.innerHTML = '';
          demoData.fillers.forEach((f, i) => {
            setTimeout(() => {
              const chip = document.createElement('div');
              chip.className = 'filler-chip ' + f.cls;
              chip.innerHTML = '<span>' + f.word + '</span><span class="filler-count">' + f.count + '×</span>';
              container.appendChild(chip);
            }, i * 100);
          });
        }
      }, 1100);

      // Coaching items
      setTimeout(() => {
        const container = document.getElementById('coachingItems');
        if (container) {
          container.innerHTML = '';
          demoData.coaching.forEach((c, i) => {
            setTimeout(() => {
              const item = document.createElement('div');
              item.className = 'coaching-item coaching-' + c.priority;
              item.innerHTML =
                '<div class="coaching-icon">' + c.icon + '</div>' +
                '<div class="coaching-body">' +
                  '<span class="coaching-label">' + c.label + '</span>' +
                  '<p>' + c.text + '</p>' +
                '</div>';
              container.appendChild(item);
            }, i * 150);
          });
        }
      }, 1300);

      analyzeDemoBtn.textContent = '↺ Re-analyze';
      analyzeDemoBtn.disabled = false;
    }, 1800);
  });
}

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
