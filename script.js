
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

gsap.registerPlugin(ScrollTrigger);

gsap.from(".line", {
  opacity: 0,
  y: 40,
  stagger: 0.2,
  duration: 1,
  scrollTrigger: {
    trigger: ".sticky-section",
    start: "top 70%",   // triggers earlier
    end: "bottom 30%",
    toggleActions: "play none none reverse", // simple play/reverse
    markers: true       // turn on for debugging
  }
});

