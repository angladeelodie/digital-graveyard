import './style.css'
import {
  Graveyard
} from './JS/Graveyard';
let GRAVEYARD;

init();

async function init() {
  initEvents();
  initThree();
}

async function initThree() {
  GRAVEYARD = new Graveyard({
    container: document.getElementById('graveyard-container'),
    // data: null,
  });
  // await DNA.init()
  // await DNA.show()
}





function initEvents() {
  window.addEventListener('scroll', function () {
    shrinkHeader();
  });

  document.getElementById("toggle-controls").addEventListener("click", () => {
    toggleControls();
  });

  window.addEventListener('resize', function () {
    GRAVEYARD.onWindowResize();
  });



}

function shrinkHeader() {
  let scroll = getCurrentScroll();
  if (scroll >= 70) {
    document.getElementById('header').classList.add('smaller');
  } else {
    document.getElementById('header').classList.remove('smaller');
  }
}

function getCurrentScroll() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

function toggleControls() {
  document.getElementById("controls-panel").classList.toggle("fullscreen");
}