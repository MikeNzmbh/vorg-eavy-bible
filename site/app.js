/* ════════════════════════════════════════════
   VORG-EAVY · app.js
   State, routing, product data, interactions
   ════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────────
// PRODUCT DATA
// ──────────────────────────────────────────────
const PRODUCTS = {
  jacket: {
    id: 'jacket',
    objectNo: '001',
    name: 'The Firm Jacket',
    price: 295,
    currency: 'C$',
    collection: 'Drop 001 — The Firm',
    season: 'F-26',
    date: 'September 2026',
    city: 'Ottawa / Gatineau',
    units: 36,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: 'assets/hero_jacket.png',
    craftTitle: 'Construction Notes',
    craftBody: `The Firm Jacket is the visual authority of Drop 001. Constructed from coated cotton twill — a material chosen for its structured weight, water resistance, and matte surface tension — the jacket establishes hierarchy before a word is spoken.

The collar is the signature element: it stands without hardware, shaped entirely by internal structure. The cropped waist-length silhouette is deliberate — not abbreviated, but exact. A jacket that fits the body it chose.

All seams are topstitched at a consistent 4mm. Branding is single-mark only, placed at the interior neckline and the exterior left chest pocket facing — embossed, not printed. The shell fabric path for Drop 001 avoids true leather. That material is reserved for a later micro-capsule once demand is proven.`,
    materials: [
      'Shell: Coated cotton twill (working path) / Waxed canvas (alternative)',
      'Lining: Acetate / polyester blend, natural ecru',
      'Interfacing: Woven fusible, medium weight',
      'Hardware: Concealed press-stud closures, gunmetal finish',
      'Branding: Single interior emboss, single exterior pocket mark'
    ],
    accordion: [
      {
        title: 'Sizing & Fit',
        body: 'The Firm Jacket runs true-to-size with a structured, close fit. The cropped length sits at natural waist. If between sizes, size up for layering. Full size chart available upon request.'
      },
      {
        title: 'Care Instructions',
        body: 'Spot clean with damp cloth. Do not machine wash. Professional dry clean preferred for coated shell. Store flat or on wide-shoulder hanger. Avoid prolonged compression.'
      },
      {
        title: 'Shipping & Returns',
        body: 'Ships within 3 business days of Drop 001 launch. Ottawa/Gatineau local pickup available at pop-up. Returns accepted within 7 days of receipt, unworn, original packaging. Final sale applies to all items purchased at the pop-up.'
      },
      {
        title: 'Edition Notes',
        body: '36 units produced for Drop 001. Non-replenished. When this edition sells, it closes. A waitlist for potential future iterations of The Firm Jacket can be requested through The Firm waitlist.'
      }
    ],
    thankYouMessage: 'You chose the object that started everything. The Firm Jacket was built for people who lead before they are followed. Wear it with intention.'
  },

  top: {
    id: 'top',
    objectNo: '002',
    name: 'Structured Rib Top',
    price: 95,
    currency: 'C$',
    collection: 'Drop 001 — The Firm',
    season: 'F-26',
    date: 'September 2026',
    city: 'Ottawa / Gatineau',
    units: 84,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: 'assets/hero_top.png',
    craftTitle: 'Construction Notes',
    craftBody: `The Structured Rib Top is the lower-friction entry point into The Firm — but lower friction does not mean lower standard. This piece was built to sit with The Firm Jacket or stand without it.

The rib structure uses a tighter-gauge than standard streetwear, which gives the fabric a compressed, architectural quality. It holds its shape through wear, resisting the collapse that conventional rib knits develop after washing. The neckline is set exactly at the clavicle — high enough to read as considered, open enough to breathe.

Branding is internal-only. No external marks. The fabric does the speaking. Hemline is clean-cut with a fine overlocked edge. This piece is styled as a tee for Drop 001; a bodysuit version is under development pending fit confirmation.`,
    materials: [
      'Body: Structured rib jersey — cotton / elastane blend',
      'Neckline: Self-fabric binding, single-stitch finish',
      'Hem: Fine overlock, unfolded clean edge',
      'Branding: Interior label only — no external mark'
    ],
    accordion: [
      {
        title: 'Sizing & Fit',
        body: 'Structured Rib Top has a fitted silhouette. Runs slightly small due to rib compression. Size up for a relaxed fit. Pairs with The Firm Jacket at matched sizing.'
      },
      {
        title: 'Care Instructions',
        body: 'Machine wash cold, gentle cycle. Do not tumble dry. Lay flat to dry to maintain structure. Cool iron if needed, inside out.'
      },
      {
        title: 'Shipping & Returns',
        body: 'Ships within 3 business days of Drop 001 launch. Ottawa/Gatineau local pickup available at pop-up. Returns accepted within 7 days of receipt, unworn, original packaging.'
      },
      {
        title: 'Edition Notes',
        body: '84 units produced for Drop 001. The highest-volume piece in the drop, but still non-replenished. This specific colorway and construction will not be repeated in this form.'
      }
    ],
    thankYouMessage: 'The entry point is never the lesser object. The Structured Rib Top was built to carry the collection alone when needed. It will.'
  },

  cap: {
    id: 'cap',
    objectNo: '003',
    name: 'Signature Cap',
    price: 65,
    currency: 'C$',
    collection: 'Drop 001 — The Firm',
    season: 'F-26',
    date: 'September 2026',
    city: 'Ottawa / Gatineau',
    units: 30,
    sizes: ['One Size'],
    img: 'assets/hero_cap.png',
    craftTitle: 'Construction Notes',
    craftBody: `The Signature Cap is the accessible proof of belonging. Thirty units. The smallest production run in Drop 001, and the clearest signal you can give without speaking.

The cap is structured — not a dad cap, not a trucker, not a snapback in the conventional sense. The crown carries enough rigidity to hold its form on the shelf and on the head. The brim is pre-curved with a single break point, set by hand during production.

The VORG-EAVY mark appears once: woven on the front panel, tonal or near-tonal against the shell fabric. The strap closure is adjustable with a hidden fabric-covered buckle at the rear — no exposed metal logos on the hardware.

Thirty caps. When they are gone, this particular version of the mark does not return.`,
    materials: [
      'Shell: Structured cotton twill, mid-weight',
      'Sweatband: Cotton terry, natural — no synthetic wicking',
      'Closure: Fabric-covered adjustable buckle, tonal',
      'Branding: Single woven mark, front panel — tonal'
    ],
    accordion: [
      {
        title: 'Sizing & Fit',
        body: 'One size with adjustable rear closure. Fits head circumference 54–60cm. Structured crown holds shape. Brim pre-curved — do not reshape.'
      },
      {
        title: 'Care Instructions',
        body: 'Hand wash only. Cold water, mild soap. Do not machine wash or tumble dry. Reshape crown while damp and air dry on a rounded surface.'
      },
      {
        title: 'Shipping & Returns',
        body: 'Ships within 3 business days of Drop 001 launch. Ottawa/Gatineau local pickup available. Returns accepted within 7 days, unworn, original packaging. Caps showing wear marks are final sale.'
      },
      {
        title: 'Edition Notes',
        body: '30 units produced for Drop 001. The most limited object in the drop. Non-replenished. This exact construction and mark placement will not be repeated.'
      }
    ],
    thankYouMessage: 'Thirty caps. You are holding one of them. The mark you wear was placed by hand. Proof of belonging, before belonging was loud.'
  }
};

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
let cart = [];
let currentProduct = null;
let selectedSize = null;


// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  document.body.dataset.view = 'home';


  // Scroll-based nav
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  // Hero image load animation
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
    if (heroImg.complete) heroImg.classList.add('loaded');
  }

  // Intersection observer for animate-in elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.product-card, .atelier-card, .about-section, .story-prologue-main, .story-ticket').forEach(el => {
    observer.observe(el);
  });

  updateCart();
});



// ──────────────────────────────────────────────
// VIEW ROUTING
// ──────────────────────────────────────────────
function showView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(`view-${viewName}`);
  if (target) {
    target.classList.add('active');
    document.body.dataset.view = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ──────────────────────────────────────────────
// PRODUCT DETAIL
// ──────────────────────────────────────────────
function showProduct(productId) {
  const p = PRODUCTS[productId];
  if (!p) return;
  currentProduct = p;
  selectedSize = p.sizes.length === 1 ? p.sizes[0] : null;

  const unitsLeft = p.units;
  const materialsHTML = p.materials.map(m => `<li>${m}</li>`).join('');
  const sizesHTML = p.sizes.map(s =>
    `<button class="pd-size-btn${s === selectedSize ? ' active' : ''}" onclick="selectSize('${s}', this)">${s}</button>`
  ).join('');
  const accordionHTML = p.accordion.map((item, i) => `
    <div class="pd-accordion-item" id="acc-${i}">
      <button class="pd-accordion-header" onclick="toggleAccordion('acc-${i}')">
        <span>${item.title}</span>
        <span class="pd-accordion-icon">+</span>
      </button>
      <div class="pd-accordion-body">${item.body}</div>
    </div>
  `).join('');

  document.getElementById('product-detail-content').innerHTML = `
    <div class="product-detail">
      <div class="pd-gallery">
        <img src="${p.img}" alt="${p.name}" />
      </div>
      <div class="pd-info">

        <!-- TIMESTAMP — like a thank you card stamp -->
        <div class="pd-timestamp animate-in">
          <div class="pd-ts-row">
            <span class="pd-ts-label">Collection</span>
            <span class="pd-ts-value">${p.collection}</span>
          </div>
          <div class="pd-ts-row">
            <span class="pd-ts-label">Season</span>
            <span class="pd-ts-value">${p.season}</span>
          </div>
          <div class="pd-ts-row">
            <span class="pd-ts-label">Date</span>
            <span class="pd-ts-value">${p.date}</span>
          </div>
          <div class="pd-ts-row">
            <span class="pd-ts-label">City</span>
            <span class="pd-ts-value">${p.city}</span>
          </div>
        </div>

        <h1 class="pd-name animate-in animate-delay-1">${p.name}</h1>
        <div class="pd-object-no animate-in animate-delay-1">Object №${p.objectNo} of Drop 001</div>
        <div class="pd-price animate-in animate-delay-2">${p.currency}${p.price}</div>
        <div class="pd-units-left animate-in animate-delay-2">${unitsLeft} units remaining · Non-replenished</div>

        <!-- SIZE -->
        <div class="pd-size-section animate-in animate-delay-3">
          <div class="pd-size-label">Select Size</div>
          <div class="pd-sizes">${sizesHTML}</div>
        </div>

        <!-- ADD TO CART -->
        <div class="pd-add-to-cart animate-in animate-delay-3">
          <button class="btn-primary" onclick="addToCart('${p.id}')">Add to Selection</button>
        </div>

        <!-- THANK YOU CARD TRIGGER -->
        <button class="pd-thankyou-trigger animate-in animate-delay-4" onclick="openThankyou('${p.id}')">
          <span>✦</span>
          Preview your Thank You card
        </button>

        <!-- CRAFT NOTES -->
        <div class="pd-craft-section animate-in animate-delay-4">
          <div class="pd-craft-title">${p.craftTitle}</div>
          <div class="pd-craft-body">${p.craftBody.replace(/\n\n/g, '</p><p class="pd-craft-body">').replace(/\n/g, '<br/>')}</div>
          <ul class="pd-material-list">
            ${materialsHTML}
          </ul>
        </div>

        <!-- ACCORDION -->
        <div class="pd-accordion">${accordionHTML}</div>

      </div>
    </div>
  `;

  showView('product');
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleAccordion(id) {
  const item = document.getElementById(id);
  item.classList.toggle('open');
}

// ──────────────────────────────────────────────
// CART
// ──────────────────────────────────────────────
function addToCart(productId) {
  const p = PRODUCTS[productId];
  if (!p) return;

  if (!selectedSize) {
    const sizeSection = document.querySelector('.pd-size-section');
    sizeSection.style.outline = '1px solid var(--orange)';
    sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { sizeSection.style.outline = ''; }, 2000);
    return;
  }

  const existing = cart.find(i => i.id === productId && i.size === selectedSize);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, size: selectedSize, qty: 1, product: p });
  }

  updateCart();
  toggleCart(true);

  // Bump count animation
  const countEl = document.getElementById('cart-count');
  countEl.classList.add('bump');
  setTimeout(() => countEl.classList.remove('bump'), 300);
}

function removeFromCart(productId, size) {
  cart = cart.filter(i => !(i.id === productId && i.size === size));
  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cart-count').textContent = count;

  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  const emptyEl = document.getElementById('cart-empty');
  const totalEl = document.getElementById('cart-total');

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    footerEl.style.display = 'none';
    emptyEl.classList.add('active');
  } else {
    emptyEl.classList.remove('active');
    footerEl.style.display = 'block';

    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.product.img}" alt="${item.product.name}" />
        <div>
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-size">Size: ${item.size} · Qty: ${item.qty}</div>
          <div class="cart-item-price">${item.product.currency}${item.product.price * item.qty}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}', '${item.size}')">✕</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    totalEl.innerHTML = `<span>Total</span><span>C$${total}</span>`;
  }
}

function toggleCart(forceOpen) {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  const isOpen = sidebar.classList.contains('open');

  if (forceOpen === true || (!isOpen && forceOpen !== false)) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function checkout() {
  alert('Checkout coming soon. This is a prototype of the Drop 001 storefront.');
}

// ──────────────────────────────────────────────
// WAITLIST MODAL
// ──────────────────────────────────────────────
function openWaitlist(e) {
  if (e) e.preventDefault();
  document.getElementById('waitlist-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeWaitlist() {
  document.getElementById('waitlist-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function submitWaitlist(e) {
  e.preventDefault();
  const form = e.target;
  form.style.display = 'none';
  document.getElementById('waitlist-confirm').classList.add('active');
}

// Close waitlist on overlay click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('waitlist-modal');
  if (e.target === modal) closeWaitlist();
});

// ──────────────────────────────────────────────
// THANK YOU CARD
// ──────────────────────────────────────────────
function openThankyou(productId) {
  const p = PRODUCTS[productId || (currentProduct && currentProduct.id)];
  if (!p) return;

  const now = new Date();
  const orderRef = `VE-001-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  document.getElementById('thankyou-card-content').innerHTML = `
    <div class="tc-brand"><img src="assets/logo_black.png" alt="VORG-EAVY" class="logo-img logo-card" /></div>
    <div class="tc-tagline">A Home for Originals.</div>
    <div class="tc-divider"></div>

    <div class="tc-title">Thank You</div>
    <div class="tc-message">${p.thankYouMessage}</div>

    <div class="tc-stamp-block">
      <div class="tc-stamp-item">
        <div class="tc-stamp-label">Object</div>
        <div class="tc-stamp-value">${p.name}</div>
      </div>
      <div class="tc-stamp-item">
        <div class="tc-stamp-label">№</div>
        <div class="tc-stamp-value">Object №${p.objectNo}</div>
      </div>
      <div class="tc-stamp-item">
        <div class="tc-stamp-label">Collection</div>
        <div class="tc-stamp-value">${p.collection}</div>
      </div>
      <div class="tc-stamp-item">
        <div class="tc-stamp-label">Season</div>
        <div class="tc-stamp-value">${p.season}</div>
      </div>
      <div class="tc-stamp-item">
        <div class="tc-stamp-label">Date</div>
        <div class="tc-stamp-value">${p.date}</div>
      </div>
      <div class="tc-stamp-item">
        <div class="tc-stamp-label">City</div>
        <div class="tc-stamp-value">${p.city}</div>
      </div>
      <div class="tc-object-id">
        <span class="tc-orange-mark"></span>
        ${orderRef} · The Firm · Drop 001
      </div>
    </div>
  `;

  document.getElementById('thankyou-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeThankyou() {
  document.getElementById('thankyou-modal').classList.remove('active');
  document.body.style.overflow = '';
}

// Close thank you on overlay click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('thankyou-modal');
  if (e.target === modal) closeThankyou();
});

// ──────────────────────────────────────────────
// KEYBOARD
// ──────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeWaitlist();
    closeThankyou();
    if (document.getElementById('cart-sidebar').classList.contains('open')) toggleCart(false);
  }
});
