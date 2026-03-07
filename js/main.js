/* ============================================================
   GallbladderCare.com — Main JavaScript
   Version: 1.0
   ============================================================ */

(function () {
  'use strict';

  // ── Language Toggle ─────────────────────────────────────
  const LANG_KEY = 'gcLang';
  const htmlEl   = document.documentElement;
  const langBtns = document.querySelectorAll('.lang-btn');

  function setLang(lang) {
    htmlEl.className = 'lang-' + lang;
    localStorage.setItem(LANG_KEY, lang);
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // Update html lang attribute
    htmlEl.setAttribute('lang', lang === 'cn' ? 'zh' : 'en');
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  // Restore saved language or default to CN
  const saved = localStorage.getItem(LANG_KEY) || 'cn';
  setLang(saved);


  // ── Sticky Navbar Shadow ────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }


  // ── Mobile Hamburger Menu ───────────────────────────────
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }


  // ── FAQ Accordion ───────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const trigger = item.querySelector('.faq-q');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(other => {
        other.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) item.classList.add('open');
    });

    // Keyboard accessibility
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });


  // ── FAQ Category Filter ─────────────────────────────────
  const faqCatBtns = document.querySelectorAll('.faq-cat-btn');
  if (faqCatBtns.length) {
    faqCatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        faqCatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.faq-item').forEach(item => {
          if (cat === 'all' || item.dataset.cat === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }


  // ── Product Filter ──────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.product-card').forEach(card => {
          if (filter === 'all' || card.dataset.cat === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }


  // ── Active Nav Link ─────────────────────────────────────
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.replace(/\/$/, '') || '/';
    if (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    }
  });


  // ── Smooth Scroll for Anchor Links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ── Newsletter Form ─────────────────────────────────────
  const newsletterForms = document.querySelectorAll('.newsletter-form-el');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const emailEl = form.querySelector('input[type=email]');
      if (!emailEl || !emailEl.value.includes('@')) {
        emailEl && emailEl.focus();
        return;
      }
      const btn = form.querySelector('button');
      if (btn) {
        const lang = htmlEl.classList.contains('lang-en') ? 'en' : 'cn';
        btn.textContent = lang === 'en' ? 'Subscribed! ✓' : '订阅成功 ✓';
        btn.disabled = true;
        btn.style.background = 'var(--success)';
      }
      // TODO: Wire to email service (Mailchimp / ConvertKit / etc.)
    });
  });


  // ── Contact Form ────────────────────────────────────────
  const contactForm = document.querySelector('.contact-form-el');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type=submit]');
      if (btn) {
        const lang = htmlEl.classList.contains('lang-en') ? 'en' : 'cn';
        btn.textContent = lang === 'en' ? 'Message Sent! ✓' : '已发送 ✓';
        btn.disabled = true;
        btn.style.background = 'var(--success)';
      }
      // TODO: Wire to contact endpoint
    });
  }


  // ── Simple Intersection Observer for Fade-in ───────────
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .fade-in { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }
      .fade-in.visible { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(
      '.cat-card, .product-card, .trust-card, .testimonial-card, .ebook-card'
    ).forEach(el => {
      el.classList.add('fade-in');
      obs.observe(el);
    });
  }

})();
