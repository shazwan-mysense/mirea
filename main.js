/* ============================================================
   MIREA CHERAS — Interaction layer (vanilla, no dependencies)
   ============================================================ */

// Preview helper: ?instant disables reveal-hiding (useful for QA screenshots)
if (new URLSearchParams(location.search).has('instant')) {
  document.documentElement.classList.add('instant');
}

/* ---------- Header state ---------- */
const header = document.getElementById('header');
const onScrollHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
function closeMenu() {
  burger.classList.remove('is-open');
  menu.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', () => {
  const open = burger.classList.toggle('is-open');
  menu.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

/* ---------- Scroll reveals (staggered via data-delay) ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('is-visible'), delay);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- Count-up stats ---------- */
const counters = document.querySelectorAll('[data-count]');
if (counters.length && 'IntersectionObserver' in window) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      cio.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const dur = 2000;
      let t0 = null;
      const tick = (t) => {
        if (t0 === null) t0 = t;
        const p = Math.min(1, Math.max(0, (t - t0) / dur));
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(tick);
    });
  }, { rootMargin: '0px 0px -38% 0px' });
  counters.forEach((el) => cio.observe(el));
} else {
  counters.forEach((el) => {
    el.textContent = parseFloat(el.dataset.count).toFixed(parseInt(el.dataset.decimals || '0', 10));
  });
}

/* ---------- Lead form (mockup behaviour) ---------- */
const form = document.getElementById('leadForm');
const success = document.getElementById('formSuccess');
const errorBox = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorBox.textContent = '';

  const name = document.getElementById('f-name');
  const phone = document.getElementById('f-phone');
  const email = document.getElementById('f-email');
  const consent = document.getElementById('f-consent');

  [name, phone, email].forEach((f) => f.classList.remove('is-invalid'));

  const problems = [];
  if (name.value.trim().length < 2) { problems.push('your name'); name.classList.add('is-invalid'); }
  if (!/^\+?[\d\s-]{9,15}$/.test(phone.value.trim())) { problems.push('a valid phone number'); phone.classList.add('is-invalid'); }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { problems.push('a valid email'); email.classList.add('is-invalid'); }
  if (!consent.checked) { problems.push('PDPA consent'); }

  if (problems.length) {
    errorBox.textContent = 'Please provide ' + problems.join(', ') + '.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  // Mockup: simulate routing to the sales team / CRM
  setTimeout(() => {
    success.hidden = false;
  }, 900);
});
