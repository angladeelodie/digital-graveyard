import './style.css'
import {
  Graveyard
} from './JS/Graveyard';
import mainBus from "./JS/EventEmitter";

let GRAVEYARD;
let GRAVEYARD2;

let allControlDivs = document.querySelectorAll(".control-box");
let currentControlDiv = allControlDivs[0];

init();

async function init() {
  initEvents();
  handleEvents();
  initThree();
}

async function initThree() {
  GRAVEYARD = new Graveyard({
    container: document.getElementById('custom-grave-container'),
    id: 1,
  });
  GRAVEYARD2 = new Graveyard({
    container: document.getElementById('graveyard-container'),
    id: 2
  });
  // GRAVEYARD2.initAllGraves();
}





function initEvents() {
  window.addEventListener('scroll', function () {
    shrinkHeader();
  });

  document.getElementById('death').valueAsDate = new Date();

  window.addEventListener('resize', function () {
    GRAVEYARD.onWindowResize();
  });

  document.getElementById("name").addEventListener("change", (e) => {
    let newName = e.target.value;
    console.log(newName)
    mainBus.emit("nameChanged", newName);
  });

  document.getElementById("birth").addEventListener("blur", (e) => {
    let birthDate = e.target.value;
    mainBus.emit("birthChanged", birthDate);
  });


  document.getElementById("death").addEventListener("blur", (e) => {
    let deathDate = e.target.value;
    mainBus.emit("deathChanged", deathDate);
  });


  document.getElementById("surname").addEventListener("change", (e) => {
    let newSurname = e.target.value;
    console.log(newSurname)
    mainBus.emit("surnameChanged", newSurname);
  });

  let modelRadioButtons = document.querySelectorAll('input[type=radio][name="model"]');
  modelRadioButtons.forEach(radio => radio.addEventListener('change', () => {
    mainBus.emit("modelChanged", radio.value);
  }));

  let materialRadioButtons = document.querySelectorAll('input[type=radio][name="material"]');
  materialRadioButtons.forEach(radio => radio.addEventListener('change', () => {
    mainBus.emit("materialChanged", radio.value);
  }));

  let soundRadioButtons = document.querySelectorAll('input[type=radio][name="sound"]');
  soundRadioButtons.forEach(radio => radio.addEventListener('change', () => {
    mainBus.emit("soundChanged", radio.value);
  }));


  let backgroundRadioButtons = document.querySelectorAll('input[type=radio][name="background"]');
  backgroundRadioButtons.forEach(radio => radio.addEventListener('change', () => {
    mainBus.emit("backgroundChanged", radio.value);
  }));


  document.getElementById("submit").addEventListener("click", (e) => {
    mainBus.emit("graveSubmitted");
  });
}

function handleEvents() {
  mainBus.on("nameChanged", (name) => {
    console.log("name changed")
    GRAVEYARD.currentGrave.updateName(name);
  })

  mainBus.on("surnameChanged", (surname) => {
    console.log("surname changed")
    GRAVEYARD.currentGrave.updateSurname(surname);
  })

  mainBus.on("modelChanged", (modelIndex) => {
    console.log("model changed")
    GRAVEYARD.currentGrave.updateModel(modelIndex);
  })

  mainBus.on("materialChanged", (materialIndex) => {
    console.log("material changed")
    GRAVEYARD.currentGrave.updateMaterial(materialIndex);
  })

  mainBus.on("birthChanged", (birthDateString) => {
    let birthDate = new Date(birthDateString);
    GRAVEYARD.currentGrave.birthDate = birthDate;
    GRAVEYARD.currentGrave.calculateAge();
    GRAVEYARD.currentGrave.resize();

  })

  mainBus.on("deathChanged", (deathDateString) => {
    let deathDate = new Date(deathDateString);
    GRAVEYARD.currentGrave.deathDate = deathDate;
    GRAVEYARD.currentGrave.calculateAge();
    GRAVEYARD.currentGrave.resize();

  })

  mainBus.on("backgroundChanged", (backgroundIndex) => {
    console.log("background changed " + backgroundIndex)
    let bgImages = document.getElementsByClassName("custom-bg");
    for (let i = 0; i < bgImages.length; i++) {  
      if(backgroundIndex == 0){
        bgImages[i].style.backgroundImage = "url('/imgs/backgrounds/bg1.svg')";
      } else if(backgroundIndex == 1){
        bgImages[i].style.backgroundImage = "url('/imgs/backgrounds/bg2.svg')";
      }  else if(backgroundIndex == 2){
        bgImages[i].style.backgroundImage = "url('/imgs/backgrounds/bg3.svg')";
      }
    }
  });

  mainBus.on("soundChanged", (soundIndex) => {
    console.log("sound changed " + soundIndex)
    playAudio(soundIndex);
  });

  mainBus.on("graveSubmitted", () => {
    console.log("new Grave")
    GRAVEYARD.pushToGraveyard();
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


// HOMEPAGE
const video = document.getElementById('welcomevid');
video.play();

window.addEventListener('load', function() {
  // setTimeout(function() {
  //   var homepage = document.getElementById('home');
  //   homepage.style.opacity = '0';
  // // }, 1000);
  // }, 6000);

  setTimeout(function() {
    var homepage = document.getElementById('home');
    var commentedHTML = '<!-- ' + homepage.outerHTML + ' -->';
    homepage.outerHTML = commentedHTML;
  // }, 1000);
  }, 8000);
});

// POSITIF NEGATIF
  const colorSwitchButton = document.getElementById('colorSwitchButton');
  colorSwitchButton.addEventListener('click', () => {
    const root = document.querySelector(':root');
    const darkColor = getComputedStyle(root).getPropertyValue('--color-dark');
    const lightColor = getComputedStyle(root).getPropertyValue('--color-light');
    
    root.style.setProperty('--color-dark', lightColor);
    root.style.setProperty('--color-light', darkColor);
  });


// PANEL

const opacityToggleBtn = document.getElementById('panelButton');
const targetElement = document.getElementById('panel');

opacityToggleBtn.addEventListener('click', () => {
  if (targetElement.style.left === '0%') {
    targetElement.style.left = '100%';
    targetElement.style.pointerEvents = 'none';
  } else {
    targetElement.style.left = '0%';
    if (targetElement.style.pointerEvents !== 'all') {
      targetElement.style.pointerEvents = 'all';
    }
  }
});



const sequenceImages = [];
let currentImageIndex = 0;
let currentImageElement = null;
let isMouseMoving = false;
let isLoadingImage = false;
let intervalId = null;

for (let i = 0; i <= 180; i++) {
  let image = new Image();
  image.src = `./imgs/showroom/paul_rand_${i}.png`;
  sequenceImages.push(image);
}

const scrollIncrement = 1; // Adjust this value to control the scroll speed
const autoChangeDelay = 30; // Delay in milliseconds for automatic image change

document.getElementById("showroomcontainer").addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const imageIndex = Math.floor((mouseX / window.innerWidth) * sequenceImages.length);
  currentImageIndex = imageIndex;
  isMouseMoving = true;

  clearTimeout(intervalId); // Clear the automatic image change interval
  intervalId = setTimeout(() => {
    isMouseMoving = false;
    autoChangeImage();
  }, autoChangeDelay);

  updateImage();
});


function updateImage() {
  if (currentImageElement) {
    currentImageElement.remove();
  }

  const image = sequenceImages[currentImageIndex >= 0 ? currentImageIndex : 0];
  currentImageElement = image.cloneNode();
  let showroomContainer = document.getElementById("showroomcontainer");
  showroomContainer.innerHTML = '';
  showroomContainer.appendChild(currentImageElement);
}

function autoChangeImage() {
  if (!isMouseMoving) {
    currentImageIndex = (currentImageIndex + scrollIncrement);
    if (currentImageIndex >= sequenceImages.length) {
      currentImageIndex = 0;
    }
    if (!isLoadingImage) {
      isLoadingImage = true;
      const image = sequenceImages[currentImageIndex];
      image.onload = () => {
        isLoadingImage = false;
        updateImage();
        intervalId = setTimeout(autoChangeImage, autoChangeDelay);
      };
    }
  }
}

function setup() {
  updateImage();
  intervalId = setTimeout(autoChangeImage, autoChangeDelay);
}

window.onload = setup;



// ENTER SCROLL

const prevArrow = document.getElementById("arrow-prev");
const nextArrow = document.getElementById("arrow-next");

prevArrow.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToPrevDiv();
});

nextArrow.addEventListener("click", (e) => {
  e.preventDefault();
  scrollToNextDiv();
});

function scrollToNextDiv() {
  const currentDiv = currentControlDiv;
  const nextDiv = currentDiv.nextElementSibling;
  if (nextDiv) {
    nextDiv.scrollIntoView({ behavior: "smooth" });
    currentControlDiv = nextDiv
  }
}

function scrollToPrevDiv() {
  const currentDiv = currentControlDiv;
  const prevDiv = currentDiv.previousElementSibling;

  if (prevDiv) {
    prevDiv.scrollIntoView({ behavior: "smooth" });
    currentControlDiv = prevDiv

  }
}


var audioElements = [
  document.getElementById("audio1"),
  document.getElementById("audio2"),
  document.getElementById("audio3"),
  document.getElementById("audio4")
];

function playAudio(selectedIndex){
  for (var i = 0; i < audioElements.length; i++) {
    console.log(selectedIndex)
    if (i == selectedIndex) {
      audioElements[i].muted = false; // Unmute the selected audio
      audioElements[i].loop = true; // Enable looping

      audioElements[i].play();
    } else {
      audioElements[i].muted = true; // Mute the other audios
      audioElements[i].pause();
    }
  }
}