/* ════════════════════════════════════════════════
   AARWINS — Core Cart JS Logic (Full CRUD)
   ════════════════════════════════════════════════ */

// Standard fallback catalog for offline/mock adds
const cartCatalogFallback = {
  1: { id: 1, name: "Watermelon Coconut Elixir", price: 199, imageUrl: "/images/tin-watermelon.png", variant: "330ml" },
  2: { id: 2, name: "Orange Coconut Elixir", price: 229, imageUrl: "/images/tin-orange.png", variant: "330ml" },
  3: { id: 3, name: "Blueberry Coconut Elixir", price: 249, imageUrl: "/images/tin-blueberry.png", variant: "330ml" },
  4: { id: 4, name: "Lychee Coconut Elixir", price: 229, imageUrl: "/images/tin-lychee.png", variant: "330ml" },
  5: { id: 5, name: "Avocado Coconut Elixir", price: 249, imageUrl: "/images/tin-avocado.png", variant: "330ml" },
  6: { id: 6, name: "Mango Coconut Elixir", price: 299, imageUrl: "/images/tin-mago.png", variant: "330ml" }
};

// State variables
let cart = JSON.parse(localStorage.getItem('aarwins_cart')) || [];
let activeCoupon = JSON.parse(sessionStorage.getItem('aarwins_coupon')) || null;

// ── Image Migration: replace any old bottle/splash URLs with plain tin images ──
(function migrateCartImages() {
  // Map old URL fragments → new plain tin image
  const imageMap = {
    'melonbottle':     '/images/tin-watermelon.png',
    'tin-watermelon':  '/images/tin-watermelon.png',
    'tin-splash-watermelon': '/images/tin-watermelon.png',
    'orangebottle':    '/images/tin-orange.png',
    'tin-orange':      '/images/tin-orange.png',
    'tin-splash-orange': '/images/tin-orange.png',
    'blueberrybottle': '/images/tin-blueberry.png',
    'tin-blueberry':   '/images/tin-blueberry.png',
    'tin-splash-blueberry': '/images/tin-blueberry.png',
    'lycheebottle':    '/images/tin-lychee.png',
    'tin-lychee':      '/images/tin-lychee.png',
    'tin-splash-lychee': '/images/tin-lychee.png',
    'Avacadobottle':   '/images/tin-avocado.png',
    'avacadobottle':   '/images/tin-avocado.png',
    'tin-avocado':     '/images/tin-avocado.png',
    'tin-splash-avocado': '/images/tin-avocado.png',
    'mangobottle':     '/images/tin-mago.png',
    'tin-mago':        '/images/tin-mago.png',
    'tin-splash-mango': '/images/tin-mago.png'
  };

  let changed = false;
  cart.forEach(item => {
    // For numeric product IDs, always sync with catalog fallback (most reliable)
    const numId = parseInt(item.id);
    if (!isNaN(numId) && cartCatalogFallback[numId]) {
      const correct = cartCatalogFallback[numId].imageUrl;
      if (item.imageUrl !== correct) {
        item.imageUrl = correct;
        changed = true;
      }
    } else if (item.imageUrl) {
      // For subscription/other string IDs, patch via keyword matching
      for (const [key, newUrl] of Object.entries(imageMap)) {
        if (item.imageUrl.includes(key) && item.imageUrl !== newUrl) {
          item.imageUrl = newUrl;
          changed = true;
          break;
        }
      }
    }
  });

  if (changed) {
    localStorage.setItem('aarwins_cart', JSON.stringify(cart));
  }
})();

// Initialize cart on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderCartDrawer();
  
  // Hook up promo button if present inside the cart drawer
  setupCartPromoListeners();
});

// Setup promo listener
function setupCartPromoListeners() {
  const applyBtn = document.getElementById('cart-promo-apply');
  const promoInput = document.getElementById('cart-promo-input');
  
  if (applyBtn && promoInput) {
    applyBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) return;
      
      const res = applyPromoCode(code);
      const msgEl = document.getElementById('cart-promo-message');
      if (msgEl) {
        msgEl.textContent = res.message;
        msgEl.className = 'cart-promo-msg ' + (res.success ? 'success' : 'error');
      }
      
      if (res.success) {
        promoInput.value = '';
        renderCartDrawer();
      }
    });
  }
}

// Save to LocalStorage
function saveCart() {
  localStorage.setItem('aarwins_cart', JSON.stringify(cart));
  // Trigger update event for external pages
  window.dispatchEvent(new Event('cartUpdated'));
}

// ── CRUD Operations ──

// CREATE / UPDATE
function addToCart(productId, quantity = 1) {
  const pId = parseInt(productId);
  const existingItem = cart.find(item => item.id === pId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const productInfo = cartCatalogFallback[pId];
    if (productInfo) {
      cart.push({
        id: productInfo.id,
        name: productInfo.name,
        price: productInfo.price,
        imageUrl: productInfo.imageUrl,
        variant: productInfo.variant,
        quantity: quantity
      });
    }
  }
  
  saveCart();
  renderCartDrawer();
  openCartDrawer();
  
  const name = cartCatalogFallback[pId] ? cartCatalogFallback[pId].name : 'Item';
  showToast(`${name} added to cart!`);
}

// READ (Returns current items)
function getCartItems() {
  return cart;
}

// UPDATE QUANTITY
function updateQuantity(productId, delta) {
  // Support both numeric IDs (1-6) and string IDs (subscription items like 'sub-...')
  const item = cart.find(item => String(item.id) === String(productId));
  if (item) {
    item.quantity += delta;
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    saveCart();
    renderCartDrawer();
  }
}

// DELETE
function removeFromCart(productId, elementToAnimate = null) {
  // Support both numeric IDs (1-6) and string IDs (subscription items like 'sub-...')
  const strId = String(productId);
  
  if (elementToAnimate) {
    elementToAnimate.classList.add('fade-out');
    setTimeout(() => {
      cart = cart.filter(item => String(item.id) !== strId);
      saveCart();
      renderCartDrawer();
    }, 400); // match animation duration
  } else {
    cart = cart.filter(item => String(item.id) !== strId);
    saveCart();
    renderCartDrawer();
  }
}

// Apply Coupon Code
function applyPromoCode(code) {
  const validCodes = {
    'WELCOME10': 0.10,
    'AARWINS15': 0.15
  };
  
  const discountRate = validCodes[code];
  if (discountRate !== undefined) {
    activeCoupon = { code: code, rate: discountRate };
    sessionStorage.setItem('aarwins_coupon', JSON.stringify(activeCoupon));
    return { success: true, message: `Coupon "${code}" applied successfully!` };
  } else {
    return { success: false, message: "Invalid promo code." };
  }
}

// Remove Coupon Code
function removePromoCode() {
  activeCoupon = null;
  sessionStorage.removeItem('aarwins_coupon');
  renderCartDrawer();
}

// ── Calculations ──
function calculateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Discount calculations
  let discount = 0;
  if (activeCoupon) {
    discount = subtotal * activeCoupon.rate;
  }
  
  const subtotalAfterDiscount = subtotal - discount;
  
  // GST 18% calculation
  const gst = subtotalAfterDiscount * 0.18;
  
  // Shipping (₹50, free over ₹999 subtotal before coupon or after? Let's use subtotal after discount)
  const shippingThreshold = 999;
  const shipping = (subtotalAfterDiscount >= shippingThreshold || subtotalAfterDiscount === 0) ? 0 : 50;
  
  const total = subtotalAfterDiscount + gst + shipping;
  
  return {
    subtotal: subtotal,
    discount: discount,
    subtotalAfterDiscount: subtotalAfterDiscount,
    gst: gst,
    shipping: shipping,
    total: total
  };
}

// ── UI Rendering ──

// Helper to open/close cart
function openCartDrawer() {
  const overlay = document.getElementById('mini-cart-overlay');
  const panel = document.getElementById('mini-cart-panel');
  if (overlay && panel) {
    overlay.classList.add('active', 'is-open');
    panel.classList.add('active', 'is-open');
  }
}

function closeCartDrawer() {
  const overlay = document.getElementById('mini-cart-overlay');
  const panel = document.getElementById('mini-cart-panel');
  if (overlay && panel) {
    overlay.classList.remove('active', 'is-open');
    panel.classList.remove('active', 'is-open');
  }
}

function renderCartDrawer() {
  const bodyEl = document.querySelector('.mcp-body');
  const footerEl = document.querySelector('.mcp-footer');
  const cartBadge = document.getElementById('cart-badge'); // Badge on navbar if available
  
  if (!bodyEl) return;
  
  // Total quantity count for badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
  
  // Empty State
  if (cart.length === 0) {
    bodyEl.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-illustration">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </div>
        <h4 class="cart-empty-title">Your wellness ritual starts here.</h4>
        <p class="cart-empty-desc">Discover our range of premium cold-pressed coconut elixirs.</p>
        <button class="cart-empty-btn" onclick="closeCartDrawer(); window.location.href='/collections';">Browse Collection</button>
      </div>
    `;
    if (footerEl) {
      footerEl.style.display = 'none';
    }
    return;
  }
  
  // Render Cart Items
  if (footerEl) {
    footerEl.style.display = 'block';
  }
  
  bodyEl.innerHTML = cart.map(item => {
    const idStr = String(item.id);
    const isSubscription = idStr.startsWith('sub-');
    const thumbClick = isSubscription ? '' : `onclick="window.location.href='/product/${idStr}'"`;
    const nameClick  = isSubscription ? '' : `onclick="window.location.href='/product/${idStr}'"`;
    return `
    <div class="mcp-item" id="cart-item-${idStr}">
      <div class="mcp-item-thumb" ${thumbClick} style="cursor: ${isSubscription ? 'default' : 'pointer'};">
        <img src="${item.imageUrl}" alt="${item.name}" style="height: 60px; width: auto; object-fit: contain;">
      </div>
      <div class="mcp-item-details">
        <span class="mcp-item-name" ${nameClick} style="cursor: ${isSubscription ? 'default' : 'pointer'};">${item.name}</span>
        <span class="mcp-item-meta">${item.variant}</span>
        <span class="mcp-item-price">₹${item.price}</span>
        
        <div class="mcp-item-controls">
          <div class="mcp-qty-controller">
            <button class="qty-btn" onclick="updateQuantity('${idStr}', -1)">−</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${idStr}', 1)">+</button>
          </div>
          
          <button class="mcp-item-remove-btn" onclick="removeFromCart('${idStr}', document.getElementById('cart-item-${idStr}'))" aria-label="Remove item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
  
  // Render Totals & Summary
  const totals = calculateCartTotals();

  footerEl.innerHTML = `
    <div class="mcp-summary-rows" style="margin-bottom: 25px;">
      <div class="mcp-total-row">
        <span class="mcp-total-label" style="font-size: 15px; color: var(--color-neutral-gray);">Subtotal</span>
        <span class="mcp-total-value" style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 500; color: var(--color-tropical-dark);">₹${totals.subtotal.toFixed(0)}</span>
      </div>
    </div>
    
    <button class="mcp-checkout-btn" onclick="window.location.href='/checkout'">PROCEED TO CHECKOUT</button>
  `;
}

// Simple toast notification helper if not already defined
function showToast(msg) {
  let toastEl = document.getElementById('toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast';
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3000);
}
