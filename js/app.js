/**
 * Spice Street — Application Logic (Checkpoint 2B + 2C)
 * Pure Vanilla JavaScript ES6+
 * Handles bilingual state, dietary filtering, search, category navigation,
 * shopping cart with localStorage persistence, and WhatsApp order generation.
 */

(function () {
  "use strict";

  // Check that menu data is loaded
  const data = window.MENU_DATA || {};
  const { RESTAURANT_INFO, RESTAURANT_CONFIG, CATEGORIES, MENU_ITEMS, UI_STRINGS } = data;

  if (!MENU_ITEMS || !CATEGORIES) {
    console.error("Menu data not found. Ensure js/menu-data.js is loaded prior to app.js.");
    return;
  }

  // Configuration Constants
  const CONFIG = RESTAURANT_CONFIG || {
    whatsappNumber: "919876543210",
    whatsappNumberFormatted: "+91 98765 43210",
    currencySymbol: "₹",
    cartStorageKey: "spice_street_cart_v1"
  };

  // Application State
  const state = {
    lang: "en",                // 'en' | 'hi'
    selectedCategory: "all",   // 'all' | category.id
    dietaryFilter: "all",      // 'all' | 'veg' | 'non-veg'
    searchQuery: "",           // string
    cart: {},                  // { [itemId]: quantity (integer >= 1) }
    orderNote: ""              // table / cooking instruction note
  };

  // DOM Elements Cache
  const DOM = {
    html: document.documentElement,
    restaurantName: document.getElementById("restaurant-name"),
    restaurantTagline: document.getElementById("restaurant-tagline"),
    restaurantAddress: document.getElementById("restaurant-address"),
    restaurantTiming: document.getElementById("restaurant-timing"),
    restaurantType: document.getElementById("restaurant-type"),
    btnLangEn: document.getElementById("btn-lang-en"),
    btnLangHi: document.getElementById("btn-lang-hi"),
    searchInput: document.getElementById("menu-search-input"),
    btnClearSearch: document.getElementById("btn-clear-search"),
    filterDietAll: document.getElementById("filter-diet-all"),
    filterDietVeg: document.getElementById("filter-diet-veg"),
    filterDietNonVeg: document.getElementById("filter-diet-non-veg"),
    labelFilterAll: document.getElementById("label-filter-all"),
    labelFilterVeg: document.getElementById("label-filter-veg"),
    labelFilterNonVeg: document.getElementById("label-filter-non-veg"),
    categoryPillsContainer: document.getElementById("category-pills-container"),
    menuSectionsWrapper: document.getElementById("menu-sections-wrapper"),
    menuSectionHeading: document.getElementById("menu-section-heading"),
    resultsCount: document.getElementById("results-count"),
    emptyState: document.getElementById("empty-state"),
    emptyTitle: document.getElementById("empty-title"),
    emptySubtitle: document.getElementById("empty-subtitle"),
    btnResetFilters: document.getElementById("btn-reset-filters"),
    footerNote: document.getElementById("footer-note"),

    // Checkpoint 2C Elements: Floating Cart Bar & Drawer
    floatingCartBar: document.getElementById("floating-cart-bar"),
    floatingCartBadge: document.getElementById("floating-cart-badge"),
    floatingCartCount: document.getElementById("floating-cart-count"),
    floatingCartTotal: document.getElementById("floating-cart-total"),
    btnOpenCart: document.getElementById("btn-open-cart"),
    labelViewCart: document.getElementById("label-view-cart"),

    cartDrawerBackdrop: document.getElementById("cart-drawer-backdrop"),
    cartDrawer: document.getElementById("cart-drawer"),
    cartDrawerTitle: document.getElementById("cart-drawer-title"),
    cartHeaderCount: document.getElementById("cart-header-count"),
    btnCloseCart: document.getElementById("btn-close-cart"),
    cartItemsBody: document.getElementById("cart-items-body"),
    cartDrawerFooter: document.getElementById("cart-drawer-footer"),

    labelOrderNote: document.getElementById("label-order-note"),
    orderNoteInput: document.getElementById("order-note-input"),
    labelSubtotal: document.getElementById("label-subtotal"),
    billSubtotal: document.getElementById("bill-subtotal"),
    labelTaxNote: document.getElementById("label-tax-note"),
    labelGrandTotal: document.getElementById("label-grand-total"),
    billGrandTotal: document.getElementById("bill-grand-total"),

    btnClearCart: document.getElementById("btn-clear-cart"),
    labelClearCart: document.getElementById("label-clear-cart"),
    btnWhatsAppOrder: document.getElementById("btn-whatsapp-order"),
    labelWhatsAppCTA: document.getElementById("label-whatsapp-cta"),
    waDisplayNumber: document.getElementById("wa-display-number"),

    // Checkpoint 2D Elements: Owner Table QR Modal
    btnOpenQrModal: document.getElementById("btn-open-qr-modal"),
    qrModalBackdrop: document.getElementById("qr-modal-backdrop"),
    qrModal: document.getElementById("qr-modal"),
    qrModalTitle: document.getElementById("qr-modal-title"),
    qrModalSubtitle: document.getElementById("qr-modal-subtitle"),
    btnCloseQrModal: document.getElementById("btn-close-qr-modal"),
    btnPrintQrCard: document.getElementById("btn-print-qr-card"),
    labelTableQr: document.getElementById("label-table-qr"),
    labelDownloadCard: document.getElementById("label-download-card"),
    labelDownloadQr: document.getElementById("label-download-qr"),
    labelPrintCard: document.getElementById("label-print-card")
  };

  /**
   * Initialize the application
   */
  function init() {
    loadCartFromStorage();
    bindEvents();
    renderStaticTexts();
    renderCategoryPills();
    renderMenu();
    updateCartUI();
  }

  /* ==========================================================================
     Cart State & Storage Management
     ========================================================================== */

  /**
   * Load cart from localStorage and validate against existing available items
   */
  function loadCartFromStorage() {
    try {
      const stored = localStorage.getItem(CONFIG.cartStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          const validated = {};
          // Only keep valid, available items with integer quantity >= 1
          for (const [itemId, qty] of Object.entries(parsed)) {
            const item = MENU_ITEMS.find((i) => i.id === itemId);
            const numQty = parseInt(qty, 10);
            if (item && item.isAvailable && !isNaN(numQty) && numQty >= 1) {
              validated[itemId] = numQty;
            }
          }
          state.cart = validated;
        }
      }
    } catch (err) {
      console.warn("Could not load cart from localStorage:", err);
      state.cart = {};
    }
  }

  /**
   * Save cart state to localStorage
   */
  function saveCartToStorage() {
    try {
      localStorage.setItem(CONFIG.cartStorageKey, JSON.stringify(state.cart));
    } catch (err) {
      console.warn("Could not save cart to localStorage:", err);
    }
  }

  /**
   * Add item to cart
   * @param {string} itemId
   * @returns {boolean} Whether item was added
   */
  function addToCart(itemId) {
    const item = MENU_ITEMS.find((i) => i.id === itemId);
    if (!item || !item.isAvailable) {
      alert(UI_STRINGS[state.lang].soldOutWarning || "This item is sold out.");
      return false;
    }

    if (state.cart[itemId]) {
      state.cart[itemId] += 1;
    } else {
      state.cart[itemId] = 1;
    }

    saveCartToStorage();
    updateCartUI();
    renderMenu(); // Updates card action buttons
    return true;
  }

  /**
   * Update item quantity in cart (+1 or -1)
   * @param {string} itemId
   * @param {number} delta (+1 or -1)
   */
  function updateQuantity(itemId, delta) {
    if (!state.cart[itemId]) return;

    const currentQty = state.cart[itemId];
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      delete state.cart[itemId];
    } else {
      state.cart[itemId] = newQty;
    }

    saveCartToStorage();
    updateCartUI();
    renderMenu();
  }

  /**
   * Remove item from cart completely
   * @param {string} itemId
   */
  function removeFromCart(itemId) {
    if (state.cart[itemId]) {
      delete state.cart[itemId];
      saveCartToStorage();
      updateCartUI();
      renderMenu();
    }
  }

  /**
   * Clear all items from the cart
   */
  function clearCart() {
    state.cart = {};
    saveCartToStorage();
    updateCartUI();
    renderMenu();
  }

  /**
   * Calculate totals (item count, subtotal, grand total)
   * @returns {{ totalCount: number, subtotal: number, grandTotal: number }}
   */
  function getCartTotals() {
    let totalCount = 0;
    let subtotal = 0;

    for (const [itemId, qty] of Object.entries(state.cart)) {
      const item = MENU_ITEMS.find((i) => i.id === itemId);
      if (item && item.isAvailable) {
        totalCount += qty;
        subtotal += item.price * qty;
      }
    }

    return {
      totalCount,
      subtotal,
      grandTotal: subtotal // Prices are inclusive of all taxes
    };
  }

  /* ==========================================================================
     Cart UI & Drawer Interactions
     ========================================================================== */

  /**
   * Update Floating Cart Bar and Cart Drawer Views
   */
  function updateCartUI() {
    const lang = state.lang;
    const strings = UI_STRINGS[lang];
    const { totalCount, subtotal, grandTotal } = getCartTotals();

    // 1. Floating Cart Bar (Fixed bottom)
    if (totalCount > 0) {
      DOM.floatingCartBar.hidden = false;
      DOM.floatingCartBadge.textContent = totalCount;
      DOM.floatingCartCount.textContent = `${totalCount} ${strings.itemCountSuffix}`;
      DOM.floatingCartTotal.textContent = `${strings.pricePrefix}${subtotal}`;
    } else {
      DOM.floatingCartBar.hidden = true;
    }

    // 2. Cart Drawer Header Count
    DOM.cartHeaderCount.textContent = totalCount;

    // 3. Bill Totals
    DOM.billSubtotal.textContent = `${strings.pricePrefix}${subtotal}`;
    DOM.billGrandTotal.textContent = `${strings.pricePrefix}${grandTotal}`;

    // 4. Cart Drawer Items Body
    renderCartDrawerBody();
  }

  /**
   * Render the scrollable body of the Cart Drawer
   */
  function renderCartDrawerBody() {
    const lang = state.lang;
    const secondaryLang = lang === "en" ? "hi" : "en";
    const strings = UI_STRINGS[lang];
    const { totalCount } = getCartTotals();

    if (totalCount === 0) {
      // Empty Cart View
      DOM.cartItemsBody.innerHTML = `
        <div class="cart-empty-panel">
          <div class="cart-empty-icon" aria-hidden="true">🛒</div>
          <h3 class="cart-empty-title">${escapeHTML(strings.emptyCartTitle)}</h3>
          <p class="cart-empty-subtitle">${escapeHTML(strings.emptyCartSubtitle)}</p>
          <button type="button" id="btn-browse-menu" class="btn-browse-menu">
            ${escapeHTML(strings.browseMenu)}
          </button>
        </div>
      `;

      // Disable or dim footer when cart is empty
      DOM.cartDrawerFooter.style.opacity = "0.45";
      DOM.cartDrawerFooter.style.pointerEvents = "none";
      DOM.btnWhatsAppOrder.disabled = true;
      DOM.btnClearCart.disabled = true;

      const btnBrowse = document.getElementById("btn-browse-menu");
      if (btnBrowse) {
        btnBrowse.addEventListener("click", closeCartDrawer);
      }
      return;
    }

    // Enabled footer
    DOM.cartDrawerFooter.style.opacity = "1";
    DOM.cartDrawerFooter.style.pointerEvents = "auto";
    DOM.btnWhatsAppOrder.disabled = false;
    DOM.btnClearCart.disabled = false;

    // Build Cart Items List
    let itemsHTML = "";
    for (const [itemId, qty] of Object.entries(state.cart)) {
      const item = MENU_ITEMS.find((i) => i.id === itemId);
      if (!item) continue;

      const titlePrimary = item.name[lang];
      const titleSecondary = item.name[secondaryLang];
      const dietClass = item.isVeg ? "veg" : "non-veg";
      const lineTotal = item.price * qty;

      itemsHTML += `
        <div class="cart-item-card" data-item-id="${item.id}">
          <div class="cart-item-top">
            <div class="cart-item-main">
              <span class="diet-badge-fssai ${dietClass}" aria-hidden="true">
                <span class="symbol-shape"></span>
              </span>
              <div class="cart-item-titles">
                <div class="cart-item-name">${escapeHTML(titlePrimary)}</div>
                <div class="cart-item-unit-price">${strings.pricePrefix}${item.price} each</div>
              </div>
            </div>
            <div class="cart-item-line-total">
              ${strings.pricePrefix}${lineTotal}
            </div>
          </div>

          <div class="cart-item-bottom">
            <div class="item-stepper" aria-label="Quantity controls for ${escapeHTML(titlePrimary)}">
              <button type="button" class="btn-stepper btn-minus" data-cart-action="decrease" data-item-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span class="stepper-val" aria-live="polite">${qty}</span>
              <button type="button" class="btn-stepper btn-plus" data-cart-action="increase" data-item-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="btn-remove-item" data-cart-action="remove" data-item-id="${item.id}" aria-label="Remove ${escapeHTML(titlePrimary)} from cart">
              ✕ Remove
            </button>
          </div>
        </div>
      `;
    }

    DOM.cartItemsBody.innerHTML = itemsHTML;
  }

  /**
   * Open the Cart Drawer
   */
  function openCartDrawer() {
    DOM.cartDrawerBackdrop.hidden = false;
    DOM.cartDrawer.hidden = false;
    DOM.cartDrawer.setAttribute("aria-hidden", "false");

    // Force layout reflow before adding CSS transition class
    void DOM.cartDrawer.offsetWidth;
    DOM.cartDrawer.classList.add("open");
    DOM.cartDrawerBackdrop.classList.add("active");

    updateCartUI();
  }

  /**
   * Close the Cart Drawer
   */
  function closeCartDrawer() {
    DOM.cartDrawer.classList.remove("open");
    DOM.cartDrawerBackdrop.classList.remove("active");
    DOM.cartDrawer.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      if (!DOM.cartDrawer.classList.contains("open")) {
        DOM.cartDrawer.hidden = true;
        DOM.cartDrawerBackdrop.hidden = true;
      }
    }, 280);
  }

  /**
   * Open the Tabletop QR Modal (Checkpoint 2D)
   */
  function openQrModal() {
    if (!DOM.qrModal) return;
    DOM.qrModal.hidden = false;
    DOM.qrModal.setAttribute("aria-hidden", "false");
    if (DOM.qrModalBackdrop) DOM.qrModalBackdrop.hidden = false;
  }

  /**
   * Close the Tabletop QR Modal (Checkpoint 2D)
   */
  function closeQrModal() {
    if (!DOM.qrModal) return;
    DOM.qrModal.hidden = true;
    DOM.qrModal.setAttribute("aria-hidden", "true");
    if (DOM.qrModalBackdrop) DOM.qrModalBackdrop.hidden = true;
  }

  /* ==========================================================================
     WhatsApp Ordering Integration
     ========================================================================== */

  /**
   * Validate WhatsApp phone number (must be valid digits, E.164 without +, 10-15 digits)
   * @param {string} phone
   * @returns {boolean}
   */
  function isValidWhatsAppNumber(phone) {
    if (!phone || typeof phone !== "string") return false;
    const clean = phone.replace(/\D/g, "");
    // Standard international numbers are between 10 and 15 digits
    return clean.length >= 10 && clean.length <= 15;
  }

  /**
   * Construct WhatsApp order summary and generate official https://wa.me/ URL
   * @param {string} orderNote Optional user note / table number
   * @returns {{ success: boolean, url?: string, message?: string, error?: string }}
   */
  function generateWhatsAppOrder(orderNote = "") {
    const rawNumber = CONFIG.whatsappNumber || "";
    const cleanNumber = rawNumber.replace(/\D/g, "");

    if (!isValidWhatsAppNumber(cleanNumber)) {
      return {
        success: false,
        error: UI_STRINGS[state.lang].invalidPhoneError || "Invalid restaurant WhatsApp phone number."
      };
    }

    const { totalCount, grandTotal } = getCartTotals();
    if (totalCount === 0) {
      return {
        success: false,
        error: "Cart is empty."
      };
    }

    const lang = state.lang;
    const isHi = lang === "hi";

    // Header
    const headerTitle = isHi
      ? `*मसाला स्ट्रीट — नया ऑर्डर*`
      : `*Spice Street — New Order*`;
    const divider = `--------------------------------`;

    // Items list
    const itemsList = [];
    let itemIdx = 1;

    for (const [itemId, qty] of Object.entries(state.cart)) {
      const item = MENU_ITEMS.find((i) => i.id === itemId);
      if (!item) continue;

      const namePrimary = item.name[lang];
      const nameSecondary = item.name[isHi ? "en" : "hi"];
      const lineTotal = item.price * qty;

      itemsList.push(
        `${itemIdx}. *${namePrimary}* (${nameSecondary})\n   Qty: ${qty} × ₹${item.price} = ₹${lineTotal}`
      );
      itemIdx++;
    }

    const noteText = orderNote.trim()
      ? `\n*${isHi ? "टेबल / निर्देश" : "Table / Note"}:* ${orderNote.trim()}`
      : "";

    const message = [
      headerTitle,
      divider,
      itemsList.join("\n"),
      divider,
      `*${isHi ? "कुल व्यंजन" : "Total Items"}:* ${totalCount}`,
      `*${isHi ? "कुल योग" : "Grand Total"}:* ₹${grandTotal} (${isHi ? "लागू कर सहित" : "Incl. of taxes"})${noteText}`,
      divider,
      `_${isHi ? "स्पाइस स्ट्रीट क्यूआर मेन्यू द्वारा भेजा गया।" : "Order sent via Spice Street QR Menu."}_`,
      `_${isHi ? "कृपया ऑर्डर पुष्टि करें।" : "Please confirm order and payment."}_`
    ].join("\n");

    const encodedText = encodeURIComponent(message);
    const url = `https://wa.me/${cleanNumber}?text=${encodedText}`;

    return {
      success: true,
      url,
      message,
      phone: cleanNumber
    };
  }

  /**
   * Handle Click on WhatsApp Order Button
   */
  function handleWhatsAppOrderClick() {
    const note = DOM.orderNoteInput ? DOM.orderNoteInput.value : "";
    const result = generateWhatsAppOrder(note);

    if (!result.success) {
      alert(result.error);
      return;
    }

    // Open WhatsApp click-to-chat URL for customer to manually send
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  /* ==========================================================================
     Event Handlers & User Interactions
     ========================================================================== */

  /**
   * Bind DOM event listeners
   */
  function bindEvents() {
    // Language Switchers
    DOM.btnLangEn.addEventListener("click", () => setLanguage("en"));
    DOM.btnLangHi.addEventListener("click", () => setLanguage("hi"));

    // Search Input with Live input
    DOM.searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      DOM.btnClearSearch.hidden = state.searchQuery.length === 0;
      renderMenu();
    });

    // Clear Search Button
    DOM.btnClearSearch.addEventListener("click", () => {
      DOM.searchInput.value = "";
      state.searchQuery = "";
      DOM.btnClearSearch.hidden = true;
      DOM.searchInput.focus();
      renderMenu();
    });

    // Dietary Filter Chips
    [DOM.filterDietAll, DOM.filterDietVeg, DOM.filterDietNonVeg].forEach((btn) => {
      btn.addEventListener("click", () => {
        const diet = btn.getAttribute("data-diet");
        setDietaryFilter(diet);
      });
    });

    // Reset Filters Button in Empty State
    DOM.btnResetFilters.addEventListener("click", resetAllFilters);

    // Event Delegation: Menu Card Action Buttons (+ Add / Stepper)
    DOM.menuSectionsWrapper.addEventListener("click", (e) => {
      const target = e.target.closest("button[data-action]");
      if (!target) return;

      const action = target.getAttribute("data-action");
      const itemId = target.getAttribute("data-item-id");

      if (action === "add-to-cart") {
        addToCart(itemId);
      } else if (action === "stepper-plus") {
        updateQuantity(itemId, 1);
      } else if (action === "stepper-minus") {
        updateQuantity(itemId, -1);
      }
    });

    // Floating Cart Bar: Open Drawer
    DOM.btnOpenCart.addEventListener("click", openCartDrawer);

    // Cart Drawer: Close Drawer Actions
    DOM.btnCloseCart.addEventListener("click", closeCartDrawer);
    DOM.cartDrawerBackdrop.addEventListener("click", closeCartDrawer);

    // Close on Escape Key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && DOM.cartDrawer.classList.contains("open")) {
        closeCartDrawer();
      }
    });

    // Event Delegation: Cart Drawer Item Actions (increase, decrease, remove)
    DOM.cartItemsBody.addEventListener("click", (e) => {
      const target = e.target.closest("button[data-cart-action]");
      if (!target) return;

      const action = target.getAttribute("data-cart-action");
      const itemId = target.getAttribute("data-item-id");

      if (action === "increase") {
        updateQuantity(itemId, 1);
      } else if (action === "decrease") {
        updateQuantity(itemId, -1);
      } else if (action === "remove") {
        removeFromCart(itemId);
      }
    });

    // Clear Cart Button in Drawer
    DOM.btnClearCart.addEventListener("click", () => {
      clearCart();
    });

    // WhatsApp Order Button
    DOM.btnWhatsAppOrder.addEventListener("click", handleWhatsAppOrderClick);

    // Checkpoint 2D: Tabletop QR Modal Controls
    if (DOM.btnOpenQrModal) {
      DOM.btnOpenQrModal.addEventListener("click", openQrModal);
    }
    if (DOM.btnCloseQrModal) {
      DOM.btnCloseQrModal.addEventListener("click", closeQrModal);
    }
    if (DOM.qrModalBackdrop) {
      DOM.qrModalBackdrop.addEventListener("click", closeQrModal);
    }
    if (DOM.btnPrintQrCard) {
      DOM.btnPrintQrCard.addEventListener("click", () => {
        window.print();
      });
    }

    // Close QR Modal on Escape Key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && DOM.qrModal && !DOM.qrModal.hidden) {
        closeQrModal();
      }
    });
  }

  /**
   * Switch Active Language
   * @param {'en' | 'hi'} newLang
   */
  function setLanguage(newLang) {
    if (state.lang === newLang) return;
    state.lang = newLang;
    DOM.html.setAttribute("lang", newLang);

    // Toggle button active states
    const isEn = newLang === "en";
    DOM.btnLangEn.classList.toggle("active", isEn);
    DOM.btnLangEn.setAttribute("aria-pressed", isEn ? "true" : "false");
    DOM.btnLangHi.classList.toggle("active", !isEn);
    DOM.btnLangHi.setAttribute("aria-pressed", !isEn ? "true" : "false");

    renderStaticTexts();
    renderCategoryPills();
    renderMenu();
    updateCartUI();
  }

  /**
   * Update all static UI labels based on current language
   */
  function renderStaticTexts() {
    const lang = state.lang;
    const strings = UI_STRINGS[lang];

    // Restaurant details
    DOM.restaurantName.textContent = RESTAURANT_INFO.name[lang];
    DOM.restaurantTagline.textContent = RESTAURANT_INFO.tagline[lang];
    DOM.restaurantAddress.textContent = RESTAURANT_INFO.address[lang];
    DOM.restaurantTiming.textContent = RESTAURANT_INFO.timing[lang];
    DOM.restaurantType.textContent = RESTAURANT_INFO.typeBadge[lang];

    // Search placeholder
    DOM.searchInput.setAttribute("placeholder", strings.searchPlaceholder);

    // Filter labels
    DOM.labelFilterAll.textContent = strings.filterAll;
    DOM.labelFilterVeg.textContent = strings.filterVeg;
    DOM.labelFilterNonVeg.textContent = strings.filterNonVeg;

    // Headings & Empty State
    DOM.menuSectionHeading.textContent = strings.menuTitle;
    DOM.emptyTitle.textContent = strings.noResultsTitle;
    DOM.emptySubtitle.textContent = strings.noResultsSubtitle;
    DOM.btnResetFilters.textContent = strings.clearFilters;

    // Footer
    DOM.footerNote.textContent = strings.footerText;

    // Checkpoint 2C: Cart UI Labels
    if (DOM.labelViewCart) DOM.labelViewCart.textContent = strings.viewCart;
    if (DOM.cartDrawerTitle) DOM.cartDrawerTitle.textContent = strings.cartTitle;
    if (DOM.labelOrderNote) DOM.labelOrderNote.textContent = strings.tablePrompt;
    if (DOM.orderNoteInput) DOM.orderNoteInput.setAttribute("placeholder", strings.tablePlaceholder);
    if (DOM.labelSubtotal) DOM.labelSubtotal.textContent = strings.subtotal;
    if (DOM.labelTaxNote) DOM.labelTaxNote.textContent = strings.taxesInclusive;
    if (DOM.labelGrandTotal) DOM.labelGrandTotal.textContent = strings.grandTotal;
    if (DOM.labelClearCart) DOM.labelClearCart.textContent = strings.clearCart;
    if (DOM.labelWhatsAppCTA) DOM.labelWhatsAppCTA.textContent = strings.proceedToWhatsApp;
    if (DOM.waDisplayNumber) DOM.waDisplayNumber.textContent = CONFIG.whatsappNumberFormatted || CONFIG.whatsappNumber;

    // Checkpoint 2D: Table QR UI Labels
    if (DOM.labelTableQr && strings.tableQrBtn) DOM.labelTableQr.textContent = strings.tableQrBtn;
    if (DOM.qrModalTitle && strings.qrModalTitle) DOM.qrModalTitle.textContent = strings.qrModalTitle;
    if (DOM.qrModalSubtitle && strings.qrModalSubtitle) DOM.qrModalSubtitle.textContent = strings.qrModalSubtitle;
    if (DOM.labelDownloadCard && strings.downloadCardBtn) DOM.labelDownloadCard.textContent = strings.downloadCardBtn;
    if (DOM.labelDownloadQr && strings.downloadQrBtn) DOM.labelDownloadQr.textContent = strings.downloadQrBtn;
    if (DOM.labelPrintCard && strings.printCardBtn) DOM.labelPrintCard.textContent = strings.printCardBtn;
  }

  /**
   * Set Dietary Filter
   * @param {'all' | 'veg' | 'non-veg'} diet
   */
  function setDietaryFilter(diet) {
    state.dietaryFilter = diet;

    // Update UI chips
    [DOM.filterDietAll, DOM.filterDietVeg, DOM.filterDietNonVeg].forEach((btn) => {
      const isActive = btn.getAttribute("data-diet") === diet;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    renderMenu();
  }

  /**
   * Set Active Category
   * @param {string} catId
   */
  function setCategory(catId) {
    state.selectedCategory = catId;

    // Update active class on pill buttons
    const pills = DOM.categoryPillsContainer.querySelectorAll(".cat-pill-btn");
    pills.forEach((pill) => {
      const match = pill.getAttribute("data-category") === catId;
      pill.classList.toggle("active", match);
      pill.setAttribute("aria-pressed", match ? "true" : "false");
    });

    renderMenu();
  }

  /**
   * Reset all filters to default
   */
  function resetAllFilters() {
    state.selectedCategory = "all";
    state.dietaryFilter = "all";
    state.searchQuery = "";
    DOM.searchInput.value = "";
    DOM.btnClearSearch.hidden = true;

    // Reset dietary buttons
    setDietaryFilter("all");

    // Reset category pills
    const pills = DOM.categoryPillsContainer.querySelectorAll(".cat-pill-btn");
    pills.forEach((pill) => {
      const isAll = pill.getAttribute("data-category") === "all";
      pill.classList.toggle("active", isAll);
      pill.setAttribute("aria-pressed", isAll ? "true" : "false");
    });

    renderMenu();
  }

  /**
   * Render Category Navigation Pills
   */
  function renderCategoryPills() {
    const lang = state.lang;
    const strings = UI_STRINGS[lang];

    DOM.categoryPillsContainer.innerHTML = "";

    // "All Items" pill
    const allLi = document.createElement("li");
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = `cat-pill-btn ${state.selectedCategory === "all" ? "active" : ""}`;
    allBtn.setAttribute("data-category", "all");
    allBtn.setAttribute("aria-pressed", state.selectedCategory === "all" ? "true" : "false");
    allBtn.innerHTML = `<span class="cat-pill-icon" aria-hidden="true">🍽️</span><span>${strings.allCategories}</span>`;
    allBtn.addEventListener("click", () => setCategory("all"));
    allLi.appendChild(allBtn);
    DOM.categoryPillsContainer.appendChild(allLi);

    // Individual category pills
    CATEGORIES.forEach((cat) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `cat-pill-btn ${state.selectedCategory === cat.id ? "active" : ""}`;
      btn.setAttribute("data-category", cat.id);
      btn.setAttribute("aria-pressed", state.selectedCategory === cat.id ? "true" : "false");
      btn.innerHTML = `<span class="cat-pill-icon" aria-hidden="true">${cat.icon}</span><span>${cat.name[lang]}</span>`;
      btn.addEventListener("click", () => setCategory(cat.id));
      li.appendChild(btn);
      DOM.categoryPillsContainer.appendChild(li);
    });
  }

  /**
   * Filter Menu Items based on current state
   * @returns {Array} Filtered menu item objects
   */
  function getFilteredItems() {
    return MENU_ITEMS.filter((item) => {
      // 1. Category Filter
      if (state.selectedCategory !== "all" && item.categoryId !== state.selectedCategory) {
        return false;
      }

      // 2. Dietary Filter
      if (state.dietaryFilter === "veg" && !item.isVeg) {
        return false;
      }
      if (state.dietaryFilter === "non-veg" && item.isVeg) {
        return false;
      }

      // 3. Search Query (Matches English or Hindi names, descriptions, or tags)
      if (state.searchQuery) {
        const query = state.searchQuery;
        const nameEn = (item.name.en || "").toLowerCase();
        const nameHi = (item.name.hi || "").toLowerCase();
        const descEn = (item.description.en || "").toLowerCase();
        const descHi = (item.description.hi || "").toLowerCase();
        const tags = (item.tags || []).join(" ").toLowerCase();

        const matches =
          nameEn.includes(query) ||
          nameHi.includes(query) ||
          descEn.includes(query) ||
          descHi.includes(query) ||
          tags.includes(query);

        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Create HTML markup for a single menu card
   * @param {Object} item Menu item object
   * @returns {string} HTML string
   */
  function createMenuCardHTML(item) {
    const lang = state.lang;
    const secondaryLang = lang === "en" ? "hi" : "en";
    const strings = UI_STRINGS[lang];

    const titlePrimary = item.name[lang];
    const titleSecondary = item.name[secondaryLang];
    const description = item.description[lang];
    const isVeg = item.isVeg;
    const isAvailable = item.isAvailable;

    const dietClass = isVeg ? "veg" : "non-veg";
    const dietAriaLabel = isVeg ? strings.vegBadge : strings.nonVegBadge;

    const availabilityClass = isAvailable ? "available" : "sold-out";
    const availabilityLabel = isAvailable ? strings.available : strings.soldOut;

    const tagsHTML = (item.tags || [])
      .map((tag) => `<span class="dish-tag">${escapeHTML(tag)}</span>`)
      .join("");

    // Cart Action Control in Card
    let actionControlHTML = "";
    if (!isAvailable) {
      actionControlHTML = `
        <span class="availability-indicator sold-out" aria-label="Status: ${availabilityLabel}">
          ${availabilityLabel}
        </span>
      `;
    } else {
      const currentQty = state.cart[item.id] || 0;
      if (currentQty > 0) {
        actionControlHTML = `
          <div class="item-stepper" aria-label="Quantity for ${escapeHTML(titlePrimary)}">
            <button type="button" class="btn-stepper btn-minus" data-action="stepper-minus" data-item-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="stepper-val" aria-live="polite">${currentQty}</span>
            <button type="button" class="btn-stepper btn-plus" data-action="stepper-plus" data-item-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        `;
      } else {
        actionControlHTML = `
          <button type="button" class="btn-add-cart" data-action="add-to-cart" data-item-id="${item.id}" aria-label="Add ${escapeHTML(titlePrimary)} to cart">
            + ${escapeHTML(strings.addToCart)}
          </button>
        `;
      }
    }

    return `
      <article class="menu-card ${!isAvailable ? "is-unavailable" : ""}" data-item-id="${item.id}" data-category="${item.categoryId}">
        <div class="menu-card-top">
          <div class="menu-card-identity">
            <span class="diet-badge-fssai ${dietClass}" title="${dietAriaLabel}" aria-label="${dietAriaLabel}">
              <span class="symbol-shape"></span>
            </span>
            <div class="dish-header-texts">
              <h3 class="dish-title">${escapeHTML(titlePrimary)}</h3>
              <p class="dish-subtitle" aria-hidden="true">${escapeHTML(titleSecondary)}</p>
            </div>
          </div>
          <div class="dish-price" aria-label="Price ${item.price} Rupees">
            ${strings.pricePrefix}${item.price}
          </div>
        </div>

        <p class="dish-description">${escapeHTML(description)}</p>

        <div class="menu-card-bottom">
          <div class="dish-tags-group">
            ${tagsHTML}
          </div>
          <div class="card-action-wrap">
            ${actionControlHTML}
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Render the Menu Container
   */
  function renderMenu() {
    const lang = state.lang;
    const strings = UI_STRINGS[lang];
    const filteredItems = getFilteredItems();

    // Update Result Count
    DOM.resultsCount.textContent = `${filteredItems.length} ${strings.itemCountSuffix}`;

    // Handle Empty State
    if (filteredItems.length === 0) {
      DOM.menuSectionsWrapper.innerHTML = "";
      DOM.emptyState.hidden = false;
      return;
    }

    DOM.emptyState.hidden = true;

    // Group filtered items by category to maintain structure
    const categoryMap = new Map();
    CATEGORIES.forEach((cat) => categoryMap.set(cat.id, []));

    filteredItems.forEach((item) => {
      if (categoryMap.has(item.categoryId)) {
        categoryMap.get(item.categoryId).push(item);
      }
    });

    let html = "";

    CATEGORIES.forEach((cat) => {
      const itemsInCat = categoryMap.get(cat.id) || [];
      if (itemsInCat.length === 0) return; // Skip empty categories in current filter

      const catTitle = cat.name[lang];
      const cardsHTML = itemsInCat.map(createMenuCardHTML).join("");

      html += `
        <section class="category-section" id="cat-sec-${cat.id}" aria-labelledby="cat-heading-${cat.id}">
          <header class="category-section-header">
            <h3 class="category-section-title" id="cat-heading-${cat.id}">
              <span aria-hidden="true">${cat.icon}</span>
              <span>${escapeHTML(catTitle)}</span>
            </h3>
            <span class="category-section-count">${itemsInCat.length} ${strings.itemCountSuffix}</span>
          </header>
          <div class="menu-grid">
            ${cardsHTML}
          </div>
        </section>
      `;
    });

    DOM.menuSectionsWrapper.innerHTML = html;
  }

  /**
   * Safe HTML escaping utility
   * @param {string} str
   * @returns {string}
   */
  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Expose clean test helpers on window for browser verification
  window.SpiceStreetApp = {
    state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    generateWhatsAppOrder,
    openCartDrawer,
    closeCartDrawer,
    setLanguage
  };

  // Initialize once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
