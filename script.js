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




