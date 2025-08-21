
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

  if (scrollPosition > 200) {
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

