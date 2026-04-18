/* =============================================
   MIKE RODGERS — MAIN JS
   ============================================= */

// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close mobile nav when tapping outside
function closeNavIfOutside(e) {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}
document.addEventListener('click', closeNavIfOutside);
document.addEventListener('touchstart', closeNavIfOutside, { passive: true });

// --- Footer year ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Contact form (client-side only; wire to backend / Formspree as needed) ---
const bookForm    = document.getElementById('bookForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

if (bookForm) {
  bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const required = bookForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        valid = false;
      }
    });

    if (!valid) return;

    const submitBtn = bookForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    if (formError) formError.textContent = '';

    try {
      const payload = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName:  document.getElementById('lastName').value.trim(),
        email:     document.getElementById('email').value.trim(),
        phone:     document.getElementById('phone').value.trim(),
        service:   document.getElementById('service').value.trim(),
        message:   document.getElementById('message').value.trim()
      };

      const response = await fetch('https://formspree.io/f/mwvwaood', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok !== false) {
        bookForm.style.display = 'none';
        const successEl = document.getElementById('formSuccess');
        if (successEl) successEl.style.display = 'flex';
      } else {
        const msg = (data.errors && data.errors[0] && data.errors[0].message) || 'Something went wrong. Please try again.';
        if (formError) formError.textContent = msg;
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }
    } catch (err) {
      if (formError) formError.textContent = 'Network error — please check your connection and try again.';
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });
}

// --- Book again button ---
const bookAgainBtn = document.getElementById('bookAgainBtn');
if (bookAgainBtn) {
  bookAgainBtn.addEventListener('click', () => {
    bookForm.reset();
    bookForm.style.display = '';
    const successEl = document.getElementById('formSuccess');
    if (successEl) successEl.style.display = 'none';
    bookForm.querySelectorAll('[required]').forEach(f => f.style.borderColor = '');
  });
}

// --- Autoplay video on scroll into view ---
(function () {
  const video    = document.getElementById('heroVideo');
  const muteBtn  = document.getElementById('videoMuteBtn');
  const muteIcon = document.getElementById('muteIcon');
  const unmuteIcon = document.getElementById('unmuteIcon');
  const muteLabel = muteBtn && muteBtn.querySelector('span');
  if (!video || !muteBtn) return;

  // Play/pause based on visibility
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  videoObserver.observe(video);

  // Mute toggle
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteIcon.hidden   = !video.muted;
    unmuteIcon.hidden =  video.muted;
    muteLabel.textContent = video.muted ? 'Muted' : 'Sound On';
  });
})();

// --- Testimonial video autoplay ---
(function () {
  const video      = document.getElementById('testimonialVideo');
  const muteBtn    = document.getElementById('testimonialMuteBtn');
  const muteIcon   = document.getElementById('testimonialMuteIcon');
  const unmuteIcon = document.getElementById('testimonialUnmuteIcon');
  const muteLabel  = muteBtn && muteBtn.querySelector('span');
  if (!video || !muteBtn) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  obs.observe(video);

  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteIcon.hidden   = !video.muted;
    unmuteIcon.hidden =  video.muted;
    muteLabel.textContent = video.muted ? 'Muted' : 'Sound On';
  });
})();

// --- Gallery Carousel ---
(function () {
  const track   = document.getElementById('galleryTrack');
  const dotsWrap = document.getElementById('galleryDots');
  if (!track) return;

  const slides = track.querySelectorAll('.gallery-slide');
  const total  = slides.length;
  let current  = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.gallery-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  document.getElementById('galleryPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('galleryNext').addEventListener('click', () => goTo(current + 1));

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  resetTimer();
})();

// --- Testimonials horizontal carousel ---
(function () {
  const carousel = document.getElementById('testimonialsCarousel');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let isPaused = false;
  let resumeTimer;
  let autoTimer;

  function goTo(index) {
    current = (index + total) % total;
    cards[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => { if (!isPaused) goTo(current + 1); }, 4500);
  }

  // Track scroll position to sync current index
  carousel.addEventListener('scroll', () => {
    const cardWidth = cards[0].offsetWidth + 20;
    current = Math.round(carousel.scrollLeft / cardWidth);
  }, { passive: true });

  // Desktop: click to toggle pause
  carousel.addEventListener('click', () => {
    isPaused = !isPaused;
    carousel.classList.toggle('paused', isPaused);
  });

  // Mobile: touchstart pauses, touchend resumes after delay
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isPaused = true;
    clearTimeout(resumeTimer);
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const diff = Math.abs(touchStartX - e.changedTouches[0].clientX);
    // Resume after 3s on swipe, immediately on hold-release with no movement
    resumeTimer = setTimeout(() => {
      isPaused = false;
      carousel.classList.remove('paused');
    }, diff > 10 ? 3000 : 1000);
  }, { passive: true });

  startAuto();
})();

// --- Intersection Observer: fade-in sections on scroll ---
const observerOpts = { threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll(
  '.service-card, .social-card, .about-grid, .book-grid, .section-header'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Add fade-in styles dynamically
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .service-card:nth-child(2) { transition-delay: 0.08s; }
  .service-card:nth-child(3) { transition-delay: 0.16s; }
  .service-card:nth-child(4) { transition-delay: 0.08s; }
  .service-card:nth-child(5) { transition-delay: 0.16s; }
  .service-card:nth-child(6) { transition-delay: 0.24s; }
  .social-card:nth-child(2)  { transition-delay: 0.1s; }
  .social-card:nth-child(3)  { transition-delay: 0.2s; }
`;
document.head.appendChild(style);
