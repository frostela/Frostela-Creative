// ---------------------------------------------------------- Hover Sound ------------------
const hoverElements = document.getElementsByClassName('sound1');
const hoverSound = document.getElementById('hoverSound');

if (hoverSound) {
  hoverSound.volume = 0.3;

  Array.from(hoverElements).forEach(element => {
    element.addEventListener('mouseover', () => {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(() => {});
    });
  });
}

// ------------------------------------------------- Drag Scroll (Reasons Section) ------------------
const slider = document.querySelector('.reasons');
if (slider) {
  let isDown = false;
  let startX, scrollLeft;

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
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    slider.scrollLeft = scrollLeft - walk;
  });
}

// ----------------------------------------------- Card Flipping on Scroll ------------------
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card-inner");
  const cardsSection = document.querySelector("#cards");

  function playSound(path) {
    const sound = new Audio(path);
    sound.play().catch(() => {});
  }

  if (cards.length && cardsSection) {
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
  }
});

// ---------------------------------------------------- Card Hover Sound ------------------
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const hoverSound = new Audio("./contents/sounds/card-flipping.mp3");
  hoverSound.preload = "auto";

  function playSound(audio) {
    const clone = audio.cloneNode();
    clone.play().catch(() => {});
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
});

// -------------------------------------------------------- Lenis Smooth Scroll ------------------
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

// --------------------------------------------------- GSAP + SplitType Animations ------------------
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  let typeSplit = new SplitType('[animate]', {
    types: 'lines, words, chars',
    tagName: 'span'
  });

  gsap.from('[animate] .word', {
    opacity: 0.3,
    duration: 0.5,
    ease: 'power1.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '[animate]',
      start: 'top 100%',
      end: 'bottom 60%',
      scrub: true
    }
  });

  function splitToWordsAndChars(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';

    const wordsData = text.split(/\s+/).map((w) => {
      const word = document.createElement('span');
      word.className = 'word';

      [...w].forEach((c) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = c;
        word.appendChild(span);
      });

      const space = document.createElement('span');
      space.className = 'space';
      space.textContent = '\u00A0';
      word.appendChild(space);

      el.appendChild(word);
      return { word };
    });

    const lastSpace = el.querySelector('.word:last-child .space');
    if (lastSpace) lastSpace.remove();

    return wordsData;
  }

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

  function initSplitReveal() {
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
          toggleActions: 'play none none none',
        }
      });
    });

    ScrollTrigger.refresh();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initSplitReveal);
  } else {
    window.addEventListener('load', initSplitReveal);
  }
});

// -------------------------------------------------------------------- Contact Form ------------------
document.addEventListener("DOMContentLoaded", () => {
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
