
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

// Sticky Section js

window.addEventListener('scroll', function () {
  const myElement = document.getElementById('sticky-section-text');
  const scrollPosition = window.scrollY;
  const sound = document.getElementById('whoopSound');

  if (scrollPosition > 400) {
    if (!myElement.classList.contains('line-js')) {
      sound.currentTime = 0; // restart sound
      sound.play();
    }
    myElement.classList.add('line-js');
    myElement.classList.remove('line');
  } else {
    if (!myElement.classList.contains('line')) {
      sound.currentTime = 0;
      sound.play();
    }
    myElement.classList.add('line');
    myElement.classList.remove('line-js');
  }
});


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

