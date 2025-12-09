// Custom smooth scroll function
const smoothScrollTo = (targetPosition, duration = 800) => {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * easeProgress);
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

// Scroll indicator
window.addEventListener("scroll", () => {
  const scrollIndicator = document.getElementById("scrollIndicator");
  const windowHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollIndicator.style.width = scrolled + "%";
});

// Floating TOC functionality
const tocLinks = document.querySelectorAll(".toc-link");

// Smooth scroll to section
tocLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    
    // Handle "Top" link specially
    if (targetId === "#top") {
      smoothScrollTo(0);
      return;
    }
    
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const targetPosition = targetSection.offsetTop;
      smoothScrollTo(targetPosition);
    }
  });
});

// Highlight active section in TOC
const sections = document.querySelectorAll("section[id]");

const highlightActiveSection = () => {
  const scrollPosition = window.scrollY + 150;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      tocLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
};

window.addEventListener("scroll", highlightActiveSection);
highlightActiveSection(); // Initial call

// TOC collapse/expand functionality
const tocMenu = document.getElementById('tocMenu');
const tocToggle = document.getElementById('tocToggle');
const tocClose = document.getElementById('tocClose');

if (tocToggle && tocMenu && tocClose) {
  tocToggle.addEventListener('click', () => {
    tocMenu.classList.remove('collapsed');
  });

  tocClose.addEventListener('click', () => {
    tocMenu.classList.add('collapsed');
  });
}

// Show/hide floating TOC based on scroll position
const floatingToc = document.getElementById('floatingToc');
const topNav = document.getElementById('topNav');
const topNavLinks = document.querySelectorAll('.top-nav-link');

const handleTocVisibility = () => {
  if (!floatingToc || !topNav) return;
  
  // Get the bottom position of the top nav relative to the document
  const topNavBottom = topNav.offsetTop + topNav.offsetHeight;
  const scrollPosition = window.scrollY;
  
  // Show floating TOC when scrolled past the top nav
  if (scrollPosition > topNavBottom) {
    floatingToc.classList.add('visible');
  } else {
    floatingToc.classList.remove('visible');
  }
};

// Update active link in top nav
const updateTopNavActive = () => {
  const scrollPosition = window.scrollY + 150;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      topNavLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
};

// Smooth scroll for top nav links
topNavLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const targetPosition = targetSection.offsetTop;
      smoothScrollTo(targetPosition);
    }
  });
});

window.addEventListener('scroll', () => {
  handleTocVisibility();
  updateTopNavActive();
});

handleTocVisibility(); // Initial check
updateTopNavActive(); // Initial active state

// Add entrance animations on scroll
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

document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});

// Metrics horizontal scroll navigation
const metricsGrid = document.querySelector(".metrics-grid");
const scrollLeftBtn = document.getElementById("metricsScrollLeft");
const scrollRightBtn = document.getElementById("metricsScrollRight");

if (metricsGrid && scrollLeftBtn && scrollRightBtn) {
  const getScrollAmount = () => {
    // Scroll by approximately one card width
    return metricsGrid.offsetWidth - 100;
  };

  const updateButtonStates = () => {
    const scrollLeft = metricsGrid.scrollLeft;
    const maxScroll = metricsGrid.scrollWidth - metricsGrid.clientWidth;

    // Disable/enable buttons based on scroll position
    if (scrollLeft <= 5) {
      scrollLeftBtn.classList.add("disabled");
    } else {
      scrollLeftBtn.classList.remove("disabled");
    }

    if (scrollLeft >= maxScroll - 5) {
      scrollRightBtn.classList.add("disabled");
    } else {
      scrollRightBtn.classList.remove("disabled");
    }
  };

  let isScrolling = false;

  const smoothScroll = (targetPosition) => {
    if (isScrolling) return;

    isScrolling = true;

    // Temporarily disable snap during animation
    metricsGrid.style.scrollSnapType = "none";

    const start = metricsGrid.scrollLeft;
    const distance = targetPosition - start;
    const startTime = performance.now();
    const duration = 600; // Linear animation duration

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Linear easing - no transformation, just progress as-is

      metricsGrid.scrollLeft = start + distance * progress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Re-enable snap after animation completes
        metricsGrid.style.scrollSnapType = "x mandatory";
        isScrolling = false;
        updateButtonStates();
      }
    };

    requestAnimationFrame(animateScroll);
  };

  scrollLeftBtn.addEventListener("click", () => {
    const targetPosition = Math.max(
      0,
      metricsGrid.scrollLeft - getScrollAmount(),
    );
    smoothScroll(targetPosition);
  });

  scrollRightBtn.addEventListener("click", () => {
    const maxScroll = metricsGrid.scrollWidth - metricsGrid.clientWidth;
    const targetPosition = Math.min(
      maxScroll,
      metricsGrid.scrollLeft + getScrollAmount(),
    );
    smoothScroll(targetPosition);
  });

  // Update button states on scroll
  metricsGrid.addEventListener("scroll", updateButtonStates);

  // Initial state
  updateButtonStates();

  // Update on window resize
  window.addEventListener("resize", updateButtonStates);

  // Dynamically adjust grid height based on visible card
  const metricCards = document.querySelectorAll(".metric-card");

  const updateGridHeight = () => {
    if (!metricsGrid || metricCards.length === 0) return;

    // Find which card is currently most visible
    const gridRect = metricsGrid.getBoundingClientRect();
    let mostVisibleCard = null;
    let maxVisibleWidth = 0;

    metricCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const visibleLeft = Math.max(cardRect.left, gridRect.left);
      const visibleRight = Math.min(cardRect.right, gridRect.right);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);

      if (visibleWidth > maxVisibleWidth) {
        maxVisibleWidth = visibleWidth;
        mostVisibleCard = card;
      }
    });

    if (mostVisibleCard) {
      const cardHeight = mostVisibleCard.offsetHeight;
      metricsGrid.style.height = cardHeight + "px";
    }
  };

  // Update height on scroll
  metricsGrid.addEventListener("scroll", updateGridHeight);

  // Update height on window resize
  window.addEventListener("resize", updateGridHeight);

  // Initial height
  updateGridHeight();

  // Update after images load
  window.addEventListener("load", updateGridHeight);
}
