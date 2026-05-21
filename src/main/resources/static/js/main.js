/* ═══════════════════════════════════════════════════════════
   AARWINS — PREMIUM WEBSITE JAVASCRIPT
   Scroll Reveal · Particles · API · Modal · Forms · Navbar
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── Navbar Scroll Effect ───────────────────────────────────
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  navbar.classList.toggle('scrolled', current > 60);
  lastScroll = current;
}, { passive: true });

// ── Mobile Menu ────────────────────────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const drawer    = document.getElementById('nav-drawer');
const drawerClose = document.getElementById('drawer-close');

function openDrawer() {
  drawer.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);

document.querySelectorAll('.nav-drawer a').forEach(a => {
  a.addEventListener('click', closeDrawer);
});

// ── Particle System ────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    const hero = canvas.parentElement;
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['rgba(0,201,184,', 'rgba(158,240,26,', 'rgba(255,255,255,'];

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = Math.random() * 3.5 + 1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.5 + 0.1;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = -(Math.random() * 0.6 + 0.2);
    this.life  = 0;
    this.maxLife = Math.random() * 200 + 100;
  };

  Particle.prototype.update = function() {
    this.life++;
    this.x += this.vx;
    this.y += this.vy;
    const progress = this.life / this.maxLife;
    this.alpha = Math.sin(progress * Math.PI) * 0.45;
    if (this.life >= this.maxLife) this.reset();
  };

  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
  };

  // Spawn particles
  for (let i = 0; i < 55; i++) {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife);
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
}

// ── Scroll Reveal ──────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ── Parallax ───────────────────────────────────────────────
function initParallax() {
  const orb = document.querySelector('.hero-orb');
  if (!orb) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orb.style.transform = `translate(${dx * 18}px, ${dy * 12}px) scale(1)`;
  }, { passive: true });
}

// ── Counter Animation ──────────────────────────────────────
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString() + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ── Products API ───────────────────────────────────────────
let allProducts = [];

async function fetchProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  // Show skeletons
  grid.innerHTML = Array(6).fill('<div class="skeleton"></div>').join('');

  try {
    const res = await fetch('/api/products', {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    if (!json.success || !json.data?.length) {
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#6a8880;padding:60px 0;">
        No products available at the moment.
      </p>`;
      return;
    }

    allProducts = json.data;
    renderProducts(allProducts);

  } catch (err) {
    console.error('Products fetch error:', err);

    // Fallback to static demo data so the page still looks great
    allProducts = [
      {
        id: 1,
        name: 'Coconut Pure',
        description: 'Our flagship pure coconut water — crisp, clean, and naturally hydrating. Sourced from young green coconuts at peak freshness.',
        imageUrl: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?q=80&w=900&auto=format&fit=crop',
        price: 3.99,
        category: 'Classic',
        ingredients: 'Young Coconut Water, Natural Minerals, Electrolytes'
      },
      {
        id: 2,
        name: 'Tropical Mint',
        description: 'A cooling blend of fresh mint and coconut water with island citrus notes. Refreshingly light and naturally energizing.',
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=900&auto=format&fit=crop',
        price: 4.49,
        category: 'Infused',
        ingredients: 'Coconut Water, Fresh Mint Extract, Citrus Zest, Vitamin C'
      },
      {
        id: 3,
        name: 'Palm Energy',
        description: 'Light sparkling coconut drink with natural minerals and a gentle effervescence. Infused with palm-derived electrolytes.',
        imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=900&auto=format&fit=crop',
        price: 4.99,
        category: 'Sparkling',
        ingredients: 'Sparkling Coconut Water, Palm Minerals, Magnesium, Potassium'
      },
      {
        id: 4,
        name: 'Island Lime',
        description: 'Zesty tropical citrus blended with premium coconut water for a bright, tangy refreshment packed with Vitamin C.',
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd5bba3f?q=80&w=900&auto=format&fit=crop',
        price: 4.49,
        category: 'Citrus',
        ingredients: 'Coconut Water, Island Lime Juice, Vitamin C, Antioxidants'
      },
      {
        id: 5,
        name: 'Mango Bliss',
        description: 'Sun-kissed mango pulp meets pure coconut water in this tropical indulgence. A velvety smooth sip that transports you to the island.',
        imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=900&auto=format&fit=crop',
        price: 4.99,
        category: 'Fruit Fusion',
        ingredients: 'Coconut Water, Alphonso Mango Pulp, Natural Enzymes, Beta-Carotene'
      },
      {
        id: 6,
        name: 'Ginger Zen',
        description: 'A warm and invigorating blend of coconut water with fresh ginger and turmeric. Anti-inflammatory wellness in every sip.',
        imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=900&auto=format&fit=crop',
        price: 5.49,
        category: 'Wellness',
        ingredients: 'Coconut Water, Fresh Ginger Root, Turmeric, Black Pepper Extract'
      }
    ];
    renderProducts(allProducts);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = products.map((p, i) => `
    <div class="product-card reveal reveal-delay-${(i % 3) + 1}"
         data-id="${p.id}"
         id="product-card-${p.id}"
         onclick="openModal(${p.id})">
      <div class="product-card-img">
        <img src="${p.imageUrl || 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=900'}"
             alt="${p.name}"
             loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=900&auto=format&fit=crop'"/>
        <span class="product-card-badge">${p.category || 'Natural'}</span>
      </div>
      <div class="product-card-body">
        <div class="product-card-cat">${p.category || 'Premium'}</div>
        <h3 class="product-card-name">${p.name}</h3>
        <p class="product-card-desc">${p.description?.slice(0, 90)}${p.description?.length > 90 ? '…' : ''}</p>
        <div class="product-card-footer">
          <span class="product-card-price">$${parseFloat(p.price).toFixed(2)}</span>
          <button class="product-card-btn">Explore →</button>
        </div>
      </div>
    </div>
  `).join('');

  // Re-observe new elements for scroll reveal
  initScrollReveal();
}

// ── Product Filters ────────────────────────────────────────
function initFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      const filtered = filter === 'all'
        ? allProducts
        : allProducts.filter(p =>
            (p.category || '').toLowerCase() === filter.toLowerCase()
          );
      renderProducts(filtered);
    });
  });
}

// ── Product Modal ──────────────────────────────────────────
const modal  = document.getElementById('product-modal');
const mClose = document.getElementById('modal-close');

function openModal(id) {
  const product = allProducts.find(p => p.id == id);
  if (!product || !modal) return;

  document.getElementById('modal-img').src       = product.imageUrl || '';
  document.getElementById('modal-img').alt       = product.name;
  document.getElementById('modal-cat').textContent  = product.category || 'Premium';
  document.getElementById('modal-name').textContent = product.name;
  document.getElementById('modal-price').textContent = `$${parseFloat(product.price).toFixed(2)}`;
  document.getElementById('modal-desc').textContent = product.description || '';
  document.getElementById('modal-ingredients').textContent = product.ingredients || '';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal?.classList.remove('active');
  document.body.style.overflow = '';
}

mClose?.addEventListener('click', closeModal);

modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeDrawer();
  }
});

// ── Contact Form ───────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const contactMsg  = document.getElementById('contact-msg');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.form-submit');
  const btnText = btn.querySelector('span');

  // Loading state
  btn.disabled = true;
  btnText.textContent = 'Sending…';
  contactMsg.className = 'form-msg';

  const data = {
    name:    document.getElementById('contact-name').value.trim(),
    email:   document.getElementById('contact-email').value.trim(),
    message: document.getElementById('contact-message').value.trim()
  };

  try {
    const res = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data)
    });

    const json = await res.json();

    if (json.success) {
      contactMsg.textContent = json.message;
      contactMsg.className   = 'form-msg success';
      contactForm.reset();
    } else {
      contactMsg.textContent = json.message || 'Something went wrong. Please try again.';
      contactMsg.className   = 'form-msg error';
    }
  } catch (err) {
    contactMsg.textContent = 'Network error. Please check your connection and try again.';
    contactMsg.className   = 'form-msg error';
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Send Message';
    setTimeout(() => { contactMsg.className = 'form-msg'; }, 6000);
  }
});

// ── Newsletter Form ────────────────────────────────────────
const newsletterForm = document.getElementById('newsletter-form');
const newsletterMsg  = document.getElementById('newsletter-msg');

newsletterForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn     = document.getElementById('newsletter-btn');
  const input   = document.getElementById('newsletter-email');
  const email   = input.value.trim();

  btn.textContent = '...';
  btn.disabled    = true;
  if (newsletterMsg) newsletterMsg.style.display = 'none';

  try {
    const res = await fetch('/api/newsletter', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email })
    });

    const json = await res.json();

    if (newsletterMsg) {
      newsletterMsg.textContent   = json.message;
      newsletterMsg.style.cssText = `
        display: block;
        color: ${json.success ? '#00C9B8' : '#e05555'};
        font-size: 13px;
        margin-top: 10px;
        font-weight: 500;
        position: relative;
      `;
      newsletterForm.reset();
      setTimeout(() => { if (newsletterMsg) newsletterMsg.style.display = 'none'; }, 5000);
    }
  } catch {
    if (newsletterMsg) {
      newsletterMsg.textContent = 'Error connecting to server.';
      newsletterMsg.style.cssText = 'display:block;color:#e05555;font-size:13px;margin-top:10px;';
    }
  } finally {
    btn.textContent = 'Join →';
    btn.disabled    = false;
  }
});

// ── Smooth Anchor Scroll ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── DOMContentLoaded — Boot Everything ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
  initParallax();
  initCounters();
  fetchProducts();
  initFilters();

  // Stagger hero elements in
  const heroEls = document.querySelectorAll('.hero-animate');
  heroEls.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`;
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
});
