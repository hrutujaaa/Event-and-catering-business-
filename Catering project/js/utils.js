/* ===== UTILITY FUNCTIONS ===== */

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Toast notification
function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}

// Format currency
function formatCurrency(amount, currency = "₹") {
  return `${currency}${Math.round(amount).toLocaleString("en-IN")}`;
}

// Format spice level
function getSpiceLevel(level) {
  const spices = ["🌶️", "🌶️🌶️", "🌶️🌶️🌶️", "🌶️🌶️🌶️🌶️", "🔥🔥🔥🔥🔥"];
  return spices[level] || "🌶️";
}

// Get dish by ID
function getDishById(id) {
  return MENU_DATA.dishes.find((dish) => dish.id === id);
}

// Get category by ID
function getCategoryById(categoryId) {
  return MENU_DATA.categories.find((cat) => cat.id === categoryId);
}

// Local Storage helpers
const Storage = {
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  get: (key) => JSON.parse(localStorage.getItem(key)),
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};

// Number formatting
function formatNumber(num) {
  return new Intl.NumberFormat("en-IN").format(num);
}

// Smooth scroll
function smoothScroll(element, behavior = "smooth") {
  element?.scrollIntoView({ behavior });
}

// Deep clone object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    debounce,
    throttle,
    showToast,
    formatCurrency,
    getSpiceLevel,
    getDishById,
    getCategoryById,
    Storage,
    formatNumber,
    smoothScroll,
    deepClone,
  };
}
