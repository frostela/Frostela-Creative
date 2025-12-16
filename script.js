// ---------------------------------------------------------- Hover Sound ------------------
document.addEventListener("DOMContentLoaded", () => {
  const hoverElements = document.getElementsByClassName('sound1');
  const hoversSound = document.getElementById('hoverSound');

  if (hoversSound) {
    hoversSound.volume = 0.3;

    Array.from(hoverElements).forEach(element => {
      element.addEventListener('mouseover', () => {
        hoversSound.currentTime = 0;
        hoversSound.play().catch(() => { });
      });
    });
  }

  // --------------------------------------------------- Card Hover Sound ------------------------------------------------------------

  const cards = document.querySelectorAll(".card");
  const hoverSound = new Audio("./contents/sounds/card-flipping.mp3");
  hoverSound.preload = "auto";

  function playSound(audio) {
    const clone = audio.cloneNode();
    clone.play().catch(() => { });
  }

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      if (!card.classList.contains("flipped")) {
        playSound(hoverSound);
      } else {
        playSound(hoverSound);
      }
    });
  });


  // ---------------------------------------------------------------- Lenis Smooth Scroll ---------------------------------------------------------
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.7,
    duration: 0.9,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    smoothTouch: true,
    autoRaf: false, // we control raf manually
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ------------------------------------------------------------ GSAP + SplitType Animations --------------------------------------------------------------

  gsap.registerPlugin(ScrollTrigger);

  // Animation A: Fade Words --------------------------------------

  let typeSplit = new SplitType('[animate]', {
    types: 'lines, words, chars',
    tagName: 'span'
  })

  gsap.from('[animate] .word', {
    y: '100%',
    opacity: 1,
    duration: 0.5,
    ease: 'power1.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '[animate]',
      start: 'top 100%',
      end: 'bottom 60%',
      scrub: true
    }

  })

  // Animation B: Reveal Lines ---------------------------------------------------------

  let typeSplit2 = new SplitType('[animate2]', {
    types: 'lines, words, chars',
    tagName: 'span'
  })

  gsap.from('[animate2] .word', {
    y: '110%',
    opacity: 0,
    rotationZ: '10',
    duration: 0.11,
    ease: 'power1.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '[animate2]',
      start: 'top 100%',
      end: 'bottom 60%',
      scrub: true
    }

  })



    // -------------------------------------------------------------------- Contact Form ------------------

    (function () {
      emailjs.init({ publicKey: "2KE1Abs0nB-KGgJcv" });
    })();

  const form = document.getElementById('contact-form');
  const ok = document.getElementById('ok');
  const fields = {
    first: document.querySelector('#firstName input'),
    last: document.querySelector('#lastName input'),
    email: document.getElementById('email'),
    msg: document.getElementById('message')
  };
  const errors = {
    first: document.getElementById('err-first'),
    last: document.getElementById('err-last'),
    email: document.getElementById('err-email'),
    msg: document.getElementById('err-msg')
  };

  function showError(el, errEl, cond) {
    errEl.style.display = cond ? 'block' : 'none';
    if (cond) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  }

  function validate() {
    const v = {
      first: !fields.first.value.trim(),
      last: !fields.last.value.trim(),
      email: !fields.email.validity.valid,
      msg: fields.msg.value.trim().length < 20
    };
    showError(fields.first, errors.first, v.first);
    showError(fields.last, errors.last, v.last);
    showError(fields.email, errors.email, v.email);
    showError(fields.msg, errors.msg, v.msg);
    return !(v.first || v.last || v.email || v.msg);
  }

  form.addEventListener('input', validate);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await emailjs.send('service_mxshe2e', 'template_jtx8c18', {
        firstName: fields.first.value,
        lastName: fields.last.value,
        email: fields.email.value,
        message: fields.msg.value
      });
      ok.style.display = 'inline';
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Failed to send. Please try again.');
    }
  });
});



// When the user clicks on the button, toggle between hiding and showing the dropdown content -----------------------------------------------------


// ---------------------- Toggle reason paragraphs ----------------------
function initializeEverything() {
  // Click functionality
  document.querySelectorAll(".reason").forEach(reason => {
    const paragraph = reason.querySelector("p");

    // Add click event to the entire .reason div instead of just .click-heading
    reason.addEventListener("click", (e) => {
      e.stopPropagation();

      // Close others
      document.querySelectorAll(".reason p").forEach(p => {
        if (p !== paragraph) p.classList.remove("show");
      });

      // Toggle current
      paragraph.classList.toggle("show");
    });
  });

  // Outside click to close
  document.addEventListener("click", () => {
    document.querySelectorAll(".reason p").forEach(p => p.classList.remove("show"));
  });

  // Viewport animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle("show", entry.isIntersecting);
    });
  }, { threshold: 0.1, rootMargin: "-10% 0px" });

  document.querySelectorAll(".grow-widths").forEach(el => observer.observe(el));
}

// Proper DOM ready check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEverything);
} else {
  initializeEverything();
}


// Skills Section Animation--------------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
  const floatingIcons = document.querySelectorAll('.floating-icon');
  const skillsSection = document.querySelector('.skills-section');

  // Store positions to prevent overlaps
  let usedPositions = [];
  const iconSize = 80; // Increase buffer zone around icons
  const minDistance = 100; // Minimum distance between icons

  // Check if two positions overlap
  function isOverlapping(newPos, existingPositions, buffer = minDistance) {
    for (let pos of existingPositions) {
      const distance = Math.sqrt(
        Math.pow(newPos.x - pos.x, 2) + Math.pow(newPos.y - pos.y, 2)
      );
      if (distance < buffer) {
        return true;
      }
    }
    return false;
  }

  // Enhanced random positioning with overlap prevention
  function getRandomPosition() {
    const sectionWidth = skillsSection.offsetWidth;
    const sectionHeight = skillsSection.offsetHeight;

    const centerX = sectionWidth / 2;
    const centerY = sectionHeight / 2;
    const exclusionWidth = 500; // Title exclusion zone
    const exclusionHeight = 200;

    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loop

    while (attempts < maxAttempts) {
      let x = gsap.utils.random(iconSize, sectionWidth - iconSize);
      let y = gsap.utils.random(iconSize, sectionHeight - iconSize);

      // Check if position is in title exclusion zone
      const inTitleZone = (
        x > centerX - exclusionWidth / 2 &&
        x < centerX + exclusionWidth / 2 &&
        y > centerY - exclusionHeight / 2 &&
        y < centerY + exclusionHeight / 2
      );

      // If not in title zone and doesn't overlap with existing positions
      if (!inTitleZone && !isOverlapping({ x, y }, usedPositions)) {
        return { x, y };
      }

      attempts++;
    }

    // Fallback: use grid-based positioning if random fails
    return getGridPosition();
  }

  // Fallback grid-based positioning
  function getGridPosition() {
    const sectionWidth = skillsSection.offsetWidth;
    const sectionHeight = skillsSection.offsetHeight;

    const cols = 4;
    const rows = 3;
    const cellWidth = sectionWidth / cols;
    const cellHeight = sectionHeight / rows;

    // Find next available grid position
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Skip center cells (title area)
        if ((row === 1) && (col === 1 || col === 2)) continue;

        const x = col * cellWidth + gsap.utils.random(cellWidth * 0.2, cellWidth * 0.8);
        const y = row * cellHeight + gsap.utils.random(cellHeight * 0.2, cellHeight * 0.8);

        if (!isOverlapping({ x, y }, usedPositions, minDistance * 0.8)) {
          return { x, y };
        }
      }
    }

    // Ultimate fallback: corners
    const corners = [
      { x: 100, y: 100 },
      { x: sectionWidth - 100, y: 100 },
      { x: 100, y: sectionHeight - 100 },
      { x: sectionWidth - 100, y: sectionHeight - 100 }
    ];

    return corners[usedPositions.length % corners.length];
  }

  // Initialize floating animation for each element
  function initializeFloatingAnimation(element, index) {
    const position = getRandomPosition();

    // Store this position
    usedPositions.push(position);

    // Set initial position
    gsap.set(element, {
      left: position.x,
      top: position.y,
      opacity: 0
    });

    // Parse floating data
    const json = element.dataset.gsapFloating;
    const data = JSON.parse(json || '{}');

    const xpos = data.x || 20;
    const ypos = data.y || 20;
    const speedx = data.speedx || 3;
    const speedy = data.speedy || 3;

    // Animate in with stagger
    gsap.to(element, {
      opacity: 1,
      duration: 0.8,
      delay: index * 0.2, // Slightly longer stagger
      ease: "power2.out"
    });

    // Add hover effects
    element.addEventListener('mouseenter', () => {
      gsap.to(element, { scale: 1.2, duration: 0.3, ease: "power2.out" });
    });

    element.addEventListener('mouseleave', () => {
      gsap.to(element, { scale: 1, duration: 0.3, ease: "power2.out" });
    });

    // Create floating timeline
    const floatingTimeline = gsap.timeline({
      defaults: {
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }
    });

    // Floating animation (reduced movement to prevent overlapping during animation)
    floatingTimeline
      .fromTo(element,
        { x: -xpos / 3 }, // Reduced movement range
        { x: xpos / 3, duration: speedx }, 0
      )
      .fromTo(element,
        { y: -ypos / 3 }, // Reduced movement range
        { y: ypos / 3, duration: speedy }, 0
      );
  }

  // Initialize all floating icons
  floatingIcons.forEach((element, index) => {
    const img = element.querySelector('.skill-image');
    if (img) {
      if (img.complete) {
        initializeFloatingAnimation(element, index);
      } else {
        img.onload = () => {
          initializeFloatingAnimation(element, index);
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${img.src}`);
          initializeFloatingAnimation(element, index);
        };
      }
    } else {
      initializeFloatingAnimation(element, index);
    }
  });

  // Title animation
  gsap.fromTo('.skills-title',
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.skills-section',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  // Enhanced resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Reset positions array
      usedPositions = [];

      floatingIcons.forEach((element, index) => {
        const position = getRandomPosition();
        usedPositions.push(position);

        gsap.set(element, {
          left: position.x,
          top: position.y
        });
      });
    }, 250);
  });
});



