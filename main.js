import './style.css'
import {
  Graveyard
} from './JS/Graveyard';
import mainBus from "./JS/EventEmitter";
import Typed from './JS/typed.js';

let GRAVEYARD;
let GRAVEYARD2;
let graveSubmitted = false;
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

  const textInputs = document.querySelectorAll('input[type="text"], input[type="date"]');

textInputs.forEach(input => {
  input.addEventListener('input', function() {
    if (input.value !== '') {
      input.classList.add('txtchanged');
    } else {
      input.classList.remove('txtchanged');
    }
  });


  input.addEventListener('focus', function() {
    input.classList.remove('txtchanged');
  });
});


  let modelRadioButtons = document.querySelectorAll('input[type=radio][name="model"]');
  modelRadioButtons.forEach(radio => radio.addEventListener('change', () => {
    mainBus.emit("modelChanged", radio.value);
  }));

  let materialRadioButtons = document.querySelectorAll('input[type=radio][name="material"]');
  materialRadioButtons.forEach(radio => radio.addEventListener('change', () => {
    
    mainBus.emit("materialChanged", radio.value);
  }));

  let colorInput = document.getElementById('color');
  colorInput.addEventListener('input', (e) => {
    console.log(e.value)
    mainBus.emit("materialChanged", colorInput.value);
  });

  let soundRadioButtons = document.querySelectorAll('input[type=radio][name="sound"]');
  soundRadioButtons.forEach(radio => radio.addEventListener('change', () => {
    mainBus.emit("soundChanged", radio.value);
  }));


  document.getElementById("border").addEventListener("click", (e) => {
    mainBus.emit("graveSubmitted");
    graveSubmitted = true;
    console.log(graveSubmitted)
    const submitButton = document.getElementById("submit");
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


  

  mainBus.on("soundChanged", (soundIndex) => {
    console.log("sound changed " + soundIndex)
    playAudio(soundIndex);
  });

  mainBus.on("graveSubmitted", () => {
  console.log("new Grave");
  let customizedGrave = GRAVEYARD.currentGrave;
  GRAVEYARD2.pushToGraveyard(customizedGrave);

  var elementsLeft = document.getElementsByClassName("split-left");
  for (var i = 0; i < elementsLeft.length; i++) {
    elementsLeft[i].style.left = "-100%";
  }

  var elementsControl = document.getElementsByClassName("controls");
  for (var i = 0; i < elementsControl.length; i++) {
    elementsControl[i].style.left = "-100%";
  }

  var elementsRight = document.getElementsByClassName("split-right");
  for (var i = 0; i < elementsRight.length; i++) {
    elementsRight[i].style.right = "-100%";
  }

  const graveyardContainer = document.getElementById('sectionfinal');
  setTimeout(() => {
    graveyardContainer.style.zIndex = '2';
  }, 2000);

  const header = document.getElementById('header');
  header.style.backgroundColor = "transparent";
  header.style.color = "var(--color-dark)";

  const bout = document.getElementsByClassName("pagebutton");
  for (var i = 0; i < bout.length; i++) {
    bout[i].style.fill = "var(--color-dark)";
  }
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


// HOMEPAGE

// SHOWROOM

const sequenceImages = [];
let currentImageIndex = 0;
let currentImageElement = null;
let isMouseMoving = false;
let isLoadingImage = false;
let intervalId = null;

for (let i = 0; i <= 298; i++) {
  let image = new Image();
  image.src = `./imgs/showroom/edit_${i}.jpg`;
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
  currentImageElement.id = "showroomimg"; // Set the id of the current image element
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



// START


document.getElementById("home").addEventListener("click", function() {
  var ambient = document.getElementById('ambient');
  ambient.muted = false; // Unmute the selected audio
  ambient.loop = true; // Enable looping
  ambient.play();

    var homepage = document.getElementById('home');
  homepage.style.opacity = '0';
  // homepage.style.pointerEvents = 'none';

  document.getElementById("main").style.overflow = 'scroll';
  document.getElementById("header-logo").style.opacity = '1';
  // document.body.style.display = 'content'

  setTimeout(function() {
    var homepage = document.getElementById('home');
    var commentedHTML = '<!-- ' + homepage.outerHTML + ' -->';
    homepage.outerHTML = commentedHTML;
  }, 2000);
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


// SPECIMEN

const opacityToggleBtn = document.getElementById('panelButton');
const opacityToggleBtnMinus = document.getElementById('panelButtonminus');
const targetElement = document.getElementById('specimen');
const header = document.getElementById('header');
const bout1 = document.getElementById('colorSwitchButton');

opacityToggleBtn.addEventListener('click', togglePanel);
opacityToggleBtnMinus.addEventListener('click', togglePanel);

function togglePanel() {
  if (targetElement.style.left === '0%') {
    targetElement.style.left = '100%';
    targetElement.style.pointerEvents = 'none';
    opacityToggleBtnMinus.style.display = 'none';
    opacityToggleBtn.style.display = 'block';
   
      header.style.backgroundColor = 'var(--color-dark)';
      header.style.color = 'var(--color-light)';
      bout1.style.fill = 'var(--color-light)';
      if(graveSubmitted == true){
        header.style.backgroundColor = 'transparent';
        header.style.color = 'var(--color-dark)';
        bout1.style.fill = 'var(--color-dark)';
      }
      if(graveSubmitted == false){
       
        header.style.backgroundColor = 'var(--color-dark)';
        header.style.color = 'var(--color-light)';
        bout1.style.fill = 'var(--color-light)';
      }
    
    // bout2.style.fill = 'var(--color-light)';
  } else {
    targetElement.style.left = '0%';
    if (targetElement.style.pointerEvents !== 'all') {
      targetElement.style.pointerEvents = 'all';
      opacityToggleBtnMinus.style.display = 'block';
      opacityToggleBtn.style.display = 'none';
      if(graveSubmitted == true){
        header.style.backgroundColor = 'var(--color-light)';
        // header.style.color = 'var(--color-dark)';
        // bout1.style.fill = 'var(--color-dark)';
      }
      if(graveSubmitted == false){
        header.style.backgroundColor = 'var(--color-light)';
        header.style.color = 'var(--color-dark)';
        bout1.style.fill = 'var(--color-dark)';
      }

    
      // bout2.style.fill = 'var(--color-dark)';
    }
  }
}



// SCROLL

const nextArrow = document.getElementById("next");
const prevArrow = document.getElementById("prev");
const navTop = document.querySelector(".navtop");

const data = [
  "(USE KEYBOARD'S ARROWS OR PRESS PREV/NEXT)", // already defined
  "TOMB'S MODEL", // add your additional data here
  "MATERIAL",
  "NAME",
  "D. BIRTH\u2009–\u2009D. DEATH",
  "AMBIENT SONG",
  // "ENVIRONMENT",
  "END/BEGINNING",
];

let currentValue = 1;
const totalValues = 7; // Change this value to match the total number of values

const numberDisplay = document.getElementById("navbottom");
numberDisplay.textContent = `${currentValue}/${totalValues}`;

nextArrow.addEventListener("click", (e) => {
  e.preventDefault();
  scrollToNextDiv();
  currentValue = (currentValue % totalValues) + 1;
  updateNavTop();
  numberDisplay.textContent = `${currentValue}/${totalValues}`;
});

prevArrow.addEventListener("click", (e) => {
  e.preventDefault();
  scrollToPrevDiv();
  currentValue = ((currentValue - 2 + totalValues) % totalValues) + 1;
  updateNavTop();
  numberDisplay.textContent = `${currentValue}/${totalValues}`;
});

function scrollToNextDiv() {
  const currentDiv = currentControlDiv;
  const nextDiv = currentDiv.nextElementSibling;
  if (nextDiv) {
    nextDiv.scrollIntoView({ behavior: "smooth" });
    currentControlDiv = nextDiv;
  }
}

function scrollToPrevDiv() {
  const currentDiv = currentControlDiv;
  const prevDiv = currentDiv.previousElementSibling;
  if (prevDiv) {
    prevDiv.scrollIntoView({ behavior: "smooth" });
    currentControlDiv = prevDiv;
  }
}

function updateNavTop() {
  const currentIndex = currentValue - 1;
  navTop.textContent = data[currentIndex];

  if (currentValue === 1) {
    prevArrow.style.display = "none";
  } else {
    prevArrow.style.display = "block";
  }

  if (currentValue === 7) {
    nextArrow.style.display = "none";
  } else {
    nextArrow.style.display = "block";
  }
}



// AUDIO

var audioElements = [
  document.getElementById("audio1"),
  document.getElementById("audio2"),
  document.getElementById("audio3"),
  document.getElementById("audio4"),
  document.getElementById("audio5"),
  document.getElementById("audio6"),
];

function playAudio(selectedIndex){
  for (var i = 0; i < audioElements.length; i++) {
    console.log(selectedIndex)
    if (i == selectedIndex) {
      audioElements[i].muted = false; // Unmute the selected audio
      audioElements[i].loop = true; // Enable looping
      ambient.muted = true;

      audioElements[i].play();
    } else {
      audioElements[i].muted = true; // Mute the other audios
      audioElements[i].pause();
    }
  }
}


  



var typed = new Typed('#typedtitle', {
  strings: ['L&#8217;an 2K23,<br>MMXXIII'],
  typeSpeed: 90,
  backSpeed: 30,
  backDelay: 3000,
  bindInputFocusEvents: true,
  startDelay: 100,
  loop: true
});


