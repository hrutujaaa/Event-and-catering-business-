/* ===== FILTER & SORT FUNCTIONALITY ===== */

class MenuFilter {
  constructor() {
    this.filters = {
      dietary: "all",
      priceRange: "all",
      sortBy: "name",
      budgetMax: 2000,
    };
    this.filteredDishes = [...MENU_DATA.dishes];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.displayAllDishes();
  }

  setupEventListeners() {
    // Dietary filters
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.filters.dietary = e.target.dataset.filter;
        this.applyFilters();
      });
    });

    // Price range filter
    document.getElementById("price-range")?.addEventListener("change", (e) => {
      this.filters.priceRange = e.target.value;
      this.applyFilters();
    });

    // Sort
    document.getElementById("sort-by")?.addEventListener("change", (e) => {
      this.filters.sortBy = e.target.value;
      this.applyFilters();
    });

    // Budget slider
    document.getElementById("budget-slider")?.addEventListener("input", (e) => {
      this.filters.budgetMax = parseInt(e.target.value);
      document.getElementById("budget-display").textContent = formatCurrency(
        this.filters.budgetMax,
      );
      this.applyFilters();
    });

    // Budget presets
    document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const budget = parseInt(e.target.dataset.budget);
        document.getElementById("budget-slider").value = budget;
        this.filters.budgetMax = budget;
        document.getElementById("budget-display").textContent =
          formatCurrency(budget);
        this.applyFilters();
      });
    });

    // Menu templates
    document.querySelectorAll(".template-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const templateIndex = parseInt(e.target.dataset.template);
        this.applyTemplate(templateIndex);
      });
    });

    // Clear filters
    document.getElementById("clear-filters")?.addEventListener("click", () => {
      this.clearFilters();
    });
  }

  applyFilters() {
    this.filteredDishes = MENU_DATA.dishes.filter((dish) =>
      this.matchesAllFilters(dish),
    );
    this.filteredDishes = this.sortDishes(this.filteredDishes);
    this.displayDishes(this.filteredDishes);
  }

  matchesAllFilters(dish) {
    if (!this.matchesDietaryFilter(dish)) return false;
    if (!this.matchesPriceFilter(dish)) return false;
    if (!this.matchesBudgetFilter(dish)) return false;
    return true;
  }

  matchesDietaryFilter(dish) {
    if (this.filters.dietary === "all") return true;
    if (this.filters.dietary === "veg") return dish.veg;
    if (this.filters.dietary === "nonveg") return !dish.veg;
    if (this.filters.dietary === "jain") return dish.jain;
    if (this.filters.dietary === "vegan") return dish.vegan;
    return true;
  }

  matchesPriceFilter(dish) {
    if (this.filters.priceRange === "all") return true;
    if (this.filters.priceRange === "under-100") return dish.price < 100;
    if (this.filters.priceRange === "100-200")
      return dish.price >= 100 && dish.price <= 200;
    if (this.filters.priceRange === "200-300")
      return dish.price > 200 && dish.price <= 300;
    if (this.filters.priceRange === "premium") return dish.price > 300;
    return true;
  }

  matchesBudgetFilter(dish) {
    return dish.price <= this.filters.budgetMax;
  }

  sortDishes(dishes) {
    const sorted = [...dishes];

    switch (this.filters.sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "popular":
        return sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }

  displayAllDishes() {
    this.displayDishes(MENU_DATA.dishes);
  }

  displayDishes(dishes) {
    const menuGrid = document.getElementById("menu-grid");
    const noResults = document.getElementById("no-results");

    if (!menuGrid) return;

    if (dishes.length === 0) {
      menuGrid.innerHTML = "";
      noResults.style.display = "block";
      return;
    }

    noResults.style.display = "none";
    menuSearch.renderDishes(dishes, menuGrid);
  }

  applyTemplate(templateIndex) {
    const template = MENU_DATA.menuTemplates[templateIndex];
    if (!template) return;

    // Clear existing cart
    cart.items = [];

    // Add template dishes
    template.dishes.forEach((dishId) => {
      const dish = getDishById(dishId);
      if (dish) {
        cart.addItem(dish, 1);
      }
    });

    // Set guest count
    cart.setGuestCount(template.guestCount);
    showToast(`✅ ${template.name} loaded!`);
  }

  clearFilters() {
    this.filters = {
      dietary: "all",
      priceRange: "all",
      sortBy: "name",
      budgetMax: 2000,
    };

    // Reset UI
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelector('.filter-btn[data-filter="all"]')
      ?.classList.add("active");
    document.getElementById("price-range").value = "all";
    document.getElementById("sort-by").value = "name";
    document.getElementById("budget-slider").value = 500;
    document.getElementById("budget-display").textContent = formatCurrency(500);

    this.applyFilters();
    showToast("🔄 Filters cleared");
  }
}

// Initialize filter
const menuFilter = new MenuFilter();
