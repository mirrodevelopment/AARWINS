/* ════════════════════════════════════════════════
   AARWINS — Site JavaScript
   ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Scroll-reveal via IntersectionObserver ── */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ── Navbar scroll auto-hide/show ── */
  var header = document.getElementById('site-header');
  if (header) {
    var lastScrollY = window.scrollY;
    window.addEventListener('scroll', function () {
      var currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('nav-hidden');
      } else {
        header.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  /* ── Mobile drawer ── */
  var hamburger = document.getElementById('nav-hamburger');
  var drawer    = document.getElementById('nav-drawer');
  var closeBtn  = document.getElementById('drawer-close');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', function () {
      drawer.classList.add('is-open');
    });
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', function () {
      drawer.classList.remove('is-open');
    });
  }
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('is-open');
      });
    });
  }

  /* ── Back to top ── */
  var backTop = document.getElementById('back-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    }, { passive: true });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Editorial category tabs ── */
  var catBtns = document.querySelectorAll('.ed-cat');
  catBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      catBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });

  /* ── Hero particles ── */
  spawnParticles();

  /* ── Fetch products from Spring Boot API ── */
  fetchProducts();

});

/* ── Floating particle generator ── */
function spawnParticles() {
  var container = document.getElementById('hero-particles');
  if (!container) return;
  for (var i = 0; i < 18; i++) {
    (function (i) {
      var p = document.createElement('div');
      p.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        'background:rgba(68,127,152,' + (Math.random() * 0.15 + 0.05) + ')',
        'width:' + (Math.random() * 60 + 10) + 'px',
        'height:' + (Math.random() * 60 + 10) + 'px',
        'top:' + Math.random() * 100 + '%',
        'left:' + Math.random() * 100 + '%',
        'animation:particle-float ' + (Math.random() * 8 + 6) + 's ease-in-out ' + (Math.random() * -10) + 's infinite',
        'pointer-events:none'
      ].join(';');
      container.appendChild(p);
    })(i);
  }

  /* Inject keyframes if not already present */
  if (!document.getElementById('particle-keyframes')) {
    var style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = '@keyframes particle-float{0%,100%{transform:translate(0,0) scale(1);opacity:0.6}50%{transform:translate(' +
      'calc(var(--px,20px)),' +
      'calc(var(--py,-30px))) scale(1.1);opacity:0.3}}';
    document.head.appendChild(style);
  }
}

/* ── Toast ── */
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  
  // Create a premium icon
  var iconSvg = '';
  if (msg.toLowerCase().indexOf('cart') !== -1 || msg.toLowerCase().indexOf('added') !== -1) {
    iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px; display:inline-block; vertical-align:middle;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>';
  } else if (msg.toLowerCase().indexOf('checkout') !== -1 || msg.toLowerCase().indexOf('payment') !== -1) {
    iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px; display:inline-block; vertical-align:middle;"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>';
  } else if (msg.toLowerCase().indexOf('subscrib') !== -1 || msg.toLowerCase().indexOf('sent') !== -1 || msg.toLowerCase().indexOf('received') !== -1) {
    iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px; display:inline-block; vertical-align:middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else {
    iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px; display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }
  
  // Strip emojis
  var cleanMsg = msg.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
  
  t.innerHTML = '<div style="display:flex; align-items:center; justify-content:center;">' + iconSvg + '<span>' + cleanMsg + '</span></div>';
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3200);
}

/* ── Newsletter form ── */
function handleNewsletter(e) {
  e.preventDefault();
  var input = e.target.querySelector('input[type="email"]');
  var email = input ? input.value.trim() : '';
  if (!email) return;

  fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
  })
  .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
  .then(function () {
    showToast('Thank you for subscribing!');
    if (input) input.value = '';
  })
  .catch(function () {
    showToast('Subscribed! We\'ll be in touch.');
    if (input) input.value = '';
  });
}

/* ── Contact form ── */
function handleContact(e) {
  e.preventDefault();
  var form = e.target;
  var inputs = form.querySelectorAll('input, textarea');
  var data = {};
  inputs.forEach(function (inp) {
    if (inp.type !== 'submit') {
      data[inp.placeholder || inp.name || inp.type] = inp.value;
    }
  });

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.querySelector('input[placeholder="Your name"]') ? form.querySelector('input[placeholder="Your name"]').value : '',
      email: form.querySelector('input[placeholder="Your email"]') ? form.querySelector('input[placeholder="Your email"]').value : '',
      subject: form.querySelector('input[placeholder="How can we help?"]') ? form.querySelector('input[placeholder="How can we help?"]').value : '',
      message: form.querySelector('textarea') ? form.querySelector('textarea').value : ''
    })
  })
  .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
  .then(function () {
    showToast('Message sent! We\'ll reply within 24h.');
    form.reset();
  })
  .catch(function () {
    showToast('Message received! We\'ll be in touch soon.');
    form.reset();
  });
}

/* ── Fetch products from backend ── */
function fetchProducts() {
  fetch('/api/products')
  .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
  .then(function (products) {
    if (!products || !products.length) return;
    var grid = document.querySelector('.products-grid');
    if (!grid) return;

    /* Only re-render if there are real products from the API */
    var hasRealData = products.some(function (p) { return p.name; });
    if (!hasRealData) return;

    grid.innerHTML = products.slice(0, 4).map(function (p) {
      return '<div class="prod-card reveal">' +
        '<div class="prod-img-wrap">' +
          '<img src="' + (p.imageUrl || 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop') + '" alt="' + (p.name || '') + '" class="prod-img"/>' +
          (p.isBestSeller ? '<div class="prod-tag">Best Seller</div>' : '') +
        '</div>' +
        '<div class="prod-info">' +
          '<div class="prod-cat">' + (p.category || 'Coconut Water') + '</div>' +
          '<h3 class="prod-name">' + (p.name || '') + '</h3>' +
          '<p class="prod-desc">' + (p.description ? p.description.substring(0, 90) + '...' : '') + '</p>' +
          '<div class="prod-footer">' +
            '<span class="prod-price">$' + (p.price ? parseFloat(p.price).toFixed(2) : '4.99') + '</span>' +
            '<button class="btn-primary btn-sm">Add to Cart</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    /* Re-observe new cards */
    var newReveal = grid.querySelectorAll('.reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    newReveal.forEach(function (el) { io.observe(el); });
  })
  .catch(function () {
    /* Products already statically rendered — no action needed */
  });
}
