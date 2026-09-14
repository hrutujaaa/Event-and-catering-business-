/* ===== CART MANAGEMENT ===== */

class Cart {
  constructor() {
    this.items = Storage.get("cart-items") || [];
    this.guestCount = Storage.get("guest-count") || 100;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderCart();
    this.updateBadge();
  }

  setupEventListeners() {
    // Clear cart
    document
      .getElementById("clear-cart")
      ?.addEventListener("click", () => this.clear());

    // Save menu
    document
      .getElementById("save-menu")
      ?.addEventListener("click", () => this.saveMenu());

    // Download quote
    document
      .getElementById("download-quote")
      ?.addEventListener("click", () => this.downloadQuote());

    // Cart toggle
    document
      .getElementById("floating-cart-btn")
      ?.addEventListener("click", () => this.toggleSidebar());
    document
      .getElementById("cart-close")
      ?.addEventListener("click", () => this.closeSidebar());
  }

  addItem(dish, quantity) {
    if (quantity <= 0) return;

    const existingItem = this.items.find((item) => item.id === dish.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        category: dish.category,
        quantity: quantity,
      });
    }

    this.save();
    this.renderCart();
    this.updateBadge();
    showToast(`✅ Added ${quantity}x ${dish.name}`);
  }

  removeItem(dishId) {
    this.items = this.items.filter((item) => item.id !== dishId);
    this.save();
    this.renderCart();
    this.updateBadge();
    showToast("🗑️ Item removed");
  }

  updateQuantity(dishId, quantity) {
    const item = this.items.find((item) => item.id === dishId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(dishId);
      } else {
        item.quantity = quantity;
        this.save();
        this.renderCart();
        this.updateBadge();
      }
    }
  }

  clear() {
    if (confirm("Clear your menu? This cannot be undone.")) {
      this.items = [];
      this.save();
      this.renderCart();
      this.updateBadge();
      showToast("🗑️ Menu cleared");
    }
  }

  getTotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  getPerPlatePrice() {
    if (this.items.length === 0) return 0;
    return this.getTotal() / this.guestCount;
  }

  renderCart() {
    const selectedItemsDiv = document.getElementById("selected-items");
    const emptyMsg = document.getElementById("empty-cart-msg");

    if (!selectedItemsDiv) return;

    if (this.items.length === 0) {
      selectedItemsDiv.innerHTML = "";
      emptyMsg.style.display = "block";
    } else {
      emptyMsg.style.display = "none";
      selectedItemsDiv.innerHTML = this.items
        .map(
          (item) => `
                <div class="cart-item" role="listitem">
                    <div class="cart-item-info">
                        <h5 class="cart-item-name">${item.name}</h5>
                        <p class="cart-item-category">${getCategoryById(item.category)?.name || "Uncategorized"}</p>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-input">
                            <button class="qty-btn-sm" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn-sm" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <p class="cart-item-price">${formatCurrency(item.price)}/person</p>
                        <button class="remove-btn" onclick="cart.removeItem(${item.id})" aria-label="Remove item">×</button>
                    </div>
                </div>
            `,
        )
        .join("");
    }

    this.updatePricingSummary();
  }

  updatePricingSummary() {
    const itemsCount = this.items.length;
    const perPlateTotal = this.getPerPlatePrice();
    const subtotal = perPlateTotal * this.guestCount;
    const serviceCharge = subtotal * MENU_DATA.pricing.serviceCharge;
    const gst = (subtotal + serviceCharge) * MENU_DATA.pricing.gstRate;
    const deliveryCharge = MENU_DATA.pricing.deliveryCharge;
    const grandTotal = subtotal + serviceCharge + gst + deliveryCharge;

    document.getElementById("items-count").textContent = itemsCount;
    document.getElementById("per-plate-price").textContent =
      formatCurrency(perPlateTotal);
    document.getElementById("subtotal").textContent = formatCurrency(subtotal);
    document.getElementById("service-charge").textContent =
      formatCurrency(serviceCharge);
    document.getElementById("gst").textContent = formatCurrency(gst);
    document.getElementById("grand-total").textContent =
      formatCurrency(grandTotal);
  }

  updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.textContent = this.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
    }
  }

  save() {
    Storage.set("cart-items", this.items);
  }

  setGuestCount(count) {
    this.guestCount = count;
    Storage.set("guest-count", count);
    this.renderCart();
  }

  toggleSidebar() {
    const sidebar = document.getElementById("live-cart-sidebar");
    sidebar?.classList.toggle("active");
  }

  closeSidebar() {
    const sidebar = document.getElementById("live-cart-sidebar");
    sidebar?.classList.remove("active");
  }

  saveMenu() {
    const customerName =
      document.getElementById("customer-name")?.value || "Customer";
    const menu = {
      customerName,
      items: this.items,
      guestCount: this.guestCount,
      eventDate: document.getElementById("event-date")?.value,
      venue: document.getElementById("venue")?.value,
      specialNotes: document.getElementById("special-notes")?.value,
      savedAt: new Date().toISOString(),
    };

    Storage.set(`menu-${Date.now()}`, menu);
    showToast("💾 Menu saved successfully");
  }

  downloadQuote() {
    // Simple text export - can be enhanced with PDF
    const quote = this.generateQuoteText();
    const blob = new Blob([quote], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotation.txt";
    a.click();
    showToast("📄 Quote downloaded");
  }

  generateQuoteText() {
    const perPlateTotal = this.getPerPlatePrice();
    const subtotal = perPlateTotal * this.guestCount;
    const serviceCharge = subtotal * MENU_DATA.pricing.serviceCharge;
    const gst = (subtotal + serviceCharge) * MENU_DATA.pricing.gstRate;
    const deliveryCharge = MENU_DATA.pricing.deliveryCharge;
    const grandTotal = subtotal + serviceCharge + gst + deliveryCharge;

    let text = "ANUBHAV CATERING & EVENT SERVICES\n";
    text += "====================================\n";
    text += "QUOTATION\n\n";

    text += "CUSTOMER DETAILS:\n";
    text += `Name: ${document.getElementById("customer-name")?.value || "N/A"}\n`;
    text += `Phone: ${document.getElementById("customer-phone")?.value || "N/A"}\n`;
    text += `Email: ${document.getElementById("customer-email")?.value || "N/A"}\n\n`;

    text += "EVENT DETAILS:\n";
    text += `Guests: ${this.guestCount}\n`;
    text += `Venue: ${document.getElementById("venue")?.value || "N/A"}\n`;
    text += `Date: ${document.getElementById("event-date")?.value || "N/A"}\n\n`;

    text += "SELECTED MENU:\n";
    text += "------------------------------------\n";
    this.items.forEach((item) => {
      text += `${item.name} x${item.quantity} @ ${formatCurrency(item.price)}\n`;
    });

    text += "\n====================================\n";
    text += `Per Plate Price: ${formatCurrency(perPlateTotal)}\n`;
    text += `Subtotal (${this.guestCount} guests): ${formatCurrency(subtotal)}\n`;
    text += `Service Charge (10%): ${formatCurrency(serviceCharge)}\n`;
    text += `GST (5%): ${formatCurrency(gst)}\n`;
    text += `Delivery Charge: ${formatCurrency(deliveryCharge)}\n`;
    text += `====================================\n`;
    text += `GRAND TOTAL: ${formatCurrency(grandTotal)}\n`;
    text += `====================================\n\n`;
    text += "Thank you for choosing Anubhav Catering!";

    return text;
  }
}

// Initialize cart globally
const cart = new Cart();
