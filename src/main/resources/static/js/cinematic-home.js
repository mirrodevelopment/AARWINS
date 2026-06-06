/*!
 * AARWINS — Cinematic Homepage Animation Engine v2.0
 * Ultra-premium interactions: Lenis + GSAP + ScrollTrigger + SplitType Fallback
 * Inspired by plus33.in, Awwwards, luxury editorial motion
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     0. UTILITIES
  ═══════════════════════════════════════════════ */
  const qs  = (sel, ctx = document) => ctx ? ctx.querySelector(sel) : null;
  const qsa = (sel, ctx = document) => ctx ? [...ctx.querySelectorAll(sel)] : [];
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const lerp  = (a, b, t) => a + (b - a) * t;
  const isMobile = () => window.innerWidth < 768;
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════
     1. CINEMATIC LOADING SCREEN
  ═══════════════════════════════════════════════ */
  function initLoader() {
    const loader = qs('#aw-loader');
    if (!loader) return;

    // ── Skip loader on revisits within the same session ──
    const alreadySeen = sessionStorage.getItem('aw-loader-seen');
    if (alreadySeen) {
      // Hide the loader instantly and reveal page content
      gsap.set(loader, { autoAlpha: 0, pointerEvents: 'none' });
      gsap.set(['.site-header', '.hero-inner', '.hero-glow-bg'], { opacity: 1, y: 0 });
      document.body.classList.add('aw-loaded');
      return;
    }
    // Mark as seen for this session
    sessionStorage.setItem('aw-loader-seen', '1');

    // Initially hide core landing elements for soft fade-in reveal
    gsap.set(['.site-header', '.hero-inner', '.hero-glow-bg'], { opacity: 0, y: 30 });

    const tl = gsap.timeline({ onComplete: () => {
      loader.style.pointerEvents = 'none';
      document.body.classList.add('aw-loaded');
    }});

    const logoLetters = qsa('.aw-loader-letter', loader);
    const bar         = qs('.aw-loader-bar-fill', loader);
    const glow        = qs('.aw-loader-glow', loader);
    const tagline     = qs('.aw-loader-tagline', loader);

    tl
      .set(loader, { autoAlpha: 1 })
      // 1. Dark overlay (already dark CSS)
      // 2. Aarwins logo reveal (stagger letters)
      .fromTo(logoLetters, {
        y: 80, opacity: 0, scale: 1.3
      }, {
        y: 0, opacity: 1, scale: 1,
        duration: 1.1, stagger: 0.08,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }, 0.2)
      // Loader progress fill
      .fromTo(bar, { scaleX: 0 }, {
        scaleX: 1, duration: 1.6, ease: 'power3.inOut'
      }, 0.4)
      .fromTo(tagline, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out'
      }, 1.0)
      // 3. Soft glow expansion
      .to(glow, {
        opacity: 0.9, scale: 2.5,
        duration: 1.2, ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }, 1.2)
      // 4. Blur dissolve of the loader
      .to(loader, {
        opacity: 0, scale: 1.05,
        duration: 1.0, ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }, 2.0)
      // 5. Homepage fades in smoothly
      .to('.hero-glow-bg', {
        opacity: 1, duration: 1.5, ease: 'power2.out'
      }, 1.8)
      .to('.site-header', {
        y: 0, opacity: 1, duration: 1.2, ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }, 2.1)
      .to('.hero-inner', {
        y: 0, opacity: 1, duration: 1.4, ease: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }, 2.2);
  }

  /* ═══════════════════════════════════════════════
     2. LENIS SMOOTH SCROLL
  ═══════════════════════════════════════════════ */
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: isMobile() ? 1.0 : 1.45, // Butter-smooth cinematic float
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.3,
    });

    // Expose globally so aarwins.js navbar scroll handler can bind to it
    window.lenis = lenis;

    // Tie Lenis to GSAP ticker
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }

    // Tie Lenis to ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  /* ═══════════════════════════════════════════════
     3. SCROLL PROGRESS INDICATOR
  ═══════════════════════════════════════════════ */
  function initScrollProgress() {
    const bar = qs('#aw-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${progress})`;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     4. CUSTOM CINEMATIC CURSOR
  ═══════════════════════════════════════════════ */
  function initCursor() {
    if (isMobile()) return;

    const dot     = qs('#aw-cursor-dot');
    const ring    = qs('#aw-cursor-ring');
    const glow    = qs('#aw-cursor-glow');
    const tooltip = qs('#aw-cursor-tooltip');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0, gx = 0, gy = 0;
    let isHovering = false;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    // Determine hover targets
    const hoverEls = 'a, button, .coll-card, .ed-ph, .hero-centerpiece-img, .btn-primary, .nav-shop-btn, .coll-add-btn, .pd-btn, .hp-form-submit';

    document.addEventListener('mouseover', e => {
      const target = e.target.closest(hoverEls);
      if (target) {
        isHovering = true;
        dot.classList.add('is-hover');
        ring.classList.add('is-hover');

        // Check for data-detail tooltip
        const detail = target.getAttribute('data-detail');
        if (detail && tooltip) {
          tooltip.innerHTML = detail;
          tooltip.classList.add('is-active');
        }
      }
    });

    document.addEventListener('mouseout', e => {
      const target = e.target.closest(hoverEls);
      if (target) {
        isHovering = false;
        dot.classList.remove('is-hover');
        ring.classList.remove('is-hover');

        if (tooltip) {
          tooltip.classList.remove('is-active');
        }
      }
    });

    // RAF cursor loop
    function loopCursor() {
      rx = lerp(rx, mx, 0.18);
      ry = lerp(ry, my, 0.18);
      gx = lerp(gx, mx, 0.06);
      gy = lerp(gy, my, 0.06);

      dot.style.transform  = `translate(${mx - 4}px, ${my - 4}px)`;
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      if (glow) glow.style.transform = `translate(${gx - 100}px, ${gy - 100}px)`;

      requestAnimationFrame(loopCursor);
    }
    loopCursor();

    // Hide native cursor on desktop
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, input, textarea, select')
      .forEach(el => el.style.cursor = 'none');
  }

  /* ═══════════════════════════════════════════════
     5. SPLIT TEXT ANIMATION (CHARACTER BY CHARACTER)
  ═══════════════════════════════════════════════ */
  function splitAndReveal(selector, options = {}) {
    const els = qsa(selector);
    if (!els.length) return;

    els.forEach(el => {
      if (!el.dataset.split) {
        // Child parsing preserves <br> tags exactly
        const nodes = Array.from(el.childNodes);
        let newContent = '';

        nodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const words = text.split(/(\s+)/);
            
            words.forEach(w => {
              if (w.trim() === '') {
                newContent += w;
              } else {
                const chars = w.split('').map(c => `<span class="aw-char" style="display:inline-block; will-change: transform, opacity, filter;">${c}</span>`).join('');
                newContent += `<span class="aw-word" style="display:inline-block; overflow:hidden; white-space:nowrap;">${chars}</span>`;
              }
            });
          } else if (node.nodeName === 'BR') {
            newContent += '<br>';
          } else {
            newContent += node.outerHTML;
          }
        });

        el.innerHTML = newContent;
        el.dataset.split = '1';
      }

      const chars = qsa('.aw-char', el);
      gsap.set(chars, { y: '100%', opacity: 0, filter: 'blur(15px)', scale: 1.2 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => gsap.to(chars, {
          y: '0%',
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: options.duration || 1.1,
          stagger: options.stagger || 0.025,
          ease: options.ease || 'cubic-bezier(0.22, 1, 0.36, 1)',
          delay: options.delay || 0,
        })
      });
    });
  }

  /* ═══════════════════════════════════════════════
     6. HERO ANIMATIONS
  ═══════════════════════════════════════════════ */
  function initHeroAnimations() {
    const hero    = qs('.hero');
    const heading = qs('.hero-heading');
    const subtitle = qs('.hero-subtitle');
    const shopBtn = qsa('#home .btn-primary, .hero-shop-desktop, .hero-shop-mobile');
    const img     = qs('.hero-centerpiece-img');
    const glow1   = qs('.glow-radial-1');
    const glow2   = qs('.glow-radial-2');
    const reflection = qs('.hero-centerpiece-reflection');

    const pinWrapper = qs('.hero-pin-wrapper');
    const mainPath = qs('#cloth-main-path');
    const crease1  = qs('#cloth-crease-1');
    const crease2  = qs('#cloth-crease-2');
    const crease3  = qs('#cloth-crease-3');
    const crease4  = qs('#cloth-crease-4');
    const crease5  = qs('#cloth-crease-5');
    const crease6  = qs('#cloth-crease-6');
    const pullingHand = qs('#pulling-hand');
    const wrinkles = qs('.cloth-wrinkles-img', pullingHand);
    if (!hero || !pinWrapper) return;

    // ── Skip intro delays if the preloader has already been shown in this session ──
    const alreadySeen = sessionStorage.getItem('aw-loader-seen');
    const headingDelay  = alreadySeen ? 0.05 : 2.3;
    const subtitleDelay = alreadySeen ? 0.25 : 2.65;
    const shopBtnDelay  = alreadySeen ? 0.45 : 3.0;
    const imgDelay      = alreadySeen ? 0.15 : 2.5;

    // ── Hero heading character reveal
    if (heading) {
      const nodes = Array.from(heading.childNodes);
      let newContent = '';

      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const words = text.split(/(\s+)/);
          
          words.forEach(w => {
            if (w.trim() === '') {
              newContent += w;
            } else {
              const chars = w.split('').map(c => `<span class="aw-char" style="display:inline-block; will-change: transform, opacity, filter;">${c}</span>`).join('');
              newContent += `<span class="aw-word" style="display:inline-block; overflow:hidden; white-space:nowrap;">${chars}</span>`;
            }
          });
        } else if (node.nodeName === 'BR') {
          newContent += '<br>';
        } else {
          newContent += node.outerHTML;
        }
      });

      heading.innerHTML = newContent;
      const chars = qsa('.aw-char', heading);
      
      gsap.fromTo(chars, {
        y: '100%', opacity: 0, filter: 'blur(15px)', scale: 1.2
      }, {
        y: '0%', opacity: 1, filter: 'blur(0px)', scale: 1,
        duration: 1.3, stagger: alreadySeen ? 0.008 : 0.025, ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        delay: headingDelay
      });
    }

    // ── Hero subtitle reveal (top-to-bottom entrance, delayed)
    if (subtitle) {
      const isMob = isMobile();
      gsap.fromTo(subtitle, {
        y: isMob ? -20 : -40,
        opacity: 0,
        filter: isMob ? 'blur(4px)' : 'blur(8px)'
      }, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        delay: subtitleDelay
      });
    }

    // ── CTA button reveal (bottom-to-top entrance, delayed)
    gsap.fromTo(shopBtn, {
      y: isMobile() ? 40 : 140,
      opacity: 0,
      filter: isMobile() ? 'blur(4px)' : 'blur(12px)'
    }, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
      delay: shopBtnDelay
    });

    // ── Mascot/product image reveal + idle float + shadow
    if (img) {
      gsap.fromTo(img, {
        y: 80, opacity: 0, scale: 0.85, filter: 'blur(20px)'
      }, {
        y: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
        duration: 1.6, ease: 'expo.out', delay: imgDelay
      });

      // Idle floating loop
      gsap.to(img, {
        y: -20, duration: 3.8, ease: 'sine.inOut',
        yoyo: true, repeat: -1
      });

      // Subtle rotation breathing
      gsap.to(img, {
        rotationZ: 2, duration: 6, ease: 'sine.inOut',
        yoyo: true, repeat: -1
      });

      // Cast Dynamic Shadow scaling
      if (reflection) {
        gsap.to(reflection, {
          scale: 0.86, opacity: 0.45,
          duration: 3.8, ease: 'sine.inOut',
          yoyo: true, repeat: -1
        });
      }

      // Cursor parallax on hero
      if (!isMobile() && img) {
        hero.addEventListener('mousemove', e => {
          const rect = hero.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top)  / rect.height - 0.5;
          gsap.to(img, {
            x: nx * 30, y: ny * 20 - 10,
            rotationY: nx * 8, rotationX: -ny * 6,
            duration: 0.9, ease: 'power2.out', overwrite: 'auto'
          });
          if (reflection) {
            gsap.to(reflection, {
              x: nx * 20,
              duration: 0.9, ease: 'power2.out', overwrite: 'auto'
            });
          }
        });
        hero.addEventListener('mouseleave', () => {
          gsap.to(img, {
            x: 0, rotationY: 0, rotationX: 0,
            duration: 1.4, ease: 'power3.out', overwrite: 'auto'
          });
          if (reflection) {
            gsap.to(reflection, {
              x: 0,
              duration: 1.4, ease: 'power3.out', overwrite: 'auto'
            });
          }
        });
      }
    }

    // ── Atmospheric glow movement
    if (glow1 && glow2) {
      gsap.to(glow1, {
        x: 90, y: -60, scale: 1.35,
        duration: 10, ease: 'sine.inOut',
        yoyo: true, repeat: -1
      });
      gsap.to(glow2, {
        x: -70, y: 50, scale: 1.25,
        duration: 12, ease: 'sine.inOut',
        yoyo: true, repeat: -1, delay: 1.5
      });
    }

    // ── Hero pin transition (Curtain / Cloth Pulling Effect)
    let heroTrigger;
    heroTrigger = ScrollTrigger.create({
      trigger: pinWrapper,
      start: 'top top',
      end: 'bottom top',
      pin: true,
      pinSpacing: false, // This enables the next section to slide over it like a curtain/cloth
      scrub: 1.0,
      snap: {
        snapTo: (value) => {
          if (value < 0.5) {
            // Closer to the top (homepage): snap to next section (1) if scrolled down at least 10% (0.1), otherwise snap back to top (0)
            return value >= 0.1 ? 1 : 0;
          } else {
            // Closer to the bottom (showcase): snap to homepage (0) if scrolled up at least 10% (progress <= 0.9), otherwise snap to showcase (1)
            return value <= 0.9 ? 0 : 1;
          }
        },
        duration: { min: 0.5, max: 0.9 },
        delay: 0.05,
        ease: 'power2.inOut'
      },
      invalidateOnRefresh: true,
      onUpdate: self => {
        const p = self.progress;
        // Fade out and scale down the hero contents slightly as it gets covered
        const inner = qs('.hero-inner', hero);
        if (inner) {
          gsap.set(inner, {
            opacity: 1 - p * 1.5, // fully faded by 66% progress
            scale: 1 - p * 0.08,  // luxury depth scale
            y: p * -60           // slide upwards
          });
        }

        // Morph the SVG cloth curves divider based on scroll progress!
        if (mainPath) {
          const Y_ends = 160 - p * 160;
          const Y1 = 160 - p * 140; // 160 -> 20
          const Y2 = 160;
          const Y3 = 160;
          const Y4 = 160;
          const Y5 = 160 - p * 140; // 160 -> 20
          const newD = `M 0,${Y_ends} C 480,${Y1} 600,${Y2} 720,${Y3} C 840,${Y4} 960,${Y5} 1440,${Y_ends} L 1440,160 L 0,160 Z`;
          mainPath.setAttribute('d', newD);
        }

        // Morph and fade fabric crease lines fanning from center bottom peak
        const Y3 = 160;
        if (crease1) {
          const Y_mid = 160 - p * 60;   // 160 -> 100
          const Y_end = 160 - p * 130;  // 160 -> 30
          crease1.setAttribute('d', `M 720,${Y3} Q 580,${Y_mid} 400,${Y_end}`);
          crease1.style.opacity = p * 0.4;
        }
        if (crease2) {
          const Y_mid = 160 - p * 50;   // 160 -> 110
          const Y_end = 160 - p * 140;  // 160 -> 20
          crease2.setAttribute('d', `M 720,${Y3} Q 640,${Y_mid} 520,${Y_end}`);
          crease2.style.opacity = p * 0.5;
        }
        if (crease5) {
          const Y_mid = 160 - p * 45;
          const Y_end = 160 - p * 145;
          crease5.setAttribute('d', `M 720,${Y3} Q 680,${Y_mid} 600,${Y_end}`);
          crease5.style.opacity = p * 0.6;
        }
        if (crease6) {
          const Y_mid = 160 - p * 45;
          const Y_end = 160 - p * 145;
          crease6.setAttribute('d', `M 720,${Y3} Q 760,${Y_mid} 840,${Y_end}`);
          crease6.style.opacity = p * 0.6;
        }
        if (crease4) {
          const Y_mid = 160 - p * 50;   // 160 -> 110
          const Y_end = 160 - p * 140;  // 160 -> 20
          crease4.setAttribute('d', `M 720,${Y3} Q 800,${Y_mid} 920,${Y_end}`);
          crease4.style.opacity = p * 0.5;
        }
        if (crease3) {
          const Y_mid = 160 - p * 60;   // 160 -> 100
          const Y_end = 160 - p * 130;  // 160 -> 30
          crease3.setAttribute('d', `M 720,${Y3} Q 860,${Y_mid} 1040,${Y_end}`);
          crease3.style.opacity = p * 0.4;
        }

        // Pulling hand animation (appears, grabs, pulls/stretches, then releases & fades out)
        if (pullingHand) {
          if (self.direction === -1) {
            gsap.set(pullingHand, { opacity: 0 });
            if (wrinkles) gsap.set(wrinkles, { opacity: 0, scale: 0.5 });
          } else {
            if (p < 0.02) {
              gsap.set(pullingHand, { opacity: 0, y: -100, scale: 1 });
              if (wrinkles) gsap.set(wrinkles, { opacity: 0, scale: 0.5 });
            } else if (p < 0.2) {
              // Fade in and reach down to grab
              const subP = (p - 0.02) / 0.18; // 0 to 1
              gsap.set(pullingHand, {
                opacity: subP,
                y: -100 + subP * 100,
                scaleY: 1,
                scaleX: 1
              });
              if (wrinkles) gsap.set(wrinkles, { opacity: 0, scale: 0.5 });
            } else if (p < 0.85) {
              // Pulling under load (stretch)
              const pullP = (p - 0.2) / 0.65; // 0 to 1
              gsap.set(pullingHand, {
                opacity: 1,
                y: 0,
                scaleY: 1 + pullP * 0.15,
                scaleX: 1 - pullP * 0.05
              });
              // Wrinkles grow then shrink smoothly to avoid snap near completion
              if (wrinkles) {
                if (p < 0.55) {
                  const growP = (p - 0.2) / 0.35; // 0 to 1
                  gsap.set(wrinkles, {
                    opacity: growP * 0.8,
                    scale: 0.4 + growP * 0.5,
                    scaleY: 0.4 + growP * 0.6,
                    y: growP * 15
                  });
                } else {
                  const shrinkP = (p - 0.55) / 0.30; // 0 to 1
                  gsap.set(wrinkles, {
                    opacity: 0.8 * (1 - shrinkP),
                    scale: 0.9 - shrinkP * 0.5,
                    scaleY: 1.0 - shrinkP * 0.6,
                    y: 15 - shrinkP * 15
                  });
                }
              }
            } else {
              // Keep the hand fully visible and resting on the peak when the scroll finishes
              gsap.set(pullingHand, {
                opacity: 1,
                y: 0,
                scaleY: 1,
                scaleX: 1
              });
              if (wrinkles) {
                gsap.set(wrinkles, {
                  opacity: 0,
                  scale: 0.3,
                  scaleY: 0.3,
                  y: 0
                });
              }
            }
          }
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════
     7. SECTION REVEAL ANIMATIONS (Directional reveals)
  ═══════════════════════════════════════════════ */
  function initSectionReveals() {
    const isMob = isMobile();

    // 1. LEFT TO RIGHT REVEALS
    // Apply to: About text, philosophy content, section descriptions, editorial blocks
    const leftToRightSelectors = [
      '.reveal-left-to-right',
      '.ed-copy-block',
      '.aw-ingredients-left',
      '.coll-bts-copy',
      '.hp-contact-left',
      '.ed-body',
      '.aw-ingredients-text',
      '.coll-bts-text',
      '.hp-contact-desc'
    ];

    qsa(leftToRightSelectors.join(',')).forEach(el => {
      // Exclude hero sections which are loader choreographed
      if (el.closest('.hero')) return;

      gsap.fromTo(el, {
        x: isMob ? -40 : -140,
        opacity: 0,
        filter: isMob ? 'blur(6px)' : 'blur(14px)'
      }, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.3,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 2. RIGHT TO LEFT REVEALS
    // Apply to: Product cards, visual image blocks, review cards, floating glass elements
    const rightToLeftSelectors = [
      '.reveal-right-to-left',
      '.coll-card',
      '.hp-review-card',
      '.ed-ph',
      '.aw-ingredients-right',
      '.coll-bts-visual',
      '.hp-contact-right',
      '.aw-product-showcase-wrap'
    ];

    qsa(rightToLeftSelectors.join(',')).forEach((el, idx) => {
      if (el.closest('.hero')) return;

      // Stagger calculations for grid items
      const delay = (el.classList.contains('coll-card') || el.classList.contains('hp-review-card') || el.classList.contains('ed-ph'))
        ? (isMob ? 0.08 : 0.15) * (idx % 3)
        : 0;

      gsap.fromTo(el, {
        x: isMob ? 40 : 140,
        opacity: 0,
        filter: isMob ? 'blur(6px)' : 'blur(14px)'
      }, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.3,
        delay: delay,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 3. TOP TO BOTTOM REVEALS
    // Apply to: Hero titles, section headings, quote sections
    const topToBottomSelectors = [
      '.reveal-top-to-bottom',
      '.ed-h2',
      '.ed-cats-title',
      '.hp-reviews-heading',
      '.coll-top-title',
      '.hp-contact-heading',
      '.aw-quote-text',
      '.aw-product-focus-title'
    ];

    qsa(topToBottomSelectors.join(',')).forEach(el => {
      if (el.closest('.hero')) return;

      gsap.fromTo(el, {
        y: isMob ? -40 : -120,
        opacity: 0,
        scale: isMob ? 1.0 : 0.98
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.3,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 4. BOTTOM TO TOP REVEALS
    // Apply to: Buttons, flavour cards, testimonials, footer elements
    const bottomToTopSelectors = [
      '.reveal-bottom-to-top',
      '.btn-primary',
      '.ed-pill-btn',
      '.coll-add-btn',
      '.hp-form-submit',
      '.aw-scroll-divider-text',
      '.fb-brand',
      '.fb-col',
      '.fb-newsletter',
      '.hp-reviews-subtitle'
    ];

    qsa(bottomToTopSelectors.join(',')).forEach((el, idx) => {
      if (el.closest('.hero')) return;

      // Stagger elements inside footer
      const delay = el.closest('.footer-black') ? 0.12 * idx : 0;

      gsap.fromTo(el, {
        y: isMob ? 40 : 140,
        opacity: 0,
        filter: isMob ? 'blur(4px)' : 'blur(12px)'
      }, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.3,
        delay: delay,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════
     8. PARALLAX DEPTH SYSTEM (Layered Scroll Parallax)
  ═══════════════════════════════════════════════ */
  function initParallax() {
    const isMob = isMobile();

    // 1. BACKGROUND PARALLAX (Slowest ambient shift)
    qsa('.glow-radial-1, .glow-radial-2, .aw-quote-glow, .aw-product-focus-glow, .aw-ingredients-glow').forEach(el => {
      gsap.to(el, {
        yPercent: isMob ? -8 : -20,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // 2. MIDGROUND PARALLAX (Medium architectural shift)
    qsa('.coll-card, .hp-review-card, .ed-ph, .coll-img-wrap, .ed-ph--hero, .ed-ph--card').forEach((el, idx) => {
      const speed = isMob ? -10 - (idx % 2) * 4 : -35 - (idx % 3) * 15;
      gsap.to(el, {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.0
        }
      });
    });

    // 3. FOREGROUND PARALLAX (Slightly faster parallax, text/copy shifts)
    // Disabled on mobile for viewport alignment safety
    if (!isMob) {
      qsa('.aw-ingredients-left, .coll-bts-copy, .hp-contact-left, .ed-copy-block').forEach(el => {
        gsap.to(el, {
          y: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        });
      });
    }

    // 4. IMAGE ZOOM PARALLAX
    const lifeImg = qs('.coll-bts-img');
    if (lifeImg) {
      gsap.to(lifeImg, {
        scale: isMob ? 1.06 : 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: lifeImg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.3
        }
      });
    }
  }

  /* ═══════════════════════════════════════════════
     9. LUXURY CARD HOVER (3D tilt + mobile touch)
  ═══════════════════════════════════════════════ */
  function initCardHover() {
    const cards = qsa('.coll-card, .ed-ph, .aw-ingredient-card');

    if (!isMobile()) {
      // Desktop 3D Tilt and Cursor Shadow casting
      cards.forEach(card => {
        const img = qs('.coll-bottle-svg, .ed-prod-img, .hp-review-star-svg, .aw-card-img', card);

        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width  / 2;
          const cy = rect.height / 2;
          const rx = clamp((y - cy) / cy * -8, -8, 8);
          const ry = clamp((x - cx) / cx *  8, -8, 8);

          gsap.to(card, {
            rotationX: rx, rotationY: ry,
            y: -10,
            scale: 1.025,
            boxShadow: `0 ${20 + Math.abs(rx)}px ${50 + Math.abs(ry)}px rgba(68,127,152,0.18)`,
            duration: 0.45, ease: 'power2.out',
            transformPerspective: 800, transformOrigin: 'center center'
          });

          if (img) {
            gsap.to(img, {
              y: -12,
              scale: 1.05,
              rotationZ: ry * 0.4,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationX: 0, rotationY: 0,
            y: 0,
            scale: 1,
            boxShadow: '0 4px 20px rgba(68,127,152,0.06)',
            duration: 0.7, ease: 'power3.out'
          });

          if (img) {
            gsap.to(img, {
              y: 0,
              scale: 1,
              rotationZ: 0,
              duration: 0.7,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }
        });
      });
    } else {
      // Mobile touch tactile feedback scale
      cards.forEach(card => {
        card.addEventListener('touchstart', () => {
          gsap.to(card, {
            scale: 0.97,
            boxShadow: '0 8px 15px rgba(23, 49, 59, 0.08)',
            duration: 0.25,
            ease: 'power1.out'
          });
        }, { passive: true });

        card.addEventListener('touchend', () => {
          gsap.to(card, {
            scale: 1,
            boxShadow: '0 4px 12px rgba(23, 49, 59, 0.04)',
            duration: 0.35,
            ease: 'power2.out'
          });
        }, { passive: true });
      });
    }
  }

  /* ═══════════════════════════════════════════════
     10. MAGNETIC BUTTONS (glow + tactile expansion)
  ═══════════════════════════════════════════════ */
  function initMagneticButtons() {
    if (isMobile()) return;

    qsa('.btn-primary, .nav-shop-btn, .coll-add-btn, .ed-pill-btn, .hp-form-submit').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.35;
        const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.35;
        gsap.to(btn, { 
          x: dx, y: dy, 
          scale: 1.03,
          duration: 0.35, ease: 'power2.out' 
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { 
          x: 0, y: 0, 
          scale: 1,
          duration: 0.6, ease: 'elastic.out(1,0.4)' 
        });
      });
    });
  }

  /* ═══════════════════════════════════════════════
     11. NAVBAR SMART BEHAVIOUR (shrink morphing)
  ═══════════════════════════════════════════════ */
  function initNavbar() {
    const header = qs('#site-header, .site-header');
    if (!header) return;

    let lastY = 0;
    const THRESHOLD = 80;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > THRESHOLD) {
        header.classList.add('scrolled');
        if (y > lastY + 8) {
          // Hide on scroll down: translate off-screen by 100% of height
          gsap.to(header, { yPercent: -100, y: 0, duration: 0.45, ease: 'power2.out' });
        } else if (y < lastY - 8) {
          // Show on scroll up: translate back on-screen
          gsap.to(header, { yPercent: 0, y: 0, duration: 0.45, ease: 'power2.out' });
        }
      } else {
        header.classList.remove('scrolled');
        gsap.to(header, { yPercent: 0, y: 0, duration: 0.3, ease: 'power2.out' });
      }
      lastY = y;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     12. ANIMATED GRAIN OVERLAY
  ═══════════════════════════════════════════════ */
  function initGrain() {
    const grain = qs('#aw-grain');
    if (!grain) return;

    let frame = 0;
    function noiseLoop() {
      if (frame % 4 === 0) { // 15 fps update for stable CPU rendering
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        grain.style.backgroundPosition = `${x}% ${y}%`;
      }
      frame++;
      requestAnimationFrame(noiseLoop);
    }
    noiseLoop();
  }

  /* ═══════════════════════════════════════════════
     13. AMBIENT MOUSE LIGHT
  ═══════════════════════════════════════════════ */
  function initAmbientLight() {
    if (isMobile()) return;

    const light = qs('#aw-ambient-light');
    if (!light) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx, cy = ty;

    document.addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
    });

    function loopLight() {
      cx = lerp(cx, tx, 0.04); // Extremely fluid, slow-moving luxury bloom LERP
      cy = lerp(cy, ty, 0.04);
      light.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`; // Centered offset for 600px wide radial spotlight
      requestAnimationFrame(loopLight);
    }
    loopLight();
  }

  /* ═══════════════════════════════════════════════
     14. ATMOSPHERIC FLOATING PARTICLES
  ═══════════════════════════════════════════════ */
  function initParticles() {
    const container = qs('#aw-particles');
    if (!container) return;

    const COUNT = isMobile() ? 6 : 20; // Kept low for premium architectural restraint

    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'aw-particle';
      const size = Math.random() * 8 + 3; // Drifting dust orbs
      p.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: rgba(68, 127, 152, ${Math.random() * 0.05 + 0.01}); /* Ethereal, very subtle */
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
        filter: blur(${Math.random() * 3 + 1}px); /* Soft focus bloom */
      `;
      container.appendChild(p);

      // Ultra-slow expensive-feeling architectural drift
      gsap.to(p, {
        y: -(Math.random() * 180 + 80),
        x: (Math.random() - 0.5) * 60,
        opacity: 0,
        duration: Math.random() * 12 + 10, // 10s to 22s slow y-drift
        repeat: -1,
        delay: Math.random() * 6,
        ease: 'sine.inOut'
      });
    }
  }

  /* ═══════════════════════════════════════════════
     15. SECTION HORIZONTAL LINE REVEALS (draw-in)
  ═══════════════════════════════════════════════ */
  function initDividers() {
    qsa('.hp-reviews-section, .footer-black').forEach(el => {
      const line = document.createElement('div');
      line.className = 'aw-animated-divider';
      el.parentNode.insertBefore(line, el);

      gsap.fromTo(line, { scaleX: 0, opacity: 0 }, {
        scaleX: 1, opacity: 1,
        duration: 1.5, ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        scrollTrigger: { trigger: line, start: 'top 92%' }
      });
    });

    qsa('.ed-divider').forEach(el => {
      gsap.fromTo(el, { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.5, ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        scrollTrigger: { trigger: el, start: 'top 92%' }
      });
    });
  }

  /* ═══════════════════════════════════════════════
     16. BACK-TO-TOP BUTTON
  ═══════════════════════════════════════════════ */
  function initBackTop() {
    const btn = qs('#back-top');
    if (!btn) return;

    ScrollTrigger.create({
      start: 'top -40%',
      onEnter:      () => gsap.to(btn, { autoAlpha: 1, y: 0, duration: 0.4 }),
      onLeaveBack:  () => gsap.to(btn, { autoAlpha: 0, y: 20, duration: 0.4 }),
    });

    btn.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.8 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════
     17. IMAGE REVEAL MASKS (cinematic blur transition)
  ═══════════════════════════════════════════════ */
  function initImageReveals() {
    qsa('.coll-bts-img, .coll-img-wrap, .ed-hero-img, .ed-prod-img').forEach(el => {
      gsap.fromTo(el, {
        clipPath: 'inset(100% 0 0 0)',
        opacity: 0,
        filter: 'blur(20px)',
        scale: 1.12
      }, {
        clipPath: 'inset(0% 0 0 0)',
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.5, ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });
  }

  /* ═══════════════════════════════════════════════
     18. HERO SHOP BUTTON PULSE
  ═══════════════════════════════════════════════ */
  function initButtonPulse() {
    qsa('.btn-primary').forEach(btn => {
      gsap.to(btn, {
        boxShadow: 'inset 0px 15px 20px rgba(255,255,255,0.85), inset 0px -5px 15px rgba(200,50,0,0.7), 0px 20px 45px rgba(255,94,0,0.6)',
        duration: 2.0, ease: 'sine.inOut',
        yoyo: true, repeat: -1
      });
    });
  }

  /* ═══════════════════════════════════════════════
     19. TEXT SPLIT HEADINGS
  ═══════════════════════════════════════════════ */
  function initHeadingAnimations() {
    splitAndReveal('.ed-h2', { duration: 1.0, stagger: 0.025 });
    splitAndReveal('.ed-cats-title', { duration: 1.1, stagger: 0.03 });
    splitAndReveal('.hp-reviews-heading', { duration: 1.0, stagger: 0.025 });
    splitAndReveal('.hp-contact-title', { duration: 1.0, stagger: 0.02 });
    splitAndReveal('.coll-top-title', { duration: 1.1, stagger: 0.03 });
    splitAndReveal('.coll-bts-heading', { duration: 1.0, stagger: 0.025 });
  }

  /* ═══════════════════════════════════════════════
     20. BOTTLE BREATHING / MASCOT LOOP
  ═══════════════════════════════════════════════ */
  function initMascot() {
    const img = qs('.hero-centerpiece-img');
    if (!img) return;

    // Direct subtle float breathes
    gsap.to(img, {
      scale: 1.03, duration: 4.5, ease: 'sine.inOut',
      yoyo: true, repeat: -1, delay: 2.5
    });

    // Card bottle breath loops
    qsa('.coll-bottle-svg').forEach((bottle, i) => {
      gsap.to(bottle, {
        y: -10,
        duration: 3.2 + i * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });
  }

  /* ═══════════════════════════════════════════════
     21. NEW CINEMATIC SECTIONS ANIMATIONS
     ═══════════════════════════════════════════════ */
  function initSection1Quote() {
    const sec = qs('.aw-quote-section');
    const text = qs('.aw-quote-text');
    const glow = qs('.aw-quote-glow');
    if (!sec || !text) return;

    // Split lines by <br> or newline first, then split each line by space to preserve line breaks
    const lines = text.innerHTML.split(/<br\s*\/?>/i);
    text.innerHTML = lines.map(line => {
      const words = line.trim().split(/\s+/);
      return words.map(w => `<span class="aw-quote-word" style="display: inline-block; will-change: transform, opacity, filter;">${w}</span>`).join(' ');
    }).join('<br>');
    
    const qWords = qsa('.aw-quote-word', text);
    gsap.set(qWords, { opacity: 0, y: 40, filter: 'blur(20px)', scale: 1.1 });

    const videoWraps = qsa('.aw-quote-video-wrap', sec);
    if (videoWraps.length) {
      gsap.set(videoWraps, { opacity: 0, y: 35, scale: 0.95 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    if (videoWraps.length) {
      tl.to(videoWraps, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15
      }, 0);
    }

    tl.to(qWords, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      duration: 1.4,
      stagger: 0.12,
      ease: 'power3.out'
    }, videoWraps.length ? 0.3 : 0);

    // Slow scale zoom on quote during scroll
    gsap.to(text, {
      scale: 1.06,
      scrollTrigger: {
        trigger: sec,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Ambient glow movement on scroll
    if (glow) {
      gsap.to(glow, {
        y: -100,
        scale: 1.25,
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }
  }

  function initSection2Ingredients() {
    const sec = qs('.aw-ingredients-section');
    const track = qs('.aw-ingredients-scroll-track', sec);
    const cards = qsa('.aw-ingredient-card', sec);

    if (!sec || !track || !cards.length) return;

    // Split text letters reveal for left side heading
    splitAndReveal('.aw-ingredients-heading', { duration: 1.2, stagger: 0.03 });

    // Narrative paragraph fade in on trigger
    const desc = qs('.aw-ingredients-text', sec);
    if (desc) {
      gsap.fromTo(desc, { y: 30, opacity: 0, filter: 'blur(8px)' }, {
        y: 0, opacity: 1, filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: desc, start: 'top 85%' }
      });
    }

    // Set initial layout and z-indices for stacking (runs on both desktop and mobile)
    cards.forEach((card, idx) => {
      const zIndex = 10 - idx;
      
      if (idx === 0) {
        gsap.set(card, {
          zIndex: zIndex,
          opacity: 1,
          scale: 1,
          yPercent: 0
        });
      } else {
        gsap.set(card, {
          zIndex: zIndex,
          opacity: 0,
          scale: 0.9,
          yPercent: 0
        });
      }
    });

    // Dedicated entrance reveals for left/right columns on scroll trigger entry
    gsap.fromTo('.aw-ingredients-left', {
      opacity: 0,
      x: isMobile() ? 0 : -50,
      y: isMobile() ? 25 : 0,
      filter: 'blur(10px)'
    }, {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sec,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    gsap.fromTo('.aw-ingredients-right', {
      opacity: 0,
      scale: isMobile() ? 0.98 : 0.95,
      y: isMobile() ? 30 : 0,
      filter: 'blur(10px)'
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sec,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    // Create master timeline for pinning
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: () => isMobile() ? '+=2000' : '+=3500', // Pinned slightly shorter on mobile for compact swipe pacing
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    const totalSteps = cards.length - 1;
    const stepDuration = 1 / totalSteps;

    // Build card-stack animations
    for (let i = 0; i < totalSteps; i++) {
      const currentCard = cards[i];
      const nextCard = cards[i + 1];
      const currentImg = qs('.aw-card-img', currentCard);
      const nextImg = qs('.aw-card-img', nextCard);

      const startTime = i * stepDuration;
      
      // 1. Current card slides up and fades out
      masterTl.to(currentCard, {
        yPercent: -130, // slide fully up and out of viewport
        opacity: 0,
        scale: 0.95,
        duration: stepDuration * 0.8,
        ease: 'power2.inOut'
      }, startTime);

      if (currentImg) {
        masterTl.to(currentImg, {
          scale: 1.1,
          duration: stepDuration * 0.8,
          ease: 'power2.inOut'
        }, startTime);
      }

      // 2. Next card scales up and fades in
      masterTl.fromTo(nextCard, {
        opacity: 0,
        scale: 0.9,
        yPercent: 0
      }, {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        duration: stepDuration * 0.8,
        ease: 'power2.inOut'
      }, startTime + stepDuration * 0.1); // slight overlap

      if (nextImg) {
        masterTl.fromTo(nextImg, {
          scale: 1.15
        }, {
          scale: 1.0,
          duration: stepDuration * 0.8,
          ease: 'power2.inOut'
        }, startTime + stepDuration * 0.1);
      }
    }
  }

  function initSection3ProductFocus() {
    const sec = qs('.aw-product-focus-section');
    const wrap = qs('.aw-product-showcase-wrap', sec);
    const img = qs('.aw-product-showcase-img', sec);
    const reflection = qs('.aw-product-showcase-reflection', sec);
    const title = qs('.aw-product-focus-title', sec);
    const glow = qs('.aw-product-focus-glow', sec);

    if (!sec || !wrap || !img) return;

    // Split luxury title reveal
    splitAndReveal('.aw-product-focus-title', { duration: 1.3, stagger: 0.03 });

    // Piece entry animation
    gsap.fromTo(wrap, {
      y: 80, opacity: 0, scale: 0.9, filter: 'blur(15px)'
    }, {
      y: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
      duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: sec, start: 'top 75%' }
    });

    // Zoom on product showcase wrap during scroll
    gsap.to(wrap, {
      scale: 1.08,
      scrollTrigger: {
        trigger: sec,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Ambient glow drift
    if (glow) {
      gsap.to(glow, {
        x: 60,
        y: -40,
        duration: 12,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    }

    // 3D rotation and perspective drift on mouse tracking
    if (!isMobile()) {
      sec.addEventListener('mousemove', e => {
        const rect = sec.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(img, {
          rotationY: nx * 18,
          rotationX: -ny * 14,
          x: nx * 35,
          y: ny * 25,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        if (reflection) {
          gsap.to(reflection, {
            x: nx * 25,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });

      sec.addEventListener('mouseleave', () => {
        gsap.to(img, {
          rotationY: 0,
          rotationX: 0,
          x: 0,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          overwrite: 'auto'
        });
        if (reflection) {
          gsap.to(reflection, {
            x: 0,
            duration: 1.2,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    }
  }

  function initSection4Divider() {
    const sec = qs('.aw-scroll-divider-section');
    const bg = qs('.aw-scroll-divider-bg', sec);
    const line = qs('.aw-scroll-divider-line', sec);
    const text = qs('.aw-scroll-divider-text', sec);

    if (!sec || !line || !text) return;

    // 1. Slow, premium zoom-out & vertical parallax drift on the background (scrubbed on scroll)
    if (bg) {
      gsap.fromTo(bg, {
        scale: 1.18,
        yPercent: -10
      }, {
        scale: 1.0,
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.0,
          invalidateOnRefresh: true
        }
      });
    }

    // 2. Play a quick, clean animation for the line and text when the section enters view.
    // This resolves the blur and opacity quickly (0.7s) to make sure the text is instantly legible.
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top 70%', // Triggers early as section enters the viewport
        toggleActions: 'play none none reverse'
      }
    });

    contentTl.fromTo(line, {
      scaleX: 0
    }, {
      scaleX: 1.5,
      duration: 0.6,
      ease: 'power2.out'
    });

    contentTl.fromTo(text, {
      opacity: 0,
      filter: 'blur(15px)',
      y: 25,
      scale: 0.96
    }, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      scale: 1.0,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.45'); // overlap slightly for fluid entrance
  }

  function initShowcaseEntrance() {
    const sec = qs('.flavour-showcase-section');
    if (!sec) return;
    const radial = qs('.showcase-glow-radial', sec);
    const viewport = qs('.showcase-carousel-viewport', sec);
    const header = qs('.showcase-header', sec);
    const labels = qsa('.showcase-label, .showcase-title, .showcase-subtitle', header);
    const arrows = qsa('.showcase-side-arrow', sec);

    // Create entry transition timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top 85%', // Trigger as soon as the showcase enters the screen
        toggleActions: 'play none none reverse'
      }
    });

    // 1. Fade in and scale the warm background glow
    if (radial) {
      tl.fromTo(radial, {
        opacity: 0,
        scale: 0.78
      }, {
        opacity: 1,
        scale: 1.15,
        duration: 1.6,
        ease: 'power2.out'
      }, 0);
    }

    // 2. Stagger reveal the header texts (label, title, subtitle)
    if (labels.length) {
      tl.fromTo(labels, {
        y: 30,
        opacity: 0,
        filter: 'blur(10px)'
      }, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out'
      }, 0.15);
    }

    // 3. Smooth slide up and fade in for the viewport container
    if (viewport) {
      tl.fromTo(viewport, {
        y: 65,
        opacity: 0,
        filter: 'blur(12px)'
      }, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.4,
        ease: 'power3.out'
      }, 0.3);
    }

    // 4. Slide in the side navigation arrows from the sides
    if (arrows.length) {
      const prevBtn = arrows[0];
      const nextBtn = arrows[1];

      if (prevBtn) {
        tl.fromTo(prevBtn, {
          x: -25,
          opacity: 0
        }, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.75);
      }

      if (nextBtn) {
        tl.fromTo(nextBtn, {
          x: 25,
          opacity: 0
        }, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.75);
      }
    }

    // 5. Subtle scroll-linked vertical shifting of the glow orb for deep parallax feeling
    if (radial) {
      gsap.to(radial, {
        y: -120,
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }
  }

  /* ═══════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════ */
  /* ═══════════════════════════════════════════════
     WELLNESS SUBSCRIPTION RITUAL SECTION LOGIC
  ═══════════════════════════════════════════════ */
  function initSubscription() {
    const subSec = document.getElementById('wellness-subscription');
    if (!subSec) return;

    // State variables
    let currentPlanId = 'monthly';
    let currentPlanBottles = 30;
    let currentPlanPrice = 2990;
    let currentPlanBasePrice = 3300;
    let currentFrequency = '15 Days';
    let currentFlavors = new Set(['Mango']);
    let latestFlavor = 'Mango';
    let previousSavings = 310;

    // DOM selectors
    const planCards = qsa('.sub-plan-card', subSec);
    const flavorItems = qsa('.flavor-select-item', subSec);
    const freqRadios = qsa('input[name="freq-radio"]', subSec);
    const ctaBtn = document.getElementById('sub-primary-cta');

    // 1. Plan Cards Selection
    planCards.forEach(card => {
      card.addEventListener('click', () => {
        planCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        currentPlanId = card.dataset.planId;
        currentPlanBottles = parseInt(card.dataset.bottles);
        currentPlanPrice = parseInt(card.dataset.price);
        currentPlanBasePrice = parseInt(card.dataset.basePrice);

        updateTotalsAndSavings();
      });
    });

    // 2. Flavor Items Selection (Mix & Match)
    flavorItems.forEach(item => {
      item.addEventListener('click', () => {
        const flavor = item.dataset.flavor;
        const color = item.dataset.color;
        const img = item.dataset.img;

        if (currentFlavors.has(flavor)) {
          // Keep at least one flavor selected
          if (currentFlavors.size > 1) {
            currentFlavors.delete(flavor);
            item.classList.remove('selected');
          }
        } else {
          currentFlavors.add(flavor);
          item.classList.add('selected');
          latestFlavor = flavor;
          updateFloatingBottle(img, flavor, color);
        }

        updateTotalsAndSavings();
      });
    });

    // 3. Frequency Options
    freqRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          currentFrequency = radio.value;
          updateTotalsAndSavings();
        }
      });
    });

    // 4. Update Floating Bottle
    function updateFloatingBottle(imgSrc, flavorName, glowColor) {
      const img = document.getElementById('sub-floating-bottle-img');
      const lbl = document.getElementById('sub-bottle-flavor-name');
      const glow = document.getElementById('sub-glass-glow');

      if (img && imgSrc) {
        if (window.gsap) {
          gsap.timeline()
            .to(img, { scale: 0.8, opacity: 0.5, duration: 0.15, onComplete: () => {
              img.src = imgSrc;
              if (lbl) lbl.textContent = flavorName;
              if (glow) glow.style.background = `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`;
            }})
            .to(img, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.2)' });
        } else {
          img.src = imgSrc;
          if (lbl) lbl.textContent = flavorName;
          if (glow) glow.style.background = `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`;
        }
      }
    }

    // 5. Update dynamic summary totals & run savings count-up animation
    function updateTotalsAndSavings() {
      const bottlesEl = document.getElementById('summary-meta-bottles');
      const freqEl = document.getElementById('summary-meta-freq');
      const flavorsEl = document.getElementById('summary-flavors-list');
      const priceEl = document.getElementById('summary-final-price');
      const savingsEl = document.getElementById('summary-savings-val');
      const savingsCont = document.getElementById('summary-savings-container');

      if (bottlesEl) bottlesEl.textContent = `${currentPlanBottles} Bottles`;
      if (freqEl) freqEl.textContent = currentFrequency === 'Month' ? 'Every Month' : `Every ${currentFrequency}`;
      if (flavorsEl) flavorsEl.textContent = `Flavours: ${Array.from(currentFlavors).join(', ')}`;
      if (priceEl) priceEl.textContent = `₹${currentPlanPrice.toLocaleString('en-IN')}`;

      const targetSavings = currentPlanBasePrice - currentPlanPrice;

      if (targetSavings > 0) {
        if (savingsCont) savingsCont.style.display = 'flex';

        if (window.gsap) {
          const counterObj = { val: previousSavings };
          gsap.to(counterObj, {
            val: targetSavings,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: () => {
              if (savingsEl) savingsEl.textContent = `₹${Math.round(counterObj.val).toLocaleString('en-IN')}`;
            },
            onComplete: () => {
              previousSavings = targetSavings;
            }
          });
        } else {
          if (savingsEl) savingsEl.textContent = `₹${targetSavings.toLocaleString('en-IN')}`;
          previousSavings = targetSavings;
        }
      } else {
        if (savingsCont) savingsCont.style.display = 'none';
        previousSavings = 0;
      }
    }

    // 6. Checkout Integration on click CTA
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        const flavorsList = Array.from(currentFlavors).join(', ');
        
        // Build premium subscription cart item
        const subItem = {
          id: 'sub-' + Date.now(),
          name: `Aarwins Subscription: ${currentPlanId === 'monthly' ? 'Monthly Ritual' : currentPlanId === 'wellness' ? 'Wellness Pack' : 'Family Ritual'}`,
          variant: `${currentPlanBottles} Bottles • ${flavorsList} • Frequency: ${currentFrequency}`,
          price: Math.round(currentPlanPrice),
          quantity: 1,
          imageUrl: latestFlavor === 'Mango' ? '/images/tin-mago.png' :
                    latestFlavor === 'Orange' ? '/images/tin-orange.png' :
                    latestFlavor === 'Watermelon' ? '/images/tin-watermelon.png' :
                    latestFlavor === 'Lychee' ? '/images/tin-lychee.png' :
                    latestFlavor === 'Blueberry' ? '/images/tin-blueberry.png' :
                    '/images/tin-avocado.png'
        };

        // Add to cart in localStorage
        localStorage.setItem('aarwins_cart', JSON.stringify([subItem]));
        
        // Dispatch event & navigate to checkout
        window.dispatchEvent(new Event('cartUpdated'));
        window.location.href = '/checkout';
      });
    }

    // 7. Scroll trigger animations (reduced motion compatible)
    if (window.gsap && window.ScrollTrigger) {
      // Fade in left and right columns
      gsap.fromTo(qsa('.anim-sub-reveal', subSec),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subSec,
            start: 'top 75%'
          }
        }
      );

      // Levitation for floating bottle image
      const bottle = document.getElementById('sub-floating-bottle-img');
      if (bottle) {
        gsap.to(bottle, {
          y: -12,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        // Rotate bottle subtly on scroll
        gsap.to(bottle, {
          rotate: 12,
          scrollTrigger: {
            trigger: subSec,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      }

      // Social Proof count-up entrance
      const proofSec = document.querySelector('.sub-social-proof');
      if (proofSec) {
        const bottlesObj = { val: 0 };
        const bottlesValEl = document.getElementById('proof-val-bottles');
        
        gsap.timeline({
          scrollTrigger: {
            trigger: proofSec,
            start: 'top 90%',
            once: true
          }
        }).to(bottlesObj, {
          val: 10000,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            if (bottlesValEl) bottlesValEl.textContent = `${Math.round(bottlesObj.val).toLocaleString('en-IN')}+`;
          }
        });
      }
    }
  }

  function init() {
    // Wait for DOM + GSAP
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const skip = prefersReducedMotion();

    initLoader();
    initLenis();
    initScrollProgress();
    initNavbar(); // Enabled universally on all devices and views

    if (!skip) {
      initCursor();
      initGrain(); // Enabled for living atmosphere
      initAmbientLight(); // Enabled for living atmosphere
      initParticles(); // Enabled for living atmosphere
      initHeroAnimations();
      initHeadingAnimations();
      initSectionReveals();
      initParallax();
      initCardHover();
      initMagneticButtons();
      initImageReveals();
      initDividers();
      initButtonPulse();
      initMascot();
      
      // Initialize the four new cinematic sections
      initSection1Quote();
      initShowcaseEntrance(); // Seamless transition from hero to showcase
      initSection2Ingredients();
      initSection3ProductFocus();
      initSection4Divider();
    }

    initSubscription();
    initBackTop();

    // Refresh ScrollTrigger after fonts load
    document.fonts.ready.then(() => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
