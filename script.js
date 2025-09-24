// ---------------------------------------------------------- Hover Sound ------------------
const hoverElements = document.getElementsByClassName('sound1');
const hoverSound = document.getElementById('hoverSound');

if (hoverSound) {
  hoverSound.volume = 0.3;

  Array.from(hoverElements).forEach(element => {
    element.addEventListener('mouseover', () => {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(() => { });
    });
  });
}

// ------------------------------------------------------------------------ Card Hover Sound ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
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
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Animation A: Fade Words --------------------------------------------------------

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
  function splitToWordsAndChars(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';

    text.split(/\s+/).forEach((w) => {
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
    });

    // Remove trailing space
    const lastSpace = el.querySelector('.word:last-child .space');
    if (lastSpace) lastSpace.remove();
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

  function initRevealAnimation() {
    document.querySelectorAll('[animate="reveal"]').forEach((heading) => {
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
    document.fonts.ready.then(initRevealAnimation);
  } else {
    window.addEventListener('load', initRevealAnimation);
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


// When the user clicks on the button, toggle between hiding and showing the dropdown content -----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const reasons = document.querySelectorAll(".reason");

  reasons.forEach(reason => {
    const paragraph = reason.querySelector("p");

    reason.addEventListener("click", (e) => {
      e.stopPropagation();

      // Close all others
      reasons.forEach(r => {
        if (r !== reason) {
          r.querySelector("p").classList.remove("show");
        }
      });

      // Toggle this one
      paragraph.classList.toggle("show");
    });
  });

  // Close all if clicked outside
  window.addEventListener("click", () => {
    reasons.forEach(reason => {
      reason.querySelector("p").classList.remove("show");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const growDivs = document.querySelectorAll(".grow-width");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        // 🔥 uncomment next line if you want it to only trigger once
        // observer.unobserve(entry.target);
      } else {
        entry.target.classList.remove("show"); // remove if you want it only once
      }
    });
  }, { 
    root: null, 
    threshold: 0, 
    rootMargin: "0px 0px -15% 0px" 
  });

  growDivs.forEach(div => observer.observe(div));
});


