document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const contactForm = document.getElementById("contact-form");

  const themeToggle = document.getElementById("theme-toggle");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    // Optional: save preference
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // Load theme from localStorage
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  }

  // Mobile menu toggle
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Navbar scroll effect
  let lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
  });

  // Active navigation link highlighting
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));
        if (navLink) {
          navLink.classList.add("active");
        }
      }
    });
  }

  // Throttled scroll event for performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }

  function updateScrollEffects() {
    updateActiveNavLink();
    ticking = false;
  }

  window.addEventListener("scroll", requestTick);

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Scroll indicator functionality
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", function () {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = aboutSection.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  }

  // Contact form handling
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

      // Basic validation
      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all fields.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }

      // Simulate form submission
      showNotification(
        "Thank you for your message! I'll get back to you soon.",
        "success"
      );
      this.reset();
    });
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

    // Add styles
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 1.5rem",
      borderRadius: "0.5rem",
      color: "white",
      fontWeight: "500",
      zIndex: "9999",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      minWidth: "300px",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
    });

    // Set background color based on type
    const colors = {
      success: "#10b981",
      error: "#ef4444",
      info: "#6366f1",
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add close button styles
    const closeButton = notification.querySelector(".notification-close");
    Object.assign(closeButton.style, {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "1.5rem",
      cursor: "pointer",
      padding: "0",
      lineHeight: "1",
    });

    // Add to document
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 10);

    // Auto remove after 5 seconds
    const autoRemoveTimer = setTimeout(() => {
      removeNotification(notification);
    }, 5000);

    // Manual close functionality
    closeButton.addEventListener("click", () => {
      clearTimeout(autoRemoveTimer);
      removeNotification(notification);
    });
  }

  function removeNotification(notification) {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".project-card, .skill-card, .stat"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Typing animation for hero subtitle
  const heroSubtitle = document.querySelector(".hero-subtitle");
  if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = "";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        heroSubtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }

    // Start typing animation after page load
    setTimeout(typeWriter, 1000);
  }

  // Add loading animation
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });

  // Parallax effect for hero section
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", function () {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }

  // Project card hover effects
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Console welcome message
  console.log(
    "%c🚀 Welcome to Saroj Kumar Das Portfolio!",
    "color: #6366f1; font-size: 16px; font-weight: bold;"
  );
  console.log(
    "%cThanks for checking out the code! Feel free to reach out if you have any questions.",
    "color: #10b981; font-size: 14px;"
  );
});

// Additional utility functions
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

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Performance optimization
if ("requestIdleCallback" in window) {
  requestIdleCallback(function () {
    // Preload critical images
    const criticalImages = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=600&fit=crop",
    ];

    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  });
}
