import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'


document.addEventListener('DOMContentLoaded', function() {
  let shrinkHeader = 70;

  window.addEventListener('scroll', function() {
    let scroll = getCurrentScroll();
    if (scroll >= shrinkHeader) {
      console.log('scrol >= shrinkHeader');
      document.getElementById('header').classList.add('smaller');
    } else {
      document.getElementById('header').classList.remove('smaller');
    }
  });

  document.getElementById("toggle-controls").addEventListener("click", () => {
    console.log('toggle-controls');
    document.getElementById("controls-panel").classList.toggle("fullscreen");
  });

  function getCurrentScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
});