/**
 * Spice Street — Application Logic (Checkpoint 2B)
 * Pure Vanilla JavaScript ES6+
 * Handles bilingual state, dietary filtering, search, category navigation, and DOM rendering.
 */

(function () {
  "use strict";

  // Check that menu data is loaded
  const data = window.MENU_DATA || {};
  const { RESTAURANT_INFO, CATEGORIES, MENU_ITEMS, UI_STRINGS } = data;

  if (!MENU_ITEMS || !CATEGORIES) {
    console.error("Menu data not found. Ensure js/menu-data.js is loaded prior to app.js.");
    return;
  }

  // Application State
  const state = {
    lang: "en",                // 'en' | 'hi'
    selectedCategory: "all",   // 'all' | category.id
    dietaryFilter: "all",      // 'all' | 'veg' | 'non-veg'
    searchQuery: ""            // string
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
    footerNote: document.getElementById("footer-note")
  };

  /**
   * Initialize the application
   */
  function init() {
    bindEvents();
    renderStaticTexts();
    renderCategoryPills();
    renderMenu();
  }

  /**
   * Bind DOM event listeners
   */
  function bindEvents() {
    // Language Switchers
    DOM.btnLangEn.addEventListener("click", () => setLanguage("en"));
    DOM.btnLangHi.addEventListener("click", () => setLanguage("hi"));

    // Search Input with Debounce / Live input
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
          <div class="availability-indicator ${availabilityClass}" aria-label="Status: ${availabilityLabel}">
            ${availabilityLabel}
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

  // Initialize once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
