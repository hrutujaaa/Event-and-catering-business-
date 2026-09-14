// /* ===== Events Page Animations ===== */

// class EventsPageAnimations {
//   constructor() {
//     this.eventCards = document.querySelectorAll(".event");
//     this.init();
//   }

//   init() {
//     this.setupCardAnimations();
//     this.setupHoverEffects();
//     this.setupScrollAnimations();
//     this.setupImageEffects();
//   }

//   // Setup card animations on load
//   setupCardAnimations() {
//     this.eventCards.forEach((card, index) => {
//       card.style.opacity = "0";
//       card.style.transform = "translateY(30px)";

//       setTimeout(() => {
//         card.style.transition = "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
//         card.style.opacity = "1";
//         card.style.transform = "translateY(0)";
//       }, index * 100);
//     });
//   }

//   // Hover effects for cards
//   setupHoverEffects() {
//     this.eventCards.forEach((card) => {
//       card.addEventListener("mouseenter", () => {
//         this.animateCardHover(card, true);
//       });

//       card.addEventListener("mouseleave", () => {
//         this.animateCardHover(card, false);
//       });

//       // Add ripple effect on click
//       card.addEventListener("click", (e) => {
//         this.createRipple(e, card);
//       });
//     });
//   }

//   // Animate card on hover
//   animateCardHover(card, isHovering) {
//     const image = card.querySelector("img");
//     const title = card.querySelector("h3");

//     if (isHovering) {
//       card.style.transform = "translateY(-15px) scale(1.02)";
//       card.style.boxShadow = "0 15px 40px rgba(243, 156, 18, 0.25)";

//       if (image) {
//         image.style.transform = "scale(1.1) rotate(0.5deg)";
//         image.style.filter = "brightness(1.1)";
//       }

//       if (title) {
//         title.style.color = "#f39c12";
//         title.style.transition = "color 0.3s ease";
//       }
//     } else {
//       card.style.transform = "translateY(0) scale(1)";
//       card.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";

//       if (image) {
//         image.style.transform = "scale(1) rotate(0deg)";
//         image.style.filter = "brightness(1)";
//       }

//       if (title) {
//         title.style.color = "#2c3e50";
//       }
//     }
//   }

//   // Create ripple effect
//   createRipple(event, card) {
//     const ripple = document.createElement("span");
//     const rect = card.getBoundingClientRect();
//     const size = Math.max(rect.width, rect.height);
//     const x = event.clientX - rect.left - size / 2;
//     const y = event.clientY - rect.top - size / 2;

//     ripple.style.width = ripple.style.height = size + "px";
//     ripple.style.left = x + "px";
//     ripple.style.top = y + "px";
//     ripple.className = "event-ripple";
//     ripple.style.position = "absolute";
//     ripple.style.borderRadius = "50%";
//     ripple.style.backgroundColor = "rgba(243, 156, 18, 0.6)";
//     ripple.style.pointerEvents = "none";
//     ripple.style.animation = "eventRipple 0.6s ease-out";

//     card.style.position = "relative";
//     card.style.overflow = "hidden";
//     card.appendChild(ripple);

//     setTimeout(() => ripple.remove(), 600);
//   }

//   // Scroll animations
//   setupScrollAnimations() {
//     const observerOptions = {
//       threshold: 0.1,
//       rootMargin: "0px 0px -50px 0px",
//     };

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           this.animateCardOnScroll(entry.target);
//           observer.unobserve(entry.target);
//         }
//       });
//     }, observerOptions);

//     this.eventCards.forEach((card) => observer.observe(card));
//   }

//   // Animate card when scrolled into view
//   animateCardOnScroll(card) {
//     card.style.animation = "slideUp 0.6s ease-out";
//   }

//   // Image effects
//   setupImageEffects() {
//     this.eventCards.forEach((card, index) => {
//       const image = card.querySelector("img");
//       if (image) {
//         // Add parallax effect on mouse move
//         card.addEventListener("mousemove", (e) => {
//           this.parallaxImage(e, image, card);
//         });

//         card.addEventListener("mouseleave", () => {
//           image.style.transform = "translate(0, 0) scale(1)";
//         });
//       }
//     });
//   }

//   // Parallax image effect
//   parallaxImage(e, image, card) {
//     const rect = card.getBoundingClientRect();
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;
//     const x = e.clientX - rect.left - centerX;
//     const y = e.clientY - rect.top - centerY;

//     const moveX = (x / centerX) * 10;
//     const moveY = (y / centerY) * 10;

//     image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
//   }
// }

// // Initialize when DOM is loaded
// document.addEventListener("DOMContentLoaded", () => {
//   new EventsPageAnimations();

//   // Animate page title
//   const pageTitle = document.querySelector("h2");
//   if (pageTitle) {
//     pageTitle.style.opacity = "0";
//     pageTitle.style.transform = "translateY(-30px)";
//     setTimeout(() => {
//       pageTitle.style.transition = "all 0.6s ease-out";
//       pageTitle.style.opacity = "1";
//       pageTitle.style.transform = "translateY(0)";
//     }, 100);
//   }

//   // Add ripple animation keyframe dynamically
//   const style = document.createElement("style");
//   style.textContent = `
//         @keyframes eventRipple {
//             to {
//                 transform: scale(4);
//                 opacity: 0;
//             }
//         }
//     `;
//   document.head.appendChild(style);
// });

// // Mouse follow animation for cards
// document.addEventListener("mousemove", (e) => {
//   const eventCards = document.querySelectorAll(".event");
//   eventCards.forEach((card) => {
//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const isNear =
//       x > -100 && x < rect.width + 100 && y > -100 && y < rect.height + 100;

//     if (isNear) {
//       const rotateX = (y / rect.height - 0.5) * 5;
//       const rotateY = (x / rect.width - 0.5) * 5;
//       card.style.perspective = "1000px";
//       card.style.transformStyle = "preserve-3d";
//     }
//   });
// });

// // Smooth scroll to sections
// const navLinks = document.querySelectorAll(".nav-links a");
// navLinks.forEach((link) => {
//   link.addEventListener("click", (e) => {
//     const href = link.getAttribute("href");
//     if (href.startsWith("#")) {
//       e.preventDefault();
//       const target = document.querySelector(href);
//       if (target) {
//         target.scrollIntoView({ behavior: "smooth" });
//       }
//     }
//   });
// });

// // Add active state to current nav item
// window.addEventListener("load", () => {
//   const navLinks = document.querySelectorAll(".nav-links a");
//   navLinks.forEach((link) => {
//     if (link.href.includes("events")) {
//       link.classList.add("active");
//     }
//   });
// });

// // Intersection Observer for fade-in on scroll
// const observerOptions = {
//   threshold: 0.1,
//   rootMargin: "0px 0px -50px 0px",
// };

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       entry.target.style.animation = "fadeIn 0.6s ease-out";
//       observer.unobserve(entry.target);
//     }
//   });
// }, observerOptions);

// // Observe all event cards
// document.querySelectorAll(".event").forEach((card) => {
//   observer.observe(card);
// });
