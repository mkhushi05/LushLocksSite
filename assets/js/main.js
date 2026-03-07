'use strict';

/* ============================================================
   LUSHLOCKS & BEAUTY — Global JavaScript
   ============================================================ */

// ─── Navbar scroll behavior ────────────────────────────────
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    navbar.classList.remove('transparent');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.add('transparent');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ─── Mobile Nav ────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav-close');

function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('nav-open');
}

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.body.classList.remove('nav-open');
}

if (hamburger) hamburger.addEventListener('click', openMobileNav);
if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

// Close on link click or Escape key
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
    closeMobileNav();
  }
});

// ─── Scroll Reveal ─────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ─── Active Nav Link ───────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ─── Policy Tab Switching ──────────────────────────────────
const policyNavBtns = document.querySelectorAll('.policy-nav-btn');
const policySections = document.querySelectorAll('.policy-section');

if (policyNavBtns.length > 0) {
  policyNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.policy;
      policyNavBtns.forEach(b => b.classList.remove('active'));
      policySections.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const targetSection = document.getElementById(target);
      if (targetSection) targetSection.classList.add('active');
    });
  });
}

// ─── FAQ Accordion ─────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!question || !answer) return;

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      const a = openItem.querySelector('.faq-answer');
      if (a) a.style.maxHeight = null;
    });
    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ─── Contact Form — SECURITY: safe DOM manipulation, no innerHTML ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    if (!btn) return;

    const originalChildren = Array.from(btn.childNodes).map(n => n.cloneNode(true));

    // Safe DOM creation — no innerHTML
    btn.textContent = '';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-check';
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createTextNode('\u00a0 Message Sent!');
    btn.appendChild(icon);
    btn.appendChild(text);
    btn.style.background = 'linear-gradient(135deg, #2d8a4e, #3bb06a)';
    btn.disabled = true;
    btn.setAttribute('aria-label', 'Message sent successfully');

    setTimeout(() => {
      btn.textContent = '';
      originalChildren.forEach(child => btn.appendChild(child));
      btn.style.background = '';
      btn.disabled = false;
      btn.setAttribute('aria-label', 'Send Message');
      contactForm.reset();
    }, 4000);
  });
}

// ─── Smooth Scroll for Anchor Links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const selector = anchor.getAttribute('href');
    if (selector === '#') return;
    try {
      const target = document.querySelector(selector);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } catch (err) {
      // Invalid selector — let browser handle
    }
  });
});

// ─── Counter Animation ─────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    // Safe text update
    el.textContent = Math.floor(current) + suffix;
    if (current < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));
}

// ─── Cookie Notice ─────────────────────────────────────────
(function initCookieNotice() {
  if (localStorage.getItem('ll_cookie_accepted')) return;
  const notice = document.getElementById('cookie-notice');
  if (!notice) return;
  notice.style.display = 'flex';
  const acceptBtn = document.getElementById('cookie-accept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('ll_cookie_accepted', '1');
      notice.style.display = 'none';
    });
  }
})();
