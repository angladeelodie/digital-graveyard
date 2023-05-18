import './style.css'
import {
  Graveyard
} from './JS/Graveyard';
import mainBus from "./JS/EventEmitter";

let GRAVEYARD;

init();

async function init() {
  initEvents();
  handleEvents();
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

  document.getElementById("name").addEventListener("change", (e) => {
    let newText = e.target.value;
    console.log(newText)
    mainBus.emit("nameChanged", newText);
  });

  let modelRadioButtons = document.querySelectorAll('input[type=radio][name="model"]');
  modelRadioButtons.forEach(radio => radio.addEventListener('change', () => {
    mainBus.emit("modelChanged", radio.value);
  }));



}

function handleEvents() {
  mainBus.on("nameChanged", (text) => {
    console.log("name changed")
    // GRAVEYARD.currentGrave.engraving.text = text;
    GRAVEYARD.currentGrave.updateText(text);
  })

  mainBus.on("modelChanged", (modelIndex) => {
    console.log("model changed")
    GRAVEYARD.currentGrave.updateModel(modelIndex);
  })
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