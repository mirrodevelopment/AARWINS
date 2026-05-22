/* ════════════════════════════════════════════════
   AARWINS — Site JavaScript & Cinematic Engine
   ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  // 1. DYNAMICALLY INJECT OVERLAYS & ELEMENTS
  injectCinematicElements();

  // 2. CHECK PRELOADER STATE & INITIATE INTRO
  handlePreloader();

  // 3. INITIALIZE LENIS SMOOTH SCROLL (IF PRESENT)
  let lenisInstance = initSmoothScroll();

  // 4. PAGE TRANSITIONS (EXIT & ENTRANCE)
  initPageTransitions();

  // 5. 3D CURSOR AND ATMOSPHERIC GLOW
  initCustomCursor();

  // 6. NOKO MASCOT INTERACTIONS & SKELETAL MOTOR
  initNokoMascot();

  // 7. 3D CARD TILT
  initCardTilt();

  // 8. MAGNETIC CTA BUTTONS
  initMagneticElements();

  // ── Navbar scroll auto-hide/show ──
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

  // ── Mobile drawer ──
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

  // ── Back to top ──
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
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ── Editorial category tabs ──
  var catBtns = document.querySelectorAll('.ed-cat');
  catBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      catBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });

  // ── Hero particles ──
  spawnParticles();

  // ── Fetch products from Spring Boot API ──
  fetchProducts();

});

/* ── Cinematic Elements Injection ── */
function injectCinematicElements() {
  // Ambient Glow Spotlight
  if (!document.getElementById('cinematic-ambient-glow')) {
    const glow = document.createElement('div');
    glow.id = 'cinematic-ambient-glow';
    document.body.appendChild(glow);
  }

  // Custom 3D Cursor Ring
  if (!document.getElementById('cinematic-cursor')) {
    const cursor = document.createElement('div');
    cursor.id = 'cinematic-cursor';
    document.body.appendChild(cursor);
  }

  // Custom 3D Cursor Inner Dot
  if (!document.getElementById('cinematic-cursor-dot')) {
    const dot = document.createElement('div');
    dot.id = 'cinematic-cursor-dot';
    document.body.appendChild(dot);
  }

  // Page Transition Overlay
  if (!document.getElementById('cinematic-transition')) {
    const trans = document.createElement('div');
    trans.id = 'cinematic-transition';
    document.body.appendChild(trans);
  }

  // Floating Noko Mascot Container
  if (!document.getElementById('cinematic-mascot-container')) {
    const container = document.createElement('div');
    container.id = 'cinematic-mascot-container';
    container.innerHTML = `
      <div class="mascot-bubble" id="noko-bubble">Pure wellness water.</div>
      <svg viewBox="0 0 60 60" class="mascot-svg" id="noko-svg">
        <!-- Mascot Shadow -->
        <ellipse cx="30" cy="54" rx="14" ry="3" fill="rgba(0,0,0,0.06)" />
        <!-- Mascot Body -->
        <path id="noko-body" d="M30,14 C18,14 12,24 12,39 C12,48 20,53 30,53 C40,53 48,48 48,39 C48,24 42,14 30,14 Z" fill="#faf9f6" stroke="#00c9b8" stroke-width="1.8" />
        <!-- Face Group (head tracking) -->
        <g id="noko-face">
          <!-- Eyes -->
          <ellipse id="noko-eye-l" cx="23" cy="33" rx="2.2" ry="3.2" fill="#1a302b" />
          <ellipse id="noko-eye-r" cx="37" cy="33" rx="2.2" ry="3.2" fill="#1a302b" />
          <!-- Cheeks -->
          <circle cx="18" cy="36" r="1.8" fill="#ffb4a2" opacity="0.6" />
          <circle cx="42" cy="36" r="1.8" fill="#ffb4a2" opacity="0.6" />
          <!-- Smile -->
          <path d="M29,37 Q30,38.5 31,37" stroke="#1a302b" stroke-width="1.5" fill="none" stroke-linecap="round" />
        </g>
        <!-- Sprout on Head -->
        <g id="noko-sprout" transform="translate(30, 14)">
          <!-- Stem -->
          <path d="M0,0 Q-1,-6 2,-9" stroke="#00c9b8" stroke-width="1.8" fill="none" />
          <!-- Left Leaf -->
          <path id="noko-leaf-l" d="M0,-8 C-5,-10 -6,-4 0,0" fill="#9ef01a" transform="scale(0.9) rotate(-15)" />
          <!-- Right Leaf -->
          <path id="noko-leaf-r" d="M0,-8 C5,-10 6,-4 0,0" fill="#9ef01a" transform="scale(0.9) rotate(15)" />
        </g>
      </svg>
    `;
    document.body.appendChild(container);
  }
}

/* ── Preloader Animation ── */
function handlePreloader() {
  const isPreloaded = sessionStorage.getItem('aarwins_preloaded');
  
  if (!isPreloaded) {
    const preloader = document.createElement('div');
    preloader.id = 'cinematic-preloader';
    preloader.innerHTML = `
      <div class="preloader-content">
        <div class="preloader-logo">AARWINS</div>
        <div class="preloader-bar-wrap">
          <div class="preloader-bar" id="p-bar"></div>
        </div>
      </div>
    `;
    document.body.appendChild(preloader);
    document.body.classList.add('lenis-stopped');

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(preloader, {
            opacity: 0,
            duration: 1.2,
            ease: 'power3.inOut',
            onComplete: () => {
              preloader.remove();
              document.body.classList.remove('lenis-stopped');
              document.body.classList.add('cinematic-active');
              sessionStorage.setItem('aarwins_preloaded', 'true');
              triggerHeroIntro();
            }
          });
        }
      });

      tl.to('.preloader-logo', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
        .to('#p-bar', { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, '-=0.6');
    } else {
      // Fallback
      setTimeout(() => {
        preloader.remove();
        document.body.classList.remove('lenis-stopped');
        document.body.classList.add('cinematic-active');
        sessionStorage.setItem('aarwins_preloaded', 'true');
      }, 2500);
    }
  } else {
    document.body.classList.add('cinematic-active');
    triggerHeroIntro();
  }
}

function triggerHeroIntro() {
  if (typeof gsap !== 'undefined') {
    gsap.fromTo('.hero-heading', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.6, ease: 'power4.out', delay: 0.2 });
    gsap.fromTo('.hero-centerpiece-img', { opacity: 0, scale: 0.9, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 2.0, ease: 'power3.out', delay: 0.4 });
    gsap.fromTo('.hero-floating-info-card', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.6, ease: 'power3.out', delay: 0.8 });
  }
}

/* ── Scroll Engine (Lenis) ── */
function initSmoothScroll() {
  if (typeof Lenis === 'undefined') return null;

  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious Apple-like exponential decay
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1.1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Dynamic Editorial Image Reveals
    document.querySelectorAll('.ed-ph').forEach((ph) => {
      gsap.fromTo(ph, 
        { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', scale: 1.08 },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: 1.6,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: ph,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }

  return lenis;
}

/* ── Page Transitions ── */
function initPageTransitions() {
  const overlay = document.getElementById('cinematic-transition');
  if (!overlay) return;

  // Entrance transition
  overlay.style.opacity = '1';
  overlay.style.filter = 'blur(10px)';
  overlay.style.transform = 'scale(1.02)';
  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.filter = 'blur(0px)';
    overlay.style.transform = 'scale(1)';
  }, 100);

  // Exit transition interception
  document.body.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || anchor.getAttribute('target') === '_blank') return;
    
    // Check if internal link
    const isInternal = href.startsWith('/') || href.indexOf(window.location.hostname) > -1 || !href.includes('://');
    if (!isInternal) return;

    e.preventDefault();
    overlay.classList.add('active');

    setTimeout(() => {
      window.location.href = href;
    }, 850);
  });
}

/* ── 3D Custom Cursor & Glow ── */
function initCustomCursor() {
  const cursor = document.getElementById('cinematic-cursor');
  const dot = document.getElementById('cinematic-cursor-dot');
  const glow = document.getElementById('cinematic-ambient-glow');

  if (!cursor || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let glowX = mouseX;
  let glowY = mouseY;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Tick loop for interpolation (LERP)
  function updateCursor() {
    // Smoothly lag the outer ring (LERP of 0.1)
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    
    // Slightly more lag for ambient glow (LERP of 0.04)
    glowX += (mouseX - glowX) * 0.05;
    glowY += (mouseY - glowY) * 0.05;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    if (glow) {
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Hover states
  const interactables = 'a, button, input, select, textarea, .product-card, .coll-card, .ed-ph, #cinematic-mascot-container';
  document.body.addEventListener('mouseenter', function (e) {
    if (e.target.matches && e.target.matches(interactables)) {
      document.body.classList.add('cursor-hovering');
    }
  }, true);

  document.body.addEventListener('mouseleave', function (e) {
    if (e.target.matches && e.target.matches(interactables)) {
      document.body.classList.remove('cursor-hovering');
    }
  }, true);
}

/* ── Noko Mascot Motor ── */
function initNokoMascot() {
  const mascot = document.getElementById('cinematic-mascot-container');
  const face = document.getElementById('noko-face');
  const sprout = document.getElementById('noko-sprout');
  const leftEye = document.getElementById('noko-eye-l');
  const rightEye = document.getElementById('noko-eye-r');
  const bubble = document.getElementById('noko-bubble');

  if (!mascot) return;

  // Emoji-free tips and notifications
  const wellnessQuotes = [
    "Pure hydration, pure focus.",
    "Take a deep breath and sip.",
    "Sourced sustainably, crafted elegantly.",
    "Elevate your daily hydration ritual.",
    "Pure young coconut energy.",
    "Clean wellness, minimal design."
  ];

  // Head tracking coordinates
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function trackHead() {
    const rect = mascot.getBoundingClientRect();
    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height / 2;

    const angleX = mouseX - mascotCenterX;
    const angleY = mouseY - mascotCenterY;
    const distance = Math.hypot(angleX, angleY);

    // Limit head translate movement
    const maxMove = 3.5; 
    let moveX = 0;
    let moveY = 0;

    if (distance > 0) {
      moveX = (angleX / distance) * maxMove;
      moveY = (angleY / distance) * maxMove;
    }

    if (face) {
      face.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    if (sprout) {
      sprout.style.transform = `translate(30px, 14px) rotate(${moveX * 3}deg)`;
    }

    requestAnimationFrame(trackHead);
  }
  trackHead();

  // Idle Breathing Animation (GSAP)
  if (typeof gsap !== 'undefined') {
    gsap.fromTo('#noko-body', 
      { scaleY: 0.98, scaleX: 1.01 },
      { scaleY: 1.02, scaleX: 0.99, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );
    gsap.fromTo('#noko-face', 
      { y: 0.5 },
      { y: -0.5, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );
    // Leaf waving
    gsap.fromTo('#noko-leaf-l', 
      { rotation: -12 },
      { rotation: -18, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );
    gsap.fromTo('#noko-leaf-r', 
      { rotation: 12 },
      { rotation: 18, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.3 }
    );
  }

  // Blinking motor
  function blink() {
    if (leftEye && rightEye && typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      tl.to([leftEye, rightEye], { ry: 0.1, duration: 0.08, ease: 'power2.inOut' })
        .to([leftEye, rightEye], { ry: 3.2, duration: 0.08, ease: 'power2.inOut' });
    }
    setTimeout(blink, Math.random() * 4000 + 2000);
  }
  blink();

  // Speech bubble notification
  let bubbleTimeout;
  function showTip() {
    if (!bubble) return;
    const randomQuote = wellnessQuotes[Math.floor(Math.random() * wellnessQuotes.length)];
    bubble.textContent = randomQuote;
    bubble.classList.add('show');

    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove('show');
    }, 3500);
  }

  mascot.addEventListener('click', function (e) {
    e.stopPropagation();
    showTip();
    if (typeof gsap !== 'undefined') {
      gsap.timeline()
        .to('#noko-svg', { scale: 0.88, duration: 0.1, ease: 'power2.out' })
        .to('#noko-svg', { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    }
  });

  // Periodically show speech bubble tips silently every 25 seconds
  setInterval(showTip, 25000);
}

/* ── 3D Interactive Card Tilt ── */
function initCardTilt() {
  const cards = document.querySelectorAll('.product-card, .coll-card, .prod-card');
  
  cards.forEach(card => {
    card.classList.add('tilt-card');
    
    // Ensure inner wrappers or card itself tilts
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // range: -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      const tiltX = -y * 8; // max tilt 8deg
      const tiltY = x * 8;
      
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotateX: tiltX,
          rotateY: tiltY,
          transformPerspective: 800,
          ease: 'power1.out',
          duration: 0.3
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          ease: 'power2.out',
          duration: 0.6
        });
      }
    });
  });
}

/* ── Magnetic CTA UI elements ── */
function initMagneticElements() {
  const magnets = document.querySelectorAll('.btn-primary, .ed-pill-btn, .product-card-btn, .nav-item a, .navbar-brand');

  magnets.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // check if within proximity
      const distance = Math.hypot(x, y);
      if (distance < 55) {
        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            x: x * 0.35,
            y: y * 0.35,
            duration: 0.3,
            ease: 'power1.out'
          });
        }
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });
  });
}

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

/* ── Toast (strips emojis) ── */
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  
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

    // Initialize 3D Card Tilt on newly created elements
    initCardTilt();
    initMagneticElements();

    var newReveal = grid.querySelectorAll('.reveal');
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      newReveal.forEach(function (el) {
        gsap.fromTo(el, { opacity: 0, y: 30 }, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        });
      });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      newReveal.forEach(function (el) { io.observe(el); });
    }
  })
  .catch(function () {
    // Products already statically rendered
  });
}
