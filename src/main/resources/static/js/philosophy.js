/* ════════════════════════════════════════════════
   AARWINS — Philosophy Page Animation Engine
   ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  
  // 1. Particle Spawning
  createPhilosophyParticles('hero-particles-container', 16);
  createPhilosophyParticles('product-scene', 12);

  // 2. Override Hero Entrance Intro (Hooked into Preloader)
  window.triggerHeroIntro = function () {
    // Reveal Label
    gsap.fromTo('.s-hero .cinematic-label', 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );

    // Reveal Split Heading with blur and stagger
    const heroHeadingSplit = new SplitType('.s-hero .anim-split-reveal-h', { types: 'chars' });
    if (heroHeadingSplit.chars) {
      gsap.fromTo(heroHeadingSplit.chars, 
        { opacity: 0, y: 60, rotate: 4, filter: 'blur(10px)' }, 
        { 
          opacity: 1, 
          y: 0, 
          rotate: 0, 
          filter: 'blur(0px)', 
          duration: 1.4, 
          ease: 'power4.out', 
          stagger: 0.02, 
          delay: 0.25 
        }
      );
    }

    // Reveal Paragraph
    gsap.fromTo('.s-hero .cinematic-paragraph-editorial', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 0.85 }
    );

    // Reveal Right Column composite assets
    gsap.fromTo('.composite-bottle-wrap', 
      { opacity: 0, scale: 0.9, y: 50 }, 
      { opacity: 1, scale: 1, y: 0, duration: 2.2, ease: 'power3.out', delay: 0.6 }
    );
    gsap.fromTo('#hero-mascot-container', 
      { opacity: 0, scale: 0.75, rotate: -15 }, 
      { opacity: 1, scale: 0.95, rotate: 0, duration: 2.0, ease: 'elastic.out(1, 0.65)', delay: 1.0 }
    );
    gsap.fromTo('.floating-ingredient', 
      { opacity: 0, scale: 0.85, y: 30 }, 
      { opacity: 1, scale: 1, y: 0, duration: 1.6, ease: 'power3.out', stagger: 0.15, delay: 1.2 }
    );
  };

  // If the preloader was already skipped/run, trigger the intro directly
  if (sessionStorage.getItem('aarwins_preloaded') === 'true') {
    setTimeout(window.triggerHeroIntro, 100);
  }

  // 3. Scroll Trigger Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    
    // --- SECTION 2: ORIGIN STORY ---
    const originHeadingSplit = new SplitType('.s-origin .anim-split-reveal-h', { types: 'chars' });
    if (originHeadingSplit.chars) {
      gsap.fromTo(originHeadingSplit.chars, 
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        {
          scrollTrigger: {
            trigger: '.s-origin',
            start: 'top 75%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.02,
          duration: 1.2,
          ease: 'power3.out'
        }
      );
    }

    gsap.fromTo('.s-origin .cinematic-paragraph-editorial', 
      { opacity: 0, y: 25 }, 
      {
        scrollTrigger: {
          trigger: '.s-origin',
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
      }
    );

    // Image mask reveal
    gsap.fromTo('.reveal-img-mask', 
      { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
      {
        scrollTrigger: {
          trigger: '.reveal-img-mask',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.8,
        ease: 'power4.inOut'
      }
    );

    // Image scroll parallax zoom
    gsap.fromTo('.still-life-img', 
      { scale: 1.18, y: -20 },
      {
        scrollTrigger: {
          trigger: '.reveal-img-mask',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        scale: 1.0,
        y: 20,
        ease: 'none'
      }
    );

    // --- SECTION 3: IMMERSIVE QUOTE ---
    const quoteHeadingSplit = new SplitType('.s-quote .anim-split-reveal-h', { types: 'chars' });
    if (quoteHeadingSplit.chars) {
      gsap.fromTo(quoteHeadingSplit.chars, 
        { opacity: 0, y: 35, scale: 0.96, filter: 'blur(8px)' },
        {
          scrollTrigger: {
            trigger: '.s-quote',
            start: 'top 70%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          stagger: 0.025,
          duration: 1.5,
          ease: 'power3.out'
        }
      );
    }

    gsap.fromTo('.quote-blur-bg', 
      { scale: 0.75, opacity: 0.2 },
      {
        scrollTrigger: {
          trigger: '.s-quote',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        scale: 1.4,
        opacity: 0.55,
        ease: 'none'
      }
    );

    // --- SECTION 4: INGREDIENTS PHILOSOPHY ---
    const ingHeadingSplit = new SplitType('.ingredients-header .anim-split-reveal-h', { types: 'chars' });
    if (ingHeadingSplit.chars) {
      gsap.fromTo(ingHeadingSplit.chars, 
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        {
          scrollTrigger: {
            trigger: '.s-ingredients',
            start: 'top 75%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.02,
          duration: 1.2,
          ease: 'power3.out'
        }
      );
    }

    gsap.fromTo('.ingredients-header .cinematic-paragraph-sub', 
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: '.s-ingredients',
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
      }
    );

    // Cards reveal stagger
    gsap.fromTo('.ingredient-card', 
      { opacity: 0, y: 40 },
      {
        scrollTrigger: {
          trigger: '.ingredients-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      }
    );

    // --- SECTION 5: CINEMATIC PRODUCT SCENE ---
    gsap.fromTo('.product-backdrop-text:not(.backdrop-right)', 
      { xPercent: -12 },
      {
        scrollTrigger: {
          trigger: '#product-scene',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        xPercent: 12,
        ease: 'none'
      }
    );

    gsap.fromTo('.backdrop-right', 
      { xPercent: 12 },
      {
        scrollTrigger: {
          trigger: '#product-scene',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        xPercent: -12,
        ease: 'none'
      }
    );

    // Slow scroll float of the showcase bottle
    gsap.fromTo('.product-showcase-can', 
      { y: -25, rotate: -2 },
      {
        scrollTrigger: {
          trigger: '#product-scene',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: 25,
        rotate: 2,
        ease: 'none'
      }
    );

    // Volumetric glow pulsing behind product
    gsap.fromTo('.product-glow', 
      { scale: 0.9, opacity: 0.6 },
      {
        scrollTrigger: {
          trigger: '#product-scene',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        scale: 1.25,
        opacity: 0.9,
        ease: 'none'
      }
    );

    // Detailed tag callouts
    gsap.fromTo('.fd-top', 
      { opacity: 0, x: -35 },
      {
        scrollTrigger: {
          trigger: '#product-scene',
          start: 'top 60%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 1.4,
        ease: 'power3.out'
      }
    );

    gsap.fromTo('.fd-bottom', 
      { opacity: 0, x: 35 },
      {
        scrollTrigger: {
          trigger: '#product-scene',
          start: 'top 60%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 1.4,
        ease: 'power3.out'
      }
    );

    // --- SECTION 6: FINAL MANIFESTO ---
    const manifestoHeadingSplit = new SplitType('.s-manifesto .anim-split-reveal-h', { types: 'chars' });
    if (manifestoHeadingSplit.chars) {
      gsap.fromTo(manifestoHeadingSplit.chars, 
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        {
          scrollTrigger: {
            trigger: '.s-manifesto',
            start: 'top 75%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.02,
          duration: 1.2,
          ease: 'power3.out'
        }
      );
    }

    gsap.fromTo('.s-manifesto .cinematic-paragraph-editorial, .manifesto-cta', 
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: '.s-manifesto',
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 0.4
      }
    );

    // Animated manifesto line width expansion
    gsap.fromTo('.manifesto-line', 
      { width: '0%' },
      {
        scrollTrigger: {
          trigger: '.manifesto-line-wrap',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        width: '100%',
        duration: 1.8,
        ease: 'power3.inOut'
      }
    );
  }

  // 4. Interactive 3D Card Tilt with local light sweep
  const cards = document.querySelectorAll('.ingredient-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;  
      
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

      const tiltX = -((y / rect.height) - 0.5) * 12; 
      const tiltY = ((x / rect.width) - 0.5) * 12;

      gsap.to(card, {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
        ease: 'power1.out',
        duration: 0.35,
        borderColor: card.getAttribute('data-glow-color') || 'rgba(255,255,255,0.15)',
        boxShadow: `0 20px 45px rgba(0,0,0,0.35), 0 0 30px ${card.getAttribute('data-glow-color') || 'rgba(255,255,255,0.05)'}`
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out',
        duration: 0.6,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
      });
    });
  });

  // 5. Interactive Mascot Engine (Hero Page right side)
  const mascotContainer = document.getElementById('hero-mascot-container');
  const mascotFace = document.getElementById('hero-noko-face');
  const mascotSprout = document.getElementById('hero-noko-sprout');
  const leftEye = document.getElementById('hero-noko-eye-l');
  const rightEye = document.getElementById('hero-noko-eye-r');

  if (mascotContainer) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function trackHeroMascot() {
      const rect = mascotContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      const maxMove = 4.5; 
      let moveX = 0;
      let moveY = 0;

      if (distance > 0) {
        moveX = (deltaX / distance) * Math.min(distance * 0.04, maxMove);
        moveY = (deltaY / distance) * Math.min(distance * 0.04, maxMove);
      }

      if (mascotFace) {
        mascotFace.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
      if (mascotSprout) {
        mascotSprout.style.transform = `translate(30px, 14px) rotate(${moveX * 3.2}deg)`;
      }

      requestAnimationFrame(trackHeroMascot);
    }
    trackHeroMascot();

    // Idle Breathing Squish/Stretch
    gsap.fromTo('#hero-noko-body', 
      { scaleY: 0.98, scaleX: 1.015 },
      { scaleY: 1.02, scaleX: 0.985, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );
    gsap.fromTo('#hero-noko-face', 
      { y: 0.5 },
      { y: -0.5, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );
    // Leaf waving
    gsap.fromTo('#hero-noko-leaf-l', 
      { rotation: -12 },
      { rotation: -18, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );
    gsap.fromTo('#hero-noko-leaf-r', 
      { rotation: 12 },
      { rotation: 18, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.3 }
    );

    // Blinking lid closure loop
    function blinkHeroMascot() {
      if (leftEye && rightEye) {
        const tl = gsap.timeline();
        tl.to([leftEye, rightEye], { ry: 0.1, duration: 0.08, ease: 'power2.inOut' })
          .to([leftEye, rightEye], { ry: 3.2, duration: 0.08, ease: 'power2.inOut' });
      }
      setTimeout(blinkHeroMascot, Math.random() * 4500 + 2000);
    }
    blinkHeroMascot();

    // Soft floating rotation on the bubble container
    gsap.fromTo('#hero-mascot-container', 
      { y: 6, rotate: -1.5 },
      { y: -8, rotate: 1.5, duration: 4.0, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );

    // Click interactive bounce
    mascotContainer.addEventListener('click', function (e) {
      e.stopPropagation();
      gsap.timeline()
        .to('#hero-noko-svg', { scale: 0.88, duration: 0.1, ease: 'power2.out' })
        .to('#hero-noko-svg', { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  }

  // 6. Scroll class toggle for header capsule morph
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 8. Account Dropdown Toggle
  const userBtn = document.getElementById('nav-user-btn');
  const accountDropdown = document.getElementById('account-dropdown');

  if (userBtn && accountDropdown) {
    userBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      accountDropdown.classList.toggle('is-open');
    });

    document.addEventListener('click', function(e) {
      if (!accountDropdown.contains(e.target) && e.target !== userBtn) {
        accountDropdown.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        accountDropdown.classList.remove('is-open');
      }
    });
  }

  // 9. Mini Cart Slide-Out Toggle
  const cartBtn = document.getElementById('nav-cart-btn');
  const cartPanel = document.getElementById('mini-cart-panel');
  const cartOverlay = document.getElementById('mini-cart-overlay');
  const cartClose = document.getElementById('mcp-close');

  if (cartBtn && cartPanel && cartOverlay && cartClose) {
    cartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      cartPanel.classList.add('is-open');
      cartOverlay.classList.add('is-open');
    });

    const closeCart = function() {
      cartPanel.classList.remove('is-open');
      cartOverlay.classList.remove('is-open');
    };

    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && cartPanel.classList.contains('is-open')) {
        closeCart();
      }
    });
  }

  // 10. Dynamic Mini-Cart Simulation
  window.updateMcpQty = function(btn, change) {
    const qtyValEl = btn.parentElement.querySelector('.mcp-item-qty-val');
    if (!qtyValEl) return;
    
    let currentQty = parseInt(qtyValEl.textContent) || 0;
    currentQty += change;
    
    if (currentQty < 1) {
      if (confirm("Remove this item from your cart?")) {
        const itemEl = btn.closest('.mcp-item');
        if (itemEl) {
          itemEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          itemEl.style.opacity = '0';
          itemEl.style.transform = 'scale(0.9)';
          setTimeout(() => {
            itemEl.remove();
            updateCartSubtotal();
            if (typeof showToast === 'function') {
              showToast("Item removed from cart");
            }
          }, 300);
        }
      }
      return;
    }
    
    qtyValEl.textContent = currentQty;
    
    const priceEl = btn.closest('.mcp-item-details').querySelector('.mcp-item-price');
    if (priceEl) {
      const itemTotal = (currentQty * 4.99).toFixed(2);
      priceEl.textContent = `$${itemTotal}`;
    }
    
    updateCartSubtotal();
    if (typeof showToast === 'function') {
      showToast(`Cart updated (Quantity: ${currentQty})`);
    }
  };

  function updateCartSubtotal() {
    const prices = document.querySelectorAll('.mcp-item-price');
    let total = 0;
    prices.forEach(priceEl => {
      const p = parseFloat(priceEl.textContent.replace('$', '')) || 0;
      total += p;
    });
    
    const subtotalEl = document.querySelector('.mcp-total-value');
    if (subtotalEl) {
      subtotalEl.textContent = `$${total.toFixed(2)}`;
    }
  }

  // 11. Hero Parallax ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to('.glow-blue-top', {
      yPercent: -40,
      scrollTrigger: {
        trigger: '#hero-scene',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('.glow-green-bottom', {
      yPercent: 30,
      scrollTrigger: {
        trigger: '#hero-scene',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('.light-ray-1', {
      yPercent: -20,
      xPercent: -10,
      scrollTrigger: {
        trigger: '#hero-scene',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('.light-ray-2', {
      yPercent: -25,
      xPercent: 10,
      scrollTrigger: {
        trigger: '#hero-scene',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('.composite-bottle-wrap', {
      yPercent: 15,
      scrollTrigger: {
        trigger: '#hero-scene',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('#hero-mascot-container', {
      yPercent: 25,
      xPercent: 5,
      scrollTrigger: {
        trigger: '#hero-scene',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('.ing-matcha', {
      yPercent: -35,
      xPercent: -5,
      scrollTrigger: {
        trigger: '#hero-scene',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('.ing-coconut', {
      yPercent: 40,
      xPercent: -15,
      scrollTrigger: {
        trigger: '#hero-scene',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('.ing-lavender', {
      yPercent: -45,
      xPercent: 10,
      scrollTrigger: {
        trigger: '#hero-scene',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // 12. Fullscreen Section Dissolve Fade & Blur Snaps
    gsap.utils.toArray('.section-fullscreen').forEach(sec => {
      if (sec.id === 'hero-scene') return;
      
      gsap.fromTo(sec, 
        { 
          opacity: 0.35, 
          filter: 'blur(12px)',
          y: 40
        },
        {
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 0.5,
            toggleActions: 'play none none reverse'
          },
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          ease: 'power2.out'
        }
      );
    });

    // 13. Cinematic Dividers Scroll Reveal
    gsap.utils.toArray('.cinematic-divider').forEach(divider => {
      gsap.fromTo(divider, 
        { width: '0%' },
        {
          scrollTrigger: {
            trigger: divider,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          width: '100%',
          duration: 1.8,
          ease: 'power3.inOut'
        }
      );
    });
  }

  // 14. Magnetic Double-Layer Parallax Button Hover Physics
  const magneticCtas = document.querySelectorAll('.manifesto-cta, .nav-shop-btn, .mcp-checkout-btn');
  magneticCtas.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      const innerText = btn.querySelector('span');
      if (innerText) {
        gsap.to(innerText, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    
    btn.addEventListener('mouseleave', function() {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
      const innerText = btn.querySelector('span');
      if (innerText) {
        gsap.to(innerText, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power3.out'
        });
      }
    });
  });

});

// 6. Volumetric Particles Generator
function createPhilosophyParticles(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('dust-particle');
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * -10}s`;
    p.style.animationDuration = `${8 + Math.random() * 8}s`;
    
    // Random sizes
    const size = Math.random() * 3 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    
    // Varying opacity
    p.style.opacity = Math.random() * 0.4 + 0.15;
    
    container.appendChild(p);
  }
}
