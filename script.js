
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

// Horizental scroll of Website List




// Hovering effect

const posters = document.querySelectorAll('.poster');  // all posters
const spans = document.querySelectorAll('p span');     // all desc spans

posters.forEach((poster, index) => {
  poster.addEventListener('mouseenter', () => {
    spans.forEach(span => span.style.color = 'grey');  // reset all
    spans[index].style.color = 'white';                // highlight matching one
  });

  poster.addEventListener('mouseleave', () => {
    spans[index].style.color = 'grey';                 // reset on hover out
  });
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

  const contents = gsap.utils.toArray(".website-list .website")
  const gap = 10; // same as your CSS gap
  const totalShift = contents.length > 1
    ? (contents.length - 1) * (contents[0].offsetWidth + gap)
    : 0;

  gsap.to(contents, {
    x: -totalShift,
    ease: "none",
    scrollTrigger: {
      trigger: ".sticky-section", // pin the whole section
      start: "top top",
      end: () => "+=" + totalShift,
      pin: true,
      scrub: 1,
      anticipatePin: 1
    }
  })



  // helper: split text into spans (per char)
  function splitTextToSpans(element) {
    const text = element.innerText;
    element.innerHTML = "";
    text.split("").forEach(char => {
      const span = document.createElement("span");
      span.innerText = char === " " ? "\u00A0" : char;
      element.appendChild(span);
    });
    return element.querySelectorAll("span");
  }

  // grab all h1 inside .split-line-anim
  document.querySelectorAll(".split-line-anim h1").forEach(heading => {
    const chars = splitTextToSpans(heading);

    gsap.from(chars, {
      scrollTrigger: {
        trigger: heading,
        toggleActions: "restart pause resume reverse",
        start: "top 80%" // tweak this for earlier/later trigger
      },
      y: 80,
      opacity: 0,
      duration: 0.6,
      ease: "circ.out",
      stagger: 0.03
    });
  });

  //Skill Section's Card Animation

  gsap.ticker.lagSmoothing(0);

  // Cards and their initial rotations from the screenshots
  const cards = gsap.utils.toArray(".skill-card");
  const rotations = [-12, 10, -5, 5, -2];

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
            const distanceMultiplier = 1 - index * 0.15;

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
});