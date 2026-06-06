/* ════════════════════════════════════════════════
   AARWINS — Checkout Page JavaScript
   ════════════════════════════════════════════════ */

// Initial states
let cartItems = JSON.parse(localStorage.getItem('aarwins_cart')) || [];
let activeCoupon = JSON.parse(sessionStorage.getItem('aarwins_coupon')) || null;
let savedAddresses = JSON.parse(localStorage.getItem('aarwins_addresses')) || [];

let selectedAddressId = null;
let selectedShippingId = 'standard';
let selectedPaymentMethod = 'upi';
let isUpiVerified = false;

// Pre-populate with a Coimbatore default address if none exist for demo / testing convenience
if (savedAddresses.length === 0) {
  savedAddresses = [
    {
      id: 1,
      name: "Rohan Sharma",
      phone: "9876543210",
      houseNo: "45, Alagesan Road",
      street: "Saibaba Colony",
      area: "Near Saibaba Temple",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641011",
      isDefault: true
    }
  ];
  localStorage.setItem('aarwins_addresses', JSON.stringify(savedAddresses));
}

// DOM references
document.addEventListener('DOMContentLoaded', () => {
  if (cartItems.length === 0) {
    // Redirect back if cart is empty
    alert("Your cart is empty! Redirecting back to collections.");
    window.location.href = '/collections';
    return;
  }
  
  initializeCheckout();
  handleRouting();
});

function initializeCheckout() {
  // 1. Initial renders
  renderSummaryItems();
  renderAddresses();
  loadSavedContactInfo();
  
  // 2. Setup standard listeners
  setupContactInfoAutoSave();
  setupShippingOptionListeners();
  setupPaymentMethodListeners();
  setupAddressActionListeners();
  setupStep1Continue();
  setupUpiVerification();
  setupPromoListeners();
  setupPlaceOrderCTA();
  
  // Hide UPI QR box initially
  const qrBox = document.querySelector('.upi-qr-box');
  if (qrBox) qrBox.style.display = 'none';
  
  recalculateCheckoutTotals();
}

// ── 1. Order summary items & calculations ──
function renderSummaryItems() {
  const list1 = document.getElementById('summary-items-list-1');
  const list2 = document.getElementById('summary-items-list-2');
  
  const itemsHTML = cartItems.map(item => `
    <div class="summary-item-row">
      <div class="summary-item-thumb">
        <img src="${item.imageUrl}" alt="${item.name}" style="height: 36px; width: auto; object-fit: contain;">
      </div>
      <div class="summary-item-info">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-qty-meta">${item.variant} • ${item.quantity} units</div>
      </div>
      <div class="summary-item-price-val">₹${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');
  
  if (list1) list1.innerHTML = itemsHTML;
  if (list2) list2.innerHTML = itemsHTML;
}

function recalculateCheckoutTotals() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Coupon
  let discount = 0;
  if (activeCoupon) {
    discount = subtotal * activeCoupon.rate;
    document.getElementById('summary-discount-row').style.display = 'flex';
    document.getElementById('summary-discount-label').textContent = `Discount (${activeCoupon.code})`;
    document.getElementById('summary-discount-val').textContent = `-₹${discount.toFixed(2)}`;
  } else {
    document.getElementById('summary-discount-row').style.display = 'none';
  }
  
  const subtotalAfterDiscount = subtotal - discount;
  
  // GST 18%
  const gst = subtotalAfterDiscount * 0.18;
  
  // Step 1 Shipping calculation (standard only, free over ₹999)
  const stdCost = (subtotalAfterDiscount >= 999) ? 0 : 50;
  const grandTotal1 = subtotalAfterDiscount + gst + stdCost;
  
  // Update standard shipping tier display text
  const stdCardPriceEl = document.querySelector('.delivery-option-card[data-shipping-id="standard"] .delivery-tier-price');
  if (stdCardPriceEl) {
    stdCardPriceEl.textContent = (subtotalAfterDiscount >= 999) ? 'FREE' : '₹50';
  }
  
  // Step 2 Shipping selection
  let shippingCost = 0;
  if (selectedShippingId === 'standard') {
    shippingCost = stdCost;
  } else if (selectedShippingId === 'express') {
    shippingCost = 99;
  } else if (selectedShippingId === 'priority') {
    shippingCost = 199;
  }
  
  // COD Surcharge
  let codSurcharge = 0;
  if (selectedPaymentMethod === 'cod') {
    codSurcharge = 30;
    document.getElementById('summary-cod-row').style.display = 'flex';
  } else {
    document.getElementById('summary-cod-row').style.display = 'none';
  }
  
  const grandTotal2 = subtotalAfterDiscount + gst + shippingCost + codSurcharge;
  
  // Hydrate fields (Step 1)
  const sub1 = document.getElementById('summary-subtotal-1');
  const gst1 = document.getElementById('summary-gst-1');
  const ship1 = document.getElementById('summary-shipping-1');
  const grand1 = document.getElementById('summary-grand-total-1');
  
  if (sub1) sub1.textContent = `₹${subtotal.toFixed(2)}`;
  if (gst1) gst1.textContent = `₹${gst.toFixed(2)}`;
  if (ship1) ship1.textContent = (stdCost === 0) ? 'FREE' : `₹${stdCost.toFixed(2)}`;
  if (grand1) grand1.textContent = `₹${grandTotal1.toFixed(2)}`;
  
  // Hydrate fields (Step 2)
  const sub2 = document.getElementById('summary-subtotal-2');
  const gst2 = document.getElementById('summary-gst-2');
  const ship2 = document.getElementById('summary-shipping-2');
  const grand2 = document.getElementById('summary-grand-total-2');
  
  if (sub2) sub2.textContent = `₹${subtotal.toFixed(2)}`;
  if (gst2) gst2.textContent = `₹${gst.toFixed(2)}`;
  if (ship2) ship2.textContent = (shippingCost === 0) ? 'FREE' : `₹${shippingCost.toFixed(2)}`;
  if (grand2) grand2.textContent = `₹${grandTotal2.toFixed(2)}`;
}

// ── 2. Contact details auto-saving ──
function setupContactInfoAutoSave() {
  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const emailInput = document.getElementById('cust-email');
  
  if (!nameInput || !phoneInput || !emailInput) return;
  
  function save() {
    const data = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim()
    };
    localStorage.setItem('aarwins_checkout_form', JSON.stringify(data));
  }
  
  nameInput.addEventListener('input', save);
  phoneInput.addEventListener('input', save);
  emailInput.addEventListener('input', save);
}

function loadSavedContactInfo() {
  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const emailInput = document.getElementById('cust-email');
  
  if (!nameInput || !phoneInput || !emailInput) return;
  
  const saved = JSON.parse(localStorage.getItem('aarwins_checkout_form'));
  if (saved) {
    if (saved.name) nameInput.value = saved.name;
    if (saved.phone) phoneInput.value = saved.phone;
    if (saved.email) emailInput.value = saved.email;
  }
}

// ── 3. Address CRUD state and UI ──
function renderAddresses() {
  const container = document.getElementById('address-cards-list');
  if (!container) return;
  
  if (savedAddresses.length === 0) {
    container.innerHTML = `
      <div style="font-size: 13px; color: var(--color-neutral-gray); line-height: 1.5; padding: 15px; border: 1.5px dashed rgba(23, 49, 59, 0.15); border-radius: 16px; text-align: center; margin-bottom: 15px;">
        No delivery address found. Please add a new address to proceed.
      </div>
    `;
    selectedAddressId = null;
    return;
  }
  
  // Set default selection
  if (!selectedAddressId) {
    const defaultAddr = savedAddresses.find(a => a.isDefault);
    selectedAddressId = defaultAddr ? defaultAddr.id : savedAddresses[0].id;
  }
  
  container.innerHTML = savedAddresses.map(addr => `
    <div class="address-card ${selectedAddressId === addr.id ? 'selected' : ''}" onclick="selectAddress(${addr.id})">
      <input type="radio" name="address-select-radio" class="address-radio-btn" ${selectedAddressId === addr.id ? 'checked' : ''} style="cursor: pointer;">
      <div class="address-details">
        <div class="address-tag-name">
          ${addr.name} 
          ${addr.isDefault ? `<span class="address-badge-default">Default</span>` : ''}
        </div>
        <div class="address-text-line">${addr.houseNo}, ${addr.street}</div>
        <div class="address-text-line">${addr.area ? addr.area + ', ' : ''}${addr.city}</div>
        <div class="address-text-line">${addr.state} - ${addr.pincode}</div>
        <div class="address-text-line">Phone: ${addr.phone}</div>
      </div>
      <div class="address-actions">
        <button class="address-action-btn" onclick="event.stopPropagation(); editAddress(${addr.id})">Edit</button>
        <button class="address-action-btn delete" onclick="event.stopPropagation(); deleteAddress(${addr.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function selectAddress(id) {
  selectedAddressId = id;
  renderAddresses();
}

function setupAddressActionListeners() {
  const triggerBtn = document.getElementById('address-new-trigger-btn');
  const cancelBtn = document.getElementById('address-form-cancel');
  const formContainer = document.getElementById('address-form-container');
  const crudForm = document.getElementById('address-crud-form');
  
  if (!triggerBtn || !cancelBtn || !formContainer || !crudForm) return;
  
  triggerBtn.addEventListener('click', () => {
    document.getElementById('address-form-title').textContent = "Add New Address";
    crudForm.reset();
    document.getElementById('address-id').value = "";
    formContainer.style.display = 'block';
    triggerBtn.style.display = 'none';
    formContainer.scrollIntoView({ behavior: 'smooth' });
  });
  
  cancelBtn.addEventListener('click', () => {
    formContainer.style.display = 'none';
    triggerBtn.style.display = 'flex';
  });
  
  crudForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const idVal = document.getElementById('address-id').value;
    const name = document.getElementById('addr-name').value.trim();
    const phone = document.getElementById('addr-phone').value.trim();
    const houseNo = document.getElementById('addr-house').value.trim();
    const street = document.getElementById('addr-street').value.trim();
    const area = document.getElementById('addr-area').value.trim();
    const city = document.getElementById('addr-city').value.trim();
    const state = document.getElementById('addr-state').value.trim();
    const pincode = document.getElementById('addr-pincode').value.trim();
    const isDefault = document.getElementById('addr-default').checked;
    
    // Validations
    let isValid = true;
    
    if (!name) {
      document.getElementById('fga-name').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('fga-name').classList.remove('has-error');
    }
    
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      document.getElementById('fga-phone').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('fga-phone').classList.remove('has-error');
    }
    
    if (!houseNo) {
      document.getElementById('fga-house').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('fga-house').classList.remove('has-error');
    }
    
    if (!street) {
      document.getElementById('fga-street').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('fga-street').classList.remove('has-error');
    }
    
    if (!city) {
      document.getElementById('fga-city').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('fga-city').classList.remove('has-error');
    }
    
    if (!state) {
      document.getElementById('fga-state').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('fga-state').classList.remove('has-error');
    }
    
    if (!/^[0-9]{6}$/.test(pincode)) {
      document.getElementById('fga-pincode').classList.add('has-error');
      isValid = false;
    } else {
      document.getElementById('fga-pincode').classList.remove('has-error');
    }
    
    if (!isValid) return;
    
    let id = idVal ? parseInt(idVal) : Date.now();
    
    if (isDefault) {
      savedAddresses.forEach(a => a.isDefault = false);
    }
    
    const addressObj = { id, name, phone, houseNo, street, area, city, state, pincode, isDefault };
    
    if (idVal) {
      const idx = savedAddresses.findIndex(a => a.id === id);
      if (idx !== -1) {
        savedAddresses[idx] = addressObj;
      }
    } else {
      if (savedAddresses.length === 0) {
        addressObj.isDefault = true;
      }
      savedAddresses.push(addressObj);
    }
    
    localStorage.setItem('aarwins_addresses', JSON.stringify(savedAddresses));
    
    formContainer.style.display = 'none';
    triggerBtn.style.display = 'flex';
    selectedAddressId = id;
    
    renderAddresses();
  });
}

function editAddress(id) {
  const addr = savedAddresses.find(a => a.id === id);
  if (!addr) return;
  
  document.getElementById('address-id').value = addr.id;
  document.getElementById('addr-name').value = addr.name;
  document.getElementById('addr-phone').value = addr.phone;
  document.getElementById('addr-house').value = addr.houseNo;
  document.getElementById('addr-street').value = addr.street;
  document.getElementById('addr-area').value = addr.area || "";
  document.getElementById('addr-city').value = addr.city;
  document.getElementById('addr-state').value = addr.state;
  document.getElementById('addr-pincode').value = addr.pincode;
  document.getElementById('addr-default').checked = addr.isDefault;
  
  document.getElementById('address-form-title').textContent = "Edit Address";
  document.getElementById('address-form-container').style.display = 'block';
  document.getElementById('address-new-trigger-btn').style.display = 'none';
  
  document.getElementById('address-form-container').scrollIntoView({ behavior: 'smooth' });
}

function deleteAddress(id) {
  if (confirm("Are you sure you want to delete this address?")) {
    savedAddresses = savedAddresses.filter(a => a.id !== id);
    localStorage.setItem('aarwins_addresses', JSON.stringify(savedAddresses));
    if (selectedAddressId === id) {
      selectedAddressId = null;
    }
    renderAddresses();
  }
}

// ── 4. Delivery & Payment option listeners ──
function setupShippingOptionListeners() {
  const cards = document.querySelectorAll('.delivery-option-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedShippingId = card.dataset.shippingId;
      recalculateCheckoutTotals();
    });
  });
}

function setupPaymentMethodListeners() {
  const selectors = document.querySelectorAll('.payment-selector');
  const upiPanel = document.getElementById('upi-details-panel');
  const codPanel = document.getElementById('cod-details-panel');
  
  if (!upiPanel || !codPanel) return;
  
  // Initialize panels state
  upiPanel.style.display = 'block';
  codPanel.style.display = 'none';
  
  selectors.forEach(sel => {
    sel.addEventListener('click', () => {
      if (sel.classList.contains('disabled')) return;
      
      selectors.forEach(s => s.classList.remove('selected'));
      sel.classList.add('selected');
      
      const radio = sel.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      
      selectedPaymentMethod = sel.dataset.method;
      
      if (selectedPaymentMethod === 'upi') {
        upiPanel.style.display = 'block';
        codPanel.style.display = 'none';
      } else if (selectedPaymentMethod === 'cod') {
        upiPanel.style.display = 'none';
        codPanel.style.display = 'block';
      } else {
        upiPanel.style.display = 'none';
        codPanel.style.display = 'none';
      }
      
      recalculateCheckoutTotals();
    });
  });
}

function setupUpiVerification() {
  const verifyBtn = document.getElementById('upi-verify-btn');
  const upiInput = document.getElementById('upi-id-input');
  const fgUpi = document.getElementById('fg-upi-id');
  const qrBox = document.querySelector('.upi-qr-box');
  
  if (verifyBtn && upiInput && fgUpi) {
    verifyBtn.addEventListener('click', () => {
      const upiId = upiInput.value.trim();
      
      if (upiId.length >= 4 && upiId.includes('@')) {
        fgUpi.classList.remove('has-error');
        upiInput.classList.remove('error');
        isUpiVerified = true;
        
        verifyBtn.textContent = "Verified ✓";
        verifyBtn.style.background = "var(--color-luxury-green)";
        upiInput.disabled = true;
        
        if (qrBox) {
          qrBox.style.display = 'flex';
          if (window.gsap) {
            gsap.fromTo(qrBox, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3 });
          }
        }
      } else {
        fgUpi.classList.add('has-error');
        upiInput.classList.add('error');
        isUpiVerified = false;
        verifyBtn.textContent = "Verify";
        verifyBtn.style.background = "";
        if (qrBox) qrBox.style.display = 'none';
      }
    });
    
    upiInput.addEventListener('input', () => {
      if (isUpiVerified) {
        isUpiVerified = false;
        verifyBtn.textContent = "Verify";
        verifyBtn.style.background = "";
        upiInput.disabled = false;
        if (qrBox) qrBox.style.display = 'none';
      }
    });
  }
}

// ── 5. Promo coupon management ──
function setupPromoListeners() {
  const applyBtn = document.getElementById('checkout-promo-apply-btn');
  const promoInput = document.getElementById('checkout-promo-input');
  const removeBtn = document.getElementById('checkout-promo-remove-btn');
  
  const activeWrap = document.getElementById('checkout-promo-active-wrap');
  const inputWrap = document.getElementById('checkout-promo-input-wrap');
  const activeCodeLbl = document.getElementById('checkout-active-code-lbl');
  
  function updatePromoUI() {
    if (activeCoupon) {
      if (activeCodeLbl) activeCodeLbl.textContent = activeCoupon.code;
      if (activeWrap) activeWrap.style.display = 'flex';
      if (inputWrap) inputWrap.style.display = 'none';
    } else {
      if (activeWrap) activeWrap.style.display = 'none';
      if (inputWrap) inputWrap.style.display = 'block';
    }
  }
  
  updatePromoUI();
  
  if (applyBtn && promoInput) {
    applyBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) return;
      
      const validCodes = {
        'WELCOME10': 0.10,
        'AARWINS15': 0.15
      };
      
      const rate = validCodes[code];
      const msgEl = document.getElementById('checkout-promo-message');
      
      if (rate !== undefined) {
        activeCoupon = { code: code, rate: rate };
        sessionStorage.setItem('aarwins_coupon', JSON.stringify(activeCoupon));
        
        if (msgEl) {
          msgEl.textContent = `Coupon "${code}" applied successfully!`;
          msgEl.className = 'cart-promo-msg success';
        }
        
        promoInput.value = '';
        updatePromoUI();
        recalculateCheckoutTotals();
      } else {
        if (msgEl) {
          msgEl.textContent = 'Invalid promo code.';
          msgEl.className = 'cart-promo-msg error';
        }
      }
    });
  }
  
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      activeCoupon = null;
      sessionStorage.removeItem('aarwins_coupon');
      updatePromoUI();
      recalculateCheckoutTotals();
      
      const msgEl = document.getElementById('checkout-promo-message');
      if (msgEl) {
        msgEl.textContent = '';
      }
    });
  }
}

// ── 6. Client-Side Router Navigation ──
function setupStep1Continue() {
  const btn = document.getElementById('step1-continue-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (!validateContactInfo(true)) {
        // Find first error and scroll to it
        const firstErr = document.querySelector('.form-group-val.has-error');
        if (firstErr) {
          firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      if (!selectedAddressId) {
        alert("Please select or add a delivery address.");
        return;
      }
      
      navigateToStep('/checkout/payment');
    });
  }
}

function validateContactInfo(showErrors = true) {
  const nameInput = document.getElementById('cust-name');
  const emailInput = document.getElementById('cust-email');
  const phoneInput = document.getElementById('cust-phone');
  
  let isValid = true;
  
  // Full Name validation
  if (!nameInput.value.trim()) {
    if (showErrors) {
      document.getElementById('fg-name').classList.add('has-error');
      nameInput.classList.add('error');
    }
    isValid = false;
  } else {
    document.getElementById('fg-name').classList.remove('has-error');
    nameInput.classList.remove('error');
  }
  
  // Mobile phone validation
  const phonePattern = /^[6-9][0-9]{9}$/;
  if (!phonePattern.test(phoneInput.value.trim())) {
    if (showErrors) {
      document.getElementById('fg-phone').classList.add('has-error');
      phoneInput.classList.add('error');
    }
    isValid = false;
  } else {
    document.getElementById('fg-phone').classList.remove('has-error');
    phoneInput.classList.remove('error');
  }
  
  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    if (showErrors) {
      document.getElementById('fg-email').classList.add('has-error');
      emailInput.classList.add('error');
    }
    isValid = false;
  } else {
    document.getElementById('fg-email').classList.remove('has-error');
    emailInput.classList.remove('error');
  }
  
  return isValid;
}

function navigateToStep(stepPath) {
  history.pushState(null, '', stepPath);
  handleRouting(true);
}

function handleRouting(animate = false) {
  const path = window.location.pathname;
  
  if (path === '/checkout/payment') {
    // If contact info or address is not valid, redirect back to /checkout
    if (!validateContactInfo(false) || !selectedAddressId) {
      history.replaceState(null, '', '/checkout');
      showStep(1, animate);
    } else {
      showStep(2, animate);
    }
  } else {
    // Default to /checkout
    if (path !== '/checkout') {
      history.replaceState(null, '', '/checkout');
    }
    showStep(1, animate);
  }
}

window.addEventListener('popstate', () => {
  handleRouting(true);
});

function showStep(stepNum, animate = true) {
  const step1 = document.getElementById('checkout-step-1');
  const step2 = document.getElementById('checkout-step-2');
  const successContainer = document.getElementById('success-screen-container');
  const mainCheckout = document.getElementById('checkout-main-content');
  
  // Progress steppers
  const indCart = document.getElementById('step-indicator-cart');
  const indDetails = document.getElementById('step-indicator-details');
  const indPayment = document.getElementById('step-indicator-payment');
  const indConfirmed = document.getElementById('step-indicator-confirmed');
  
  const conn1 = document.getElementById('step-connector-1');
  const conn2 = document.getElementById('step-connector-2');
  const conn3 = document.getElementById('step-connector-3');
  
  if (stepNum === 1) {
    // Configure steppers
    indCart.className = "chk-progress-step completed";
    indDetails.className = "chk-progress-step active";
    indPayment.className = "chk-progress-step";
    indConfirmed.className = "chk-progress-step";
    
    conn1.className = "chk-progress-connector active";
    conn2.className = "chk-progress-connector";
    conn3.className = "chk-progress-connector";
    
    // Show main content, hide success
    mainCheckout.style.display = 'block';
    successContainer.style.display = 'none';
    
    if (animate && window.gsap && step2.style.display !== 'none') {
      gsap.timeline()
        .to(step2, { opacity: 0, y: 20, duration: 0.25, onComplete: () => {
          step2.style.display = 'none';
          step1.style.display = 'block';
          gsap.set(step1, { opacity: 0, y: -20 });
        }})
        .to(step1, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    } else {
      step2.style.display = 'none';
      step1.style.display = 'block';
      step1.style.opacity = 1;
      step1.style.transform = 'none';
    }
  } else if (stepNum === 2) {
    // Configure steppers
    indCart.className = "chk-progress-step completed";
    indDetails.className = "chk-progress-step completed";
    indPayment.className = "chk-progress-step active";
    indConfirmed.className = "chk-progress-step";
    
    conn1.className = "chk-progress-connector active";
    conn2.className = "chk-progress-connector active";
    conn3.className = "chk-progress-connector";
    
    // Show main content, hide success
    mainCheckout.style.display = 'block';
    successContainer.style.display = 'none';
    
    if (animate && window.gsap && step1.style.display !== 'none') {
      gsap.timeline()
        .to(step1, { opacity: 0, y: -20, duration: 0.25, onComplete: () => {
          step1.style.display = 'none';
          step2.style.display = 'block';
          gsap.set(step2, { opacity: 0, y: 20 });
        }})
        .to(step2, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    } else {
      step1.style.display = 'none';
      step2.style.display = 'block';
      step2.style.opacity = 1;
      step2.style.transform = 'none';
    }
  }
}

// ── 7. Place Order Logic & Success Animation ──
function setupPlaceOrderCTA() {
  const btn = document.getElementById('checkout-cta-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      // Validate payment setup
      if (selectedPaymentMethod === 'upi' && !isUpiVerified) {
        alert("Please enter and verify your UPI ID to proceed.");
        const fgUpi = document.getElementById('fg-upi-id');
        const upiInput = document.getElementById('upi-id-input');
        if (fgUpi && upiInput) {
          fgUpi.classList.add('has-error');
          upiInput.classList.add('error');
          fgUpi.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      triggerOrderPlacementSuccess();
    });
  }
}

function triggerOrderPlacementSuccess() {
  // Generate random order ID
  const orderNum = 'AW-' + Math.floor(100000 + Math.random() * 900000);
  
  // Address info copy
  const activeAddr = savedAddresses.find(a => a.id === selectedAddressId);
  const addrText = activeAddr ? `${activeAddr.houseNo}, ${activeAddr.street}, ${activeAddr.city}, ${activeAddr.state} - ${activeAddr.pincode}` : '';
  
  // Estimated delivery calculation
  let deliveryDays = "Standard (2-4 Days)";
  if (selectedShippingId === 'express') deliveryDays = "Express (1-2 Days)";
  if (selectedShippingId === 'priority') deliveryDays = "Priority (Same Day)";
  
  // Payment description text
  const paymentType = (selectedPaymentMethod === 'upi') ? 'UPI' : 'Cash on Delivery';
  
  // Calculate final totals for confirmation details
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = activeCoupon ? subtotal * activeCoupon.rate : 0;
  const subtotalAfterDiscount = subtotal - discount;
  let shippingCost = 0;
  if (selectedShippingId === 'standard') {
    shippingCost = (subtotalAfterDiscount >= 999) ? 0 : 50;
  } else if (selectedShippingId === 'express') {
    shippingCost = 99;
  } else if (selectedShippingId === 'priority') {
    shippingCost = 199;
  }
  const codSurcharge = (selectedPaymentMethod === 'cod') ? 30 : 0;
  const gst = subtotalAfterDiscount * 0.18;
  const total = subtotalAfterDiscount + gst + shippingCost + codSurcharge;
  
  // Build dynamic success screen HTML
  const successContainer = document.getElementById('success-screen-container');
  
  // Generate product image(s) html
  let productImagesHTML = '';
  if (cartItems.length === 1) {
    productImagesHTML = `
      <img src="${cartItems[0].imageUrl}" alt="${cartItems[0].name}" class="success-product-single-img" style="height: 140px; width: auto; object-fit: contain; filter: drop-shadow(0 10px 20px rgba(23,49,59,0.12));">
    `;
  } else if (cartItems.length > 1) {
    productImagesHTML = `
      <div class="success-product-images-row" style="display: flex; justify-content: center; gap: 15px; align-items: center; padding: 10px 0;">
        ${cartItems.map((item, index) => `
          <div style="position: relative; margin-left: ${index > 0 ? '-25px' : '0'}; z-index: ${index}; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-8px) scale(1.05)'" onmouseout="this.style.transform='none'">
            <img src="${item.imageUrl}" alt="${item.name}" style="height: 110px; width: auto; object-fit: contain; filter: drop-shadow(0 8px 16px rgba(23,49,59,0.1));">
            <span style="position: absolute; bottom: 0; right: 0; background: var(--color-tropical-dark); color: #fff; font-size: 10px; font-weight: 700; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">${item.quantity}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  successContainer.innerHTML = `
    <div class="success-screen-wrapper">
      <div class="success-card" id="success-animated-card">
        <div class="success-illustration-wrap" style="height: auto; margin-bottom: 25px;">
          ${productImagesHTML}
        </div>
        
        <div class="success-icon-wrap">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h1 class="success-title">Your Aarwins order is confirmed.</h1>
        <p class="success-subtitle">Thank you for your order! We are preparing your fresh cold-pressed coconut elixirs. A receipt has been sent to your email.</p>
        
        <div class="success-meta-box">
          <div class="success-meta-row">
            <span class="success-meta-label">Order Number</span>
            <span class="success-meta-val">${orderNum}</span>
          </div>
          <div class="success-meta-row">
            <span class="success-meta-label">Customer Details</span>
            <span class="success-meta-val">${document.getElementById('cust-name').value}</span>
          </div>
          <div class="success-meta-row">
            <span class="success-meta-label">Shipping Address</span>
            <span class="success-meta-val" style="max-width: 250px; text-align: right; line-height: 1.4;">${addrText}</span>
          </div>
          <div class="success-meta-row">
            <span class="success-meta-label">Payment Method</span>
            <span class="success-meta-val">${paymentType}</span>
          </div>
          <div class="success-meta-row">
            <span class="success-meta-label">Estimated Delivery</span>
            <span class="success-meta-val">${deliveryDays}</span>
          </div>
          <div class="success-meta-row" style="border-top:1.5px solid rgba(23,49,59,0.08); padding-top:12px; margin-top:10px;">
            <span class="success-meta-label" style="font-weight:700;">Total Paid</span>
            <span class="success-meta-val" style="font-size: 16px; color: var(--color-luxury-green);">${`₹${total.toFixed(2)}`}</span>
          </div>
        </div>
        
        <div class="success-actions-wrap">
          <button class="success-btn primary" onclick="window.location.href='/'">Continue Shopping</button>
          <button class="success-btn secondary" onclick="showTrackOrderToast('${orderNum}')">Track Order</button>
        </div>
      </div>
    </div>
  `;
  
  // Clear cart and active coupon
  localStorage.removeItem('aarwins_cart');
  sessionStorage.removeItem('aarwins_coupon');
  
  // Notify navigation about cart change
  window.dispatchEvent(new Event('cartUpdated'));
  
  // Transition pages using GSAP page reveal and slide up
  const mainCheckout = document.getElementById('checkout-main-content');
  
  if (window.gsap) {
    const indCart = document.getElementById('step-indicator-cart');
    const indDetails = document.getElementById('step-indicator-details');
    const indPayment = document.getElementById('step-indicator-payment');
    const indConfirmed = document.getElementById('step-indicator-confirmed');
    
    const conn1 = document.getElementById('step-connector-1');
    const conn2 = document.getElementById('step-connector-2');
    const conn3 = document.getElementById('step-connector-3');
    
    indCart.className = "chk-progress-step completed";
    indDetails.className = "chk-progress-step completed";
    indPayment.className = "chk-progress-step completed";
    indConfirmed.className = "chk-progress-step completed";
    
    conn1.className = "chk-progress-connector active";
    conn2.className = "chk-progress-connector active";
    conn3.className = "chk-progress-connector active";
    
    gsap.to(mainCheckout, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      onComplete: () => {
        mainCheckout.style.display = 'none';
        successContainer.style.display = 'block';
        
        gsap.fromTo('#success-animated-card', 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
      }
    });
  } else {
    mainCheckout.style.display = 'none';
    successContainer.style.display = 'block';
  }
}

// Simple toast for tracking
function showTrackOrderToast(orderNum) {
  let toastEl = document.getElementById('toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast';
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = `Tracking setup for ${orderNum}. Check email updates!`;
  toastEl.classList.add('show');
  
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3000);
}
