
const hoverElements = document.getElementsByClassName('sound1');
const hoverSound = document.getElementById('hoverSound');

hoverSound.volume = 0.3; // adjust volume here 🎵

Array.from(hoverElements).forEach(element => {
  element.addEventListener('mouseover', function () {
    hoverSound.currentTime = 0; // restart from beginning
    hoverSound.play();
  });

  // element.addEventListener('mouseleave', function () {
  //     hoverSound.pause();
  //     hoverSound.currentTime = 0; // reset to beginning
  // });
});

// Reasons Drag

const slider = document.querySelector('.reasons');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; // *2 = scroll speed multiplier
  slider.scrollLeft = scrollLeft - walk;
});

// Card flipping 

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card-inner");
  const cardsSection = document.querySelector("#cards");

  function playSound(path) {
    const sound = new Audio(path);
    sound.play();
  }

  // Scroll-based flipping
  window.addEventListener("scroll", () => {
    const sectionBottom = cardsSection.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    if (sectionBottom <= windowHeight + 50) {
      cards.forEach((card, i) => {
        setTimeout(() => {
          if (!card.classList.contains("flipped")) {
            card.classList.add("flipped");
            playSound("./contents/sounds/card-flipping.mp3");
          }
        }, i * 300);
      });
    } else {
      cards.forEach((card, i) => {
        setTimeout(() => {
          if (card.classList.contains("flipped")) {
            card.classList.remove("flipped");
            playSound("./contents/sounds/card-flipping.mp3");
          }
        }, i * 300);
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  // Preload hover sound
  const hoverSound = new Audio("./contents/sounds/card-flipping.mp3");
  hoverSound.preload = "auto";

  function playSound(audio) {
    const clone = audio.cloneNode();
    clone.play().catch(() => { });
  }

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      // Only play if card is NOT already flipped
      if (!card.classList.contains("flipped")) {
        playSound(hoverSound);
      }
      else
        playSound();
    });
  });
});

// Lenis Scroll

// Initialize Lenis
const lenis = new Lenis({
  autoRaf: false,  // let us control raf manually for GSAP sync
  duration: 1.4,
  easing: (t) => 1 - Math.pow(1 - t, 3),
  smoothWheel: true,
  smoothTouch: true,
});

// RAF loop
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)


document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger)

  const container = document.querySelector('.website-list');
  const totalShift = container.scrollWidth - window.innerWidth;

  gsap.to(container, {
    x: -totalShift,
    ease: "none",
    scrollTrigger: {
      trigger: ".sticky-section",
      start: "top top",
      end: () => `+=${totalShift}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1
    }
  });

  // Helper: split element text into words and characters
  function splitToWordsAndChars(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';

    const wordsData = text.split(/\s+/).map((w) => {
      const word = document.createElement('span');
      word.className = 'word';

      const chars = [...w].map((c) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = c;
        word.appendChild(span);
        return span;
      });

      // Keep spacing fidelity using nbsp
      const space = document.createElement('span');
      space.className = 'space';
      space.textContent = '\u00A0';
      word.appendChild(space);

      el.appendChild(word);
      return { word, chars };
    });

    // Remove trailing space from last word
    const lastSpace = el.querySelector('.word:last-child .space');
    if (lastSpace) lastSpace.remove();

    return wordsData;
  }

  // Helper: wrap visual lines by grouping words with the same offsetTop
  function wrapLines(el) {
    const words = Array.from(el.querySelectorAll('.word'));
    const lines = [];
    let currentLine = [];
    let currentTop = null;

    words.forEach((w) => {
      const top = w.offsetTop;
      if (currentTop === null) currentTop = top;

      if (Math.abs(top - currentTop) > 2) {
        const lineWrap = document.createElement('span');
        lineWrap.className = 'line';
        el.insertBefore(lineWrap, currentLine[0]);
        currentLine.forEach((n) => lineWrap.appendChild(n));
        lines.push(lineWrap);

        currentLine = [w];
        currentTop = top;
      } else {
        currentLine.push(w);
      }
    });

    if (currentLine.length) {
      const lineWrap = document.createElement('span');
      lineWrap.className = 'line';
      el.insertBefore(lineWrap, currentLine[0]);
      currentLine.forEach((n) => lineWrap.appendChild(n));
      lines.push(lineWrap);
    }

    return lines;
  }

  // Initialize GSAP text reveal with ScrollTrigger
  function initSplitReveal() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.split-line-anim .reveal').forEach((heading) => {
      splitToWordsAndChars(heading);
      wrapLines(heading);

      const chars = heading.querySelectorAll('.char');

      gsap.set(chars, {
        y: 60,
        opacity: 0,
        rotate: 6,
        skewY: 6,
        transformOrigin: '0% 100%',
      });

      gsap.to(chars, {
        y: 0,
        opacity: 1,
        rotate: 0,
        skewY: 0,
        duration: 0.8,
        ease: 'circ.out',
        stagger: { each: 0.02, from: 'start' },
        scrollTrigger: {
          trigger: heading,
          start: 'top 80%',
          // No end needed for a one-shot enter animation
          toggleActions: 'play none none none', // only play on enter; never reverse/reset
          // once is not necessary here because we never reverse/reset anyway
        }
      });
    });

    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  // Bootstrap: run after fonts (preferred) or on window load as fallback
  (function bootstrap() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initSplitReveal);
    } else {
      window.addEventListener('load', initSplitReveal);
    }
  })();

  //Skill Section's Card Animation

  gsap.ticker.lagSmoothing(0);

  // Cards and their initial rotations from the screenshots
  const cards = gsap.utils.toArray(".skill-card");
  const rotations = [-12, 10, -5, 5, -2, 4];

  // Place all cards off-screen initially and set rotation
  cards.forEach((card, index) => {
    gsap.set(card, {
      y: window.innerHeight,
      rotate: rotations[index]
    });
  });

  // ScrollTrigger that pins the section and drives the custom onUpdate
  ScrollTrigger.create({
    trigger: "#skills",
    start: "top top",
    end: `+=${window.innerHeight * 8}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;             // 0 → 1
      const totalCards = cards.length;
      const progressPerCard = 1 / totalCards;

      cards.forEach((card, index) => {
        // progress slice this card is responsible for
        const cardStart = index * progressPerCard;
        let cardProgress = (progress - cardStart) / progressPerCard;
        cardProgress = Math.min(Math.max(cardProgress, 0), 1);

        // Default positions: slide upward from bottom
        let yPos = window.innerHeight * (1 - cardProgress);
        let xPos = 0;

        // When a card is fully in (cardProgress === 1) and not the last one,
        // compute remainingProgress to start drifting it diagonally.
        if (cardProgress === 1 && index < totalCards - 1) {
          const remainingProgress =
            (progress - (cardStart + progressPerCard)) /
            (1 - (cardStart + progressPerCard));

          if (remainingProgress > 0) {
            const distanceMultiplier = 1 - index * 0.18;

            // Drift left and slightly upward based on viewport
            xPos = -window.innerWidth * 0.3 * distanceMultiplier * remainingProgress;
            yPos = -window.innerHeight * 0.3 * distanceMultiplier * remainingProgress;
          }
        }

        // Apply instantly each tick
        gsap.to(card, {
          y: yPos,
          x: xPos,
          duration: 0,
          ease: "none"
        });
      });
    }
  });

  // Contact Form Section
  const form = document.getElementById('contact-form');
  const ok = document.getElementById('ok');
  const fields = {
    first: document.getElementById('firstName'),
    last: document.getElementById('lastName'),
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
    if (cond) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
  }

  function validate() {
    const v = {
      first: !fields.first.value.trim(),
      last: !fields.last.value.trim(),
      email: !fields.email.validity.valid,
      msg: fields.msg.value.trim().length < 50
    };
    showError(fields.first, errors.first, v.first);
    showError(fields.last, errors.last, v.last);
    showError(fields.email, errors.email, v.email);
    showError(fields.msg, errors.msg, v.msg);
    return !(v.first || v.last || v.email || v.msg);
  }

  form.addEventListener('input', validate);
  form.addEventListener('submit', async (e) => {
    if (!validate()) { e.preventDefault(); return; }
    e.preventDefault();

    try {
      await emailjs.send(
        'service_mxshe2e',
        'template_jtx8c18',
        {
          firstName: fields.first.value,
          lastName: fields.last.value,
          email: fields.email.value,
          message: fields.msg.value
        },
        { publicKey: '2KE1Abs0nB-KGgJcv' } // v4 pattern: options object
      );
      ok.style.display = 'inline';
      form.reset();
    } catch (err) {
      alert('Failed to send. Please try again.');
    }
  });
});