/* ===== GSAP-like Animation Library (Pure JavaScript) ===== */

class AnimationEngine {
  constructor() {
    this.animations = [];
    this.rafId = null;
  }

  // Animate element with easing
  animate(
    element,
    properties,
    duration = 500,
    easing = "easeInOutQuad",
    onComplete = null,
  ) {
    const startTime = Date.now();
    const startValues = {};

    for (let prop in properties) {
      const computedStyle = window.getComputedStyle(element);
      startValues[prop] = parseFloat(
        computedStyle[this.camelToDash(prop)] || 0,
      );
    }

    const animation = {
      element,
      properties,
      duration,
      easing,
      startTime,
      startValues,
      onComplete,
      active: true,
    };

    this.animations.push(animation);
    this.render();

    return animation;
  }

  // Easing functions
  easings = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
    easeOutElastic: (t) => {
      const c5 = (2 * Math.PI) / 4.5;
      return t === 0
        ? 0
        : t === 1
          ? 1
          : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c5) + 1;
    },
    easeOutBounce: (t) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
  };

  render() {
    const now = Date.now();

    for (let i = this.animations.length - 1; i >= 0; i--) {
      const anim = this.animations[i];
      const elapsed = now - anim.startTime;
      const progress = Math.min(elapsed / anim.duration, 1);
      const easedProgress = this.easings[anim.easing](progress);

      for (let prop in anim.properties) {
        const start = anim.startValues[prop];
        const end = anim.properties[prop];
        const current = start + (end - start) * easedProgress;

        if (prop === "opacity") {
          anim.element.style.opacity = current;
        } else if (prop === "transform") {
          anim.element.style.transform = end;
        } else {
          anim.element.style[prop] = current + "px";
        }
      }

      if (progress === 1) {
        anim.active = false;
        this.animations.splice(i, 1);
        if (anim.onComplete) anim.onComplete();
      }
    }

    if (this.animations.length > 0) {
      this.rafId = requestAnimationFrame(() => this.render());
    }
  }

  camelToDash(str) {
    return str.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
}

const engine = new AnimationEngine();

/* ===== Scroll Reveal Animation ===== */
class ScrollReveal {
  constructor() {
    this.elements = [];
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.revealElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
  }

  observe(elements) {
    elements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      this.observer.observe(el);
    });
  }

  revealElement(element) {
    engine.animate(element, { opacity: 1 }, 800, "easeOutCubic");
    engine.animate(
      element,
      { transform: "translateY(0)" },
      800,
      "easeOutCubic",
    );
  }
}

const scrollReveal = new ScrollReveal();

/* ===== Floating Images Animation ===== */
function initFloatingImages() {
  const images = document.querySelectorAll("section img");
  images.forEach((img, index) => {
    img.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
    img.addEventListener("mouseenter", function () {
      this.style.animation = "none";
      engine.animate(this, { transform: "scale(1.05)" }, 300, "easeOutQuad");
    });
    img.addEventListener("mouseleave", function () {
      this.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
      engine.animate(this, { transform: "scale(1)" }, 300, "easeOutQuad");
    });
  });
}

/* ===== Ripple Button Effect ===== */
function initRippleButtons() {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ===== Hover Glow Effect ===== */
function initHoverGlow() {
  const elements = document.querySelectorAll("section, .btn");
  elements.forEach((el) => {
    el.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.style.boxShadow = `0 0 30px rgba(243, 156, 18, 0.3), inset 0 0 20px rgba(243, 156, 18, 0.1)`;
    });

    el.addEventListener("mouseleave", function () {
      this.style.boxShadow = "";
    });
  });
}

/* ===== Mouse Parallax Effect ===== */
function initParallax() {
  const parallaxElements = document.querySelectorAll(
    "section img, .home-content, .about-content, .events-content, .menu-content",
  );

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    parallaxElements.forEach((el) => {
      const depth = el.dataset.depth || 20;
      const moveX = mouseX * depth - depth / 2;
      const moveY = mouseY * depth - depth / 2;

      el.style.transform = `perspective(1000px) rotateX(${moveY}deg) rotateY(${moveX}deg)`;
    });
  });
}

/* ===== Custom Cursor ===== */
function initCustomCursor() {
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  const cursorTrail = [];
  const trailLength = 8;

  for (let i = 0; i < trailLength; i++) {
    const trail = document.createElement("div");
    trail.classList.add("cursor-trail");
    trail.style.opacity = (i / trailLength) * 0.6;
    document.body.appendChild(trail);
    cursorTrail.push({ el: trail, x: 0, y: 0 });
  }

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    // Update trail
    let lastX = e.clientX;
    let lastY = e.clientY;

    cursorTrail.forEach((trail, index) => {
      setTimeout(() => {
        trail.el.style.left = lastX + "px";
        trail.el.style.top = lastY + "px";
      }, index * 10);
    });
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  // Hide cursor on interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, .btn, input",
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "40px";
      cursor.style.height = "40px";
      cursor.style.border = "2px solid #f39c12";
      cursor.style.backgroundColor = "rgba(243, 156, 18, 0.2)";
    });

    el.addEventListener("mouseleave", () => {
      cursor.style.width = "10px";
      cursor.style.height = "10px";
      cursor.style.border = "2px solid #f39c12";
      cursor.style.backgroundColor = "transparent";
    });
  });
}

/* ===== Loading Screen Animation ===== */
function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    engine.animate(loadingScreen, { opacity: 0 }, 800, "easeOutCubic", () => {
      loadingScreen.style.display = "none";
    });
  }
}

/* ===== Gradient Animation ===== */
function initGradientAnimation() {
  const gradientElements = document.querySelectorAll(
    ".header, .footer, .booking",
  );
  gradientElements.forEach((el) => {
    el.style.backgroundSize = "400% 400%";
    el.style.animation = "gradientShift 8s ease infinite";
  });
}

/* ===== Fade Animation on Load ===== */
function fadeInElements() {
  const elements = document.querySelectorAll("section, .header");
  elements.forEach((el, index) => {
    el.style.opacity = "0";
    setTimeout(() => {
      engine.animate(el, { opacity: 1 }, 600, "easeOutCubic");
    }, index * 100);
  });
}

/* ===== Zoom Animation on Scroll ===== */
function initZoomOnScroll() {
  const zoomElements = document.querySelectorAll("section img");

  window.addEventListener("scroll", () => {
    zoomElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const scrollPercent =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

      if (scrollPercent > 0 && scrollPercent < 1) {
        const scale = 1 + scrollPercent * 0.1;
        el.style.transform = `scale(${scale})`;
      }
    });
  });
}

/* ===== Slide Animation ===== */
function initSlideAnimation() {
  const slideElements = document.querySelectorAll(
    "section:nth-child(odd) > *:first-child",
  );
  slideElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-100px)";
    scrollReveal.observe([el]);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          engine.animate(entry.target, { opacity: 1 }, 800, "easeOutCubic");
          engine.animate(
            entry.target,
            { transform: "translateX(0)" },
            800,
            "easeOutCubic",
          );
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(el);
  });
}

/* ===== Initialize All Animations ===== */
function initializeAllAnimations() {
  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupAnimations();
    });
  } else {
    setupAnimations();
  }
}

function setupAnimations() {
  // Hide loading screen
  setTimeout(() => {
    hideLoadingScreen();
  }, 2000);

  // Initialize all animation features
  initFloatingImages();
  initRippleButtons();
  initHoverGlow();
  initCustomCursor();
  initGradientAnimation();
  fadeInElements();
  initZoomOnScroll();
  initSlideAnimation();

  // Setup scroll reveal for sections
  const revealElements = document.querySelectorAll("section");
  scrollReveal.observe(revealElements);

  // Parallax (with throttling for performance)
  let parallaxTimeout;
  window.addEventListener("load", () => {
    initParallax();
  });
}

// Start initialization
initializeAllAnimations();
