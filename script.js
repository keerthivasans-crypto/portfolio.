document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     THEME TOGGLER (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  // Set default theme or load saved preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggleBtn.addEventListener('click', () => {
    menuToggleBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggleBtn.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  /* ==========================================================================
     TYPING ANIMATION (HERO SUBTITLE)
     ========================================================================== */
  const typedTextSpan = document.getElementById('typed-text');
  const roles = ["ECE Student", "MATLAB Enthusiast", "Future Engineer", "Problem Solver"];
  const typingDelay = 100;
  const erasingDelay = 50;
  const newRoleDelay = 2000;
  let roleIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < roles[roleIndex].length) {
      typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newRoleDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, typingDelay + 500);
    }
  }

  // Init typing animation
  if (roles.length) setTimeout(type, 1000);

  /* ==========================================================================
     HEADER SCROLL EFFECT & ACTIVE NAVIGATION LINKS
     ========================================================================== */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Header shadow and padding adjustment
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Highlighting active link on scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     INTERSECTION OBSERVER FOR SCROLL REVEALS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Unobserve once animation triggers
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => revealObserver.observe(element));

  /* ==========================================================================
     DYNAMIC SKILL BAR PROGRESS ANIMATION
     ========================================================================== */
  const progressFills = document.querySelectorAll('.progress-fill');

  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetPercent = fill.getAttribute('data-percent');
        fill.style.width = targetPercent;
        observer.unobserve(fill);
      }
    });
  }, {
    threshold: 0.5
  });

  progressFills.forEach(fill => skillsObserver.observe(fill));

  /* ==========================================================================
     REAL-TIME FFT SPECTRUM SIMULATOR (MATLAB CARD CANVAS)
     ========================================================================== */
  const canvas = document.getElementById('fft-simulation-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationId;

    // Set matching canvas sizing dynamically
    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // FFT mathematical signal parameter models
    const numBars = 50;
    const barWidth = 6;
    const barGap = 4;
    let timePhase = 0;

    // Color gradient mapping based on active theme
    function getGradient() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
      if (isLight) {
        grad.addColorStop(0, '#2563eb'); // Blue
        grad.addColorStop(0.5, '#7c3aed'); // Violet
        grad.addColorStop(1, '#ec4899'); // Pink
      } else {
        grad.addColorStop(0, '#06b6d4'); // Cyan
        grad.addColorStop(0.6, '#8b5cf6'); // Purple
        grad.addColorStop(1, '#f43f5e'); // Rose
      }
      return grad;
    }

    function drawFFTSpectrum() {
      // Clear canvas context
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = getGradient();
      const midX = canvas.width / 2;
      const count = Math.min(numBars, Math.floor(canvas.width / (barWidth + barGap)));
      const startX = (canvas.width - (count * (barWidth + barGap))) / 2;

      timePhase += 0.04;

      for (let i = 0; i < count; i++) {
        // Construct composite frequency signal output using Fourier components:
        // A main center-aligned FFT signal peak, side lobes, and variable noise floor.
        const normalizedIndex = i / count;
        
        // Base noise floor
        let magnitude = 10 + Math.sin(timePhase * 2 + i * 0.1) * 4 + Math.random() * 5;
        
        // Form main FFT peak (e.g. representing spectrum frequency component spike)
        const peakPos = 0.45 + Math.sin(timePhase * 0.5) * 0.15; // Moving center frequency
        const peakWidth = 0.08;
        const distFromPeak = Math.abs(normalizedIndex - peakPos);
        if (distFromPeak < peakWidth) {
          const peakScale = (1 - distFromPeak / peakWidth);
          magnitude += Math.pow(peakScale, 2) * 120;
        }

        // Secondary harmonic peak
        const harmonicPos = (peakPos + 0.3) % 1.0;
        const distFromHarmonic = Math.abs(normalizedIndex - harmonicPos);
        if (distFromHarmonic < 0.05) {
          const harmonicScale = (1 - distFromHarmonic / 0.05);
          magnitude += Math.pow(harmonicScale, 2) * 45;
        }

        // Clip minimum and maximum values
        magnitude = Math.max(10, Math.min(canvas.height - 30, magnitude));

        // Draw individual frequency bin bar
        const x = startX + i * (barWidth + barGap);
        const y = canvas.height - magnitude - 10;
        
        ctx.fillStyle = gradient;
        
        // Draw rounded rectangle bars
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, magnitude, 3);
        ctx.fill();

        // Draw small floating peak tracker dots
        ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x, Math.max(0, y - 5), barWidth, 2);
      }

      // Draw bottom baseline axis
      ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 9);
      ctx.lineTo(canvas.width, canvas.height - 9);
      ctx.stroke();

      animationId = requestAnimationFrame(drawFFTSpectrum);
    }

    // Run FFT visual simulator
    drawFFTSpectrum();
  }

  /* ==========================================================================
     CONTACT FORM HANDLING & VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formMessageBanner = document.getElementById('form-message-banner');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = document.getElementById('form-submit-btn');

      // Simple validation state
      let isValid = true;
      formMessageBanner.className = 'form-message';
      formMessageBanner.style.display = 'none';

      // Reset individual border stylings
      [nameInput, emailInput, messageInput].forEach(input => {
        input.style.borderColor = '';
      });

      if (!nameInput.value.trim()) {
        nameInput.style.borderColor = 'hsl(0, 100%, 60%)';
        isValid = false;
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        emailInput.style.borderColor = 'hsl(0, 100%, 60%)';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageInput.style.borderColor = 'hsl(0, 100%, 60%)';
        isValid = false;
      }

      if (!isValid) {
        formMessageBanner.textContent = 'Please fill out all required fields with a valid email.';
        formMessageBanner.className = 'form-message';
        formMessageBanner.style.display = 'block';
        formMessageBanner.style.background = 'rgba(239, 68, 68, 0.15)';
        formMessageBanner.style.color = 'hsl(0, 100%, 65%)';
        formMessageBanner.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        return;
      }

      // Visual active loading state during form transmission simulation
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

      // Mock request response delay (1.5 seconds)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        formMessageBanner.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`;
        formMessageBanner.className = 'form-message success';
        
        // Clear all inputs
        contactForm.reset();
      }, 1500);
    });

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }
  }

  /* ==========================================================================
     BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top-btn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
        backToTopBtn.style.transform = 'translateY(0)';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transform = 'translateY(15px)';
      }
    });

    // Make transitions smooth for the button
    backToTopBtn.style.transition = 'opacity 0.3s, transform 0.3s, background-color 0.2s';
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.transform = 'translateY(15px)';
    backToTopBtn.style.pointerEvents = 'none';

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     RESUME BUTTON DUMMY DOWNLOAD FEEDBACK
     ========================================================================== */
  const resumeBtn = document.getElementById('resume-download-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      if (resumeBtn.getAttribute('href') === '#') {
        e.preventDefault();
        alert("This is a placeholder download button. You can link your 'Keerthi_Vasan_S_Resume.pdf' directly by placing the file in the portfolio folder.");
      }
    });
  }
});
