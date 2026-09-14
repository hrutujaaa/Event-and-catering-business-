/* ===== SEARCH FUNCTIONALITY ===== */

class MenuSearch {
  constructor() {
    this.searchInput = document.getElementById("menu-search");
    this.searchBtn = document.getElementById("search-btn");
    this.currentQuery = "";
    this.init();
  }

  init() {
    if (this.searchInput) {
      this.searchInput.addEventListener(
        "input",
        debounce((e) => this.search(e), 300),
      );
      this.searchBtn?.addEventListener("click", () => this.search());
    }
  }

  search(e) {
    this.currentQuery = (e?.target?.value || this.searchInput.value)
      .toLowerCase()
      .trim();
    this.performSearch();
  }

  performSearch() {
    if (!this.currentQuery) {
      menuFilter.applyFilters();
      return;
    }

    const results = MENU_DATA.dishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(this.currentQuery) ||
        dish.description.toLowerCase().includes(this.currentQuery) ||
        getCategoryById(dish.category)
          ?.name.toLowerCase()
          .includes(this.currentQuery),
    );

    this.displayResults(results);
  }

  displayResults(results) {
    const menuGrid = document.getElementById("menu-grid");
    const noResults = document.getElementById("no-results");

    if (!menuGrid) return;

    if (results.length === 0) {
      menuGrid.innerHTML = "";
      noResults.style.display = "block";
      return;
    }

    noResults.style.display = "none";
    this.renderDishes(results, menuGrid);
  }

  renderDishes(dishes, container) {
    container.innerHTML = dishes
      .map((dish) => this.createDishCard(dish))
      .join("");
    this.attachDishEventListeners();
  }

  createDishCard(dish) {
    const category = getCategoryById(dish.category);
    const spiceEmoji = getSpiceLevel(dish.spicy);
    const badges = this.getBadges(dish);

    return `
            <article class="menu-card" data-id="${dish.id}" data-category="${dish.category}" data-price="${dish.price}">
                <div class="menu-image">
                    <div class="placeholder-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <span style="font-size: 3rem;">${category?.icon || "🍽️"}</span>
                    </div>
                    ${dish.popular ? '<span class="badge badge-popular">⭐ Popular</span>' : ""}
                    <button class="favorite-btn" data-id="${dish.id}" aria-label="Add to favorites">🤍</button>
                </div>
                <div class="menu-content">
                    <h3 class="menu-name">${dish.name}</h3>
                    <p class="menu-description">${dish.description}</p>
                    <div class="menu-details">
                        <div class="diet-badges">
                            ${dish.veg ? '<span class="badge badge-vegetarian">🥗 Veg</span>' : '<span class="badge badge-nonveg">🍖 Non-Veg</span>'}
                            ${dish.jain ? '<span class="badge badge-jain">🌱 Jain</span>' : ""}
                            ${dish.vegan ? '<span class="badge badge-vegan">🌾 Vegan</span>' : ""}
                        </div>
                        <div class="meal-info">
                            <span class="spice-level">${spiceEmoji}</span>
                        </div>
                    </div>
                    <div class="menu-footer">
                        <span class="price">${formatCurrency(dish.price)}/person</span>
                        <div class="quantity-selector">
                            <button class="qty-btn qty-minus" data-id="${dish.id}">−</button>
                            <input type="number" class="qty-input" value="0" min="0" data-id="${dish.id}">
                            <button class="qty-btn qty-plus" data-id="${dish.id}">+</button>
                        </div>
                        <button class="btn btn-primary btn-small add-to-plate" data-id="${dish.id}">Add</button>
                    </div>
                </div>
            </article>
        `;
  }

  getBadges(dish) {
    const badges = [];
    if (dish.popular) badges.push("Popular");
    if (dish.veg) badges.push("Vegetarian");
    if (dish.jain) badges.push("Jain");
    if (dish.vegan) badges.push("Vegan");
    return badges;
  }

  attachDishEventListeners() {
    // Quantity buttons
    document.querySelectorAll(".qty-plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        input.value = parseInt(input.value) + 1;
      });
    });

    document.querySelectorAll(".qty-minus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        if (parseInt(input.value) > 0) {
          input.value = parseInt(input.value) - 1;
        }
      });
    });

    // Add to plate buttons
    document.querySelectorAll(".add-to-plate").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const dish = getDishById(id);
        const quantity = parseInt(
          document.querySelector(`.qty-input[data-id="${id}"]`).value,
        );

        if (quantity > 0 && dish) {
          cart.addItem(dish, quantity);
          document.querySelector(`.qty-input[data-id="${id}"]`).value = 0;
        } else {
          showToast("⚠️ Please select a quantity");
        }
      });
    });

    // Favorite buttons
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const isFavorited = btn.classList.toggle("favorited");
        btn.textContent = isFavorited ? "❤️" : "🤍";
      });
    });
  }
}

// Initialize search
const menuSearch = new MenuSearch();
