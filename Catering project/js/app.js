/* ===== Mobile Menu Toggle ===== */
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

if (mobileMenu) {
  mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    // Animate hamburger menu
    const bars = mobileMenu.querySelectorAll(".bar");
    bars.forEach((bar, index) => {
      if (navLinks.classList.contains("active")) {
        if (index === 0) {
          bar.style.transform = "rotate(45deg) translate(10px, 10px)";
        } else if (index === 1) {
          bar.style.opacity = "0";
        } else {
          bar.style.transform = "rotate(-45deg) translate(7px, -7px)";
        }
      } else {
        bar.style.transform = "none";
        bar.style.opacity = "1";
      }
    });
  });
}

// Close menu when a link is clicked
if (navLinks) {
  const navItems = navLinks.querySelectorAll("a");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("active");
      const bars = mobileMenu.querySelectorAll(".bar");
      bars.forEach((bar) => {
        bar.style.transform = "none";
        bar.style.opacity = "1";
      });
    });
  });
}

/* ===== Dark Mode Toggle ===== */
class DarkMode {
  constructor() {
    this.isDarkMode = localStorage.getItem("darkMode") === "true";
    this.init();
  }

  init() {
    this.createToggleButton();
    this.applyDarkMode();
  }

  createToggleButton() {
    const header = document.querySelector(".header");
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "dark-mode-toggle";
    toggleBtn.className = "dark-mode-toggle";
    toggleBtn.innerHTML = this.isDarkMode ? "☀️" : "🌙";
    toggleBtn.setAttribute("aria-label", "Toggle dark mode");

    toggleBtn.addEventListener("click", () => this.toggle());

    if (header) {
      header.appendChild(toggleBtn);
    }
  }

  toggle() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem("darkMode", this.isDarkMode);
    this.applyDarkMode();
    this.animateToggle();
  }

  applyDarkMode() {
    const html = document.documentElement;
    const toggleBtn = document.getElementById("dark-mode-toggle");

    if (this.isDarkMode) {
      html.setAttribute("data-theme", "dark");
      if (toggleBtn) toggleBtn.innerHTML = "☀️";
    } else {
      html.setAttribute("data-theme", "light");
      if (toggleBtn) toggleBtn.innerHTML = "🌙";
    }
  }

  animateToggle() {
    const toggleBtn = document.getElementById("dark-mode-toggle");
    if (toggleBtn) {
      toggleBtn.style.animation = "none";
      setTimeout(() => {
        toggleBtn.style.animation = "rotate 0.5s ease-in-out";
      }, 10);
    }
  }
}

// Initialize dark mode
const darkMode = new DarkMode();

/* ===== Smooth Scroll for Anchor Links ===== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

/* ===== Page Load Animation ===== */
window.addEventListener("load", () => {
  document.body.style.opacity = "1";
});

/* ===== Intersection Observer for Elements ===== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll("section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(20px)";
  section.style.transition = "all 0.8s ease-out";
  observer.observe(section);
});

/* ===== Performance Optimization ===== */

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

/* ===== Scroll Position Memory ===== */
window.addEventListener("beforeunload", () => {
  localStorage.setItem("scrollPosition", window.scrollY);
});

window.addEventListener("load", () => {
  const scrollPosition = localStorage.getItem("scrollPosition");
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition));
  }
});

/* ===== Touch Events for Mobile ===== */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  false,
);

document.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  false,
);

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    // Swiped left
    console.log("Swiped left");
  }
  if (touchEndX > touchStartX + 50) {
    // Swiped right
    console.log("Swiped right");
  }
}

/* ===== Active Navigation Highlight ===== */
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section");

window.addEventListener(
  "scroll",
  throttle(() => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href").slice(1) === current) {
        item.classList.add("active");
      }
    });
  }, 100),
);

/* ===== Keyboard Shortcuts ===== */
document.addEventListener("keydown", (e) => {
  // Dark mode toggle: Ctrl/Cmd + D
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault();
    darkMode.toggle();
  }

  // Scroll to top: Home key
  if (e.key === "Home") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Scroll to bottom: End key
  if (e.key === "End") {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
});

/* ===== Performance Monitoring ===== */
if (window.performance && window.performance.timing) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log("Page load time: " + pageLoadTime + "ms");
    }, 0);
  });
}

/* ===== Lazy Loading for Images ===== */
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });

  document
    .querySelectorAll("img[data-src]")
    .forEach((img) => imageObserver.observe(img));
}

/* ===== Console Message ===== */
console.log(
  "%cWelcome to Anubhav Catering! 🍽️",
  "font-size: 20px; color: #f39c12; font-weight: bold;",
);
console.log(
  "%cTip: Press Ctrl/Cmd + D to toggle dark mode",
  "font-size: 12px; color: #f39c12;",
);
