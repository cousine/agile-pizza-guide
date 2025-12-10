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

// ===== Cookie Consent & Analytics Tracking =====

// Cookie consent management
const cookieConsent = document.getElementById('cookieConsent');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');
const cookieModal = document.getElementById('cookieModal');
const cookieLearnMore = document.getElementById('cookieLearnMore');
const cookieModalClose = document.getElementById('cookieModalClose');
const cookieModalAccept = document.getElementById('cookieModalAccept');
const cookieSettings = document.getElementById('cookieSettings');

// Check if user has already made a choice
const getCookieConsent = () => {
  return localStorage.getItem('cookieConsent');
};

const setCookieConsent = (value) => {
  localStorage.setItem('cookieConsent', value);
};

const grantConsent = () => {
  if (typeof gtag !== 'undefined') {
    gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
  }
};

const denyConsent = () => {
  if (typeof gtag !== 'undefined') {
    gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }
};

// Show banner if no consent choice has been made
const consent = getCookieConsent();
if (!consent) {
  setTimeout(() => {
    cookieConsent.classList.add('show');
  }, 1000);
} else if (consent === 'accepted') {
  grantConsent();
  cookieSettings.classList.add('show');
} else {
  cookieSettings.classList.add('show');
}

// Accept button handler
const handleAccept = () => {
  setCookieConsent('accepted');
  grantConsent();
  cookieConsent.classList.remove('show');
  cookieModal.classList.remove('show');
  cookieSettings.classList.add('show');
  
  // Track consent acceptance
  if (typeof gtag !== 'undefined') {
    gtag('event', 'cookie_consent_accepted', {
      event_category: 'engagement',
      event_label: 'Cookie Consent'
    });
  }
};

// Decline button handler
const handleDecline = () => {
  setCookieConsent('declined');
  denyConsent();
  cookieConsent.classList.remove('show');
  cookieSettings.classList.add('show');
  
  // Track consent decline (anonymously)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'cookie_consent_declined', {
      event_category: 'engagement',
      event_label: 'Cookie Consent'
    });
  }
};

// Event listeners
if (cookieAccept) cookieAccept.addEventListener('click', handleAccept);
if (cookieDecline) cookieDecline.addEventListener('click', handleDecline);
if (cookieModalAccept) cookieModalAccept.addEventListener('click', handleAccept);

// Learn more modal
if (cookieLearnMore) {
  cookieLearnMore.addEventListener('click', (e) => {
    e.preventDefault();
    cookieModal.classList.add('show');
  });
}

if (cookieModalClose) {
  cookieModalClose.addEventListener('click', () => {
    cookieModal.classList.remove('show');
  });
}

// Close modal on outside click
if (cookieModal) {
  cookieModal.addEventListener('click', (e) => {
    if (e.target === cookieModal) {
      cookieModal.classList.remove('show');
    }
  });
}

// Settings button - reopen consent banner
if (cookieSettings) {
  cookieSettings.addEventListener('click', () => {
    cookieConsent.classList.add('show');
  });
}

// ===== Custom Analytics Tracking =====

// Helper function to safely track events
const trackEvent = (eventName, params = {}) => {
  if (typeof gtag !== 'undefined' && getCookieConsent() === 'accepted') {
    gtag('event', eventName, params);
  }
};

// 1. Section View Tracking (when user scrolls to a section)
const trackSectionViews = () => {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        const sectionTitle = entry.target.querySelector('h2')?.textContent || sectionId;
        
        trackEvent('section_view', {
          event_category: 'engagement',
          event_label: sectionTitle,
          section_id: sectionId
        });
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px'
  });

  // Observe all sections
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
};

// 2. Navigation & TOC Click Tracking
const trackNavigationClicks = () => {
  // Track top nav clicks
  topNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetSection = link.getAttribute('href');
      const linkText = link.textContent;
      
      trackEvent('navigation_click', {
        event_category: 'navigation',
        event_label: linkText,
        link_target: targetSection,
        navigation_type: 'top_nav'
      });
    });
  });

  // Track TOC clicks
  tocLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetSection = link.getAttribute('href');
      const linkText = link.textContent;
      
      trackEvent('navigation_click', {
        event_category: 'navigation',
        event_label: linkText,
        link_target: targetSection,
        navigation_type: 'toc'
      });
    });
  });

  // Track TOC open/close
  if (tocToggle) {
    tocToggle.addEventListener('click', () => {
      trackEvent('toc_opened', {
        event_category: 'interaction',
        event_label: 'Table of Contents'
      });
    });
  }

  if (tocClose) {
    tocClose.addEventListener('click', () => {
      trackEvent('toc_closed', {
        event_category: 'interaction',
        event_label: 'Table of Contents'
      });
    });
  }

  // Track metrics carousel interactions
  if (scrollLeftBtn) {
    scrollLeftBtn.addEventListener('click', () => {
      trackEvent('metrics_scroll', {
        event_category: 'interaction',
        event_label: 'Metrics Carousel',
        scroll_direction: 'left'
      });
    });
  }

  if (scrollRightBtn) {
    scrollRightBtn.addEventListener('click', () => {
      trackEvent('metrics_scroll', {
        event_category: 'interaction',
        event_label: 'Metrics Carousel',
        scroll_direction: 'right'
      });
    });
  }
};

// 3. Engagement Metrics - Time spent on page
const trackEngagementTime = () => {
  let startTime = Date.now();
  let lastActivityTime = Date.now();
  let isActive = true;

  // Track time when user leaves or closes tab
  const sendEngagementTime = () => {
    const totalTime = Math.round((Date.now() - startTime) / 1000); // in seconds
    const activeTime = Math.round((lastActivityTime - startTime) / 1000);
    
    trackEvent('engagement_time', {
      event_category: 'engagement',
      event_label: 'Time on Page',
      value: totalTime,
      active_time: activeTime
    });
  };

  // Track activity
  const trackActivity = () => {
    lastActivityTime = Date.now();
    isActive = true;
  };

  // Listen for user activity
  ['scroll', 'click', 'keypress', 'mousemove'].forEach((eventType) => {
    document.addEventListener(eventType, trackActivity);
  });

  // Send engagement time on page exit
  window.addEventListener('beforeunload', sendEngagementTime);

  // Send periodic updates every 30 seconds
  setInterval(() => {
    if (isActive) {
      sendEngagementTime();
      isActive = false; // Reset until next activity
    }
  }, 30000);
};

// 4. Outbound Link Tracking
const trackOutboundLinks = () => {
  // Track all external links (particularly the footer link to cousine.me)
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const linkText = link.textContent.trim();
      
      // Check if it's truly an outbound link (not same domain)
      if (!href.includes(window.location.hostname)) {
        trackEvent('outbound_link_click', {
          event_category: 'outbound',
          event_label: linkText,
          link_url: href
        });
      }
    });
  });
};

// Initialize all tracking (only if consent is given)
if (getCookieConsent() === 'accepted') {
  trackSectionViews();
  trackNavigationClicks();
  trackEngagementTime();
  trackOutboundLinks();
}

// Also initialize tracking when user accepts consent
const originalHandleAccept = handleAccept;
const handleAcceptWithTracking = () => {
  originalHandleAccept();
  // Initialize tracking after consent
  setTimeout(() => {
    trackSectionViews();
    trackNavigationClicks();
    trackEngagementTime();
    trackOutboundLinks();
  }, 100);
};

// Replace the event listeners with the new handler
if (cookieAccept) {
  cookieAccept.removeEventListener('click', handleAccept);
  cookieAccept.addEventListener('click', handleAcceptWithTracking);
}
if (cookieModalAccept) {
  cookieModalAccept.removeEventListener('click', handleAccept);
  cookieModalAccept.addEventListener('click', handleAcceptWithTracking);
}
