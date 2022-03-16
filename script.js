let klickSound = document.getElementById("klick");

var clock = document.getElementById("clock");

function time() {
  var d = new Date();
  var m = d.getMinutes();
  var hours = d.getHours();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  clock.textContent =
    ("0" + hours).substr(-2) + ":" + ("0" + m).substr(-2) + ampm;
}

setInterval(time, 1000);

// Resize console based on window size

let main = document.getElementById("main");
let baseSize = {
  w: 1571,
  h: 724,
};

function updateScale() {
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;
  let newScale = 1;

  if (windowWidth / windowHeight < baseSize.w / baseSize.h) {
    newScale = windowWidth / baseSize.w;
  } else {
    newScale = windowHeight / baseSize.h;
  }
  newScale = Math.min(newScale, 1);

  main.style.transform = "scale(" + newScale + "," + newScale + ")";
}

window.addEventListener("resize", updateScale);
window.addEventListener("load", updateScale);

// Joystick animation

let ctrlStickWrappers = document.getElementsByClassName(
  "control-stick-wrapper"
);
let ctrlSticks = document.getElementsByClassName("control-stick");
let leftCtrlStick = document.getElementById("left-control-stick");
let rightCtrlStick = document.getElementById("right-control-stick");

let ctrlStickWrapperRect = ctrlStickWrappers[0].getBoundingClientRect();
let ctrlStickRect = ctrlStickWrappers[0]
  .querySelector(".control-stick")
  .getBoundingClientRect();

// radii
let radiusWidth = ctrlStickRect.width / 2;
let radiusHeight = ctrlStickRect.height / 2;
// page coords of center
let centerX = ctrlStickWrapperRect.width / 2;
let centerY = ctrlStickWrapperRect.height / 2;
let x, y;
// max movement
let max = 25;
let nIntervId;

for (let csw of ctrlStickWrappers) {
  csw.addEventListener("mouseleave", function (e) {
    setPos(e.target.querySelector(".control-stick"), 0, 0);
    clearInterval(nIntervId);
    nIntervId = null;
  });

  csw.addEventListener("mousemove", function (e) {
    x = e.offsetX - centerX;
    y = e.offsetY - centerY;
    // limit to max
    if (x < -max) x = -max;
    if (x > max) x = max;
    if (y < -max) y = -max;
    if (y > max) y = max;
    // set circle position
    setPos(e.target.querySelector(".control-stick"), x, y);

    if (!nIntervId) {
      nIntervId = setInterval(() => {
        if (x === max) moveCursorHorizontal(1);
        if (x === -max) moveCursorHorizontal(-1);
        if (y === max) moveCursorVertical(1);
        if (y === -max) moveCursorVertical(-1);
      }, 900);
    }

    // if (Math.abs(x) !== max) {
    //   clearInterval(nIntervId);
    //   nIntervId = null;
    // }
  });
}

function setPos(elem, x, y) {
  elem.style.left = x + centerX - radiusWidth + "px";
  elem.style.top = y + centerY - radiusHeight + "px";
}

setPos(leftCtrlStick, 0, 0);
setPos(rightCtrlStick, 0, 0);

// Menu option selector

let clickableElements = document.getElementsByClassName("is-clickable");

function highlightMenuOption(elem) {
  // Clear all other highlighted options
  for (let clickableElem of clickableElements) {
    clickableElem.classList.remove("is-highlighted");
  }
  // Highlight selected element
  elem.classList.add("is-highlighted");

  if (elem.id === "scroll-left") {
    scrollGamesLeft();
  }

  if (elem.id === "scroll-right") {
    scrollGamesRight();
  }
}

for (let clickableElem of clickableElements) {
  clickableElem.addEventListener("mousemove", (e) => {
    highlightMenuOption(clickableElem);
  });

  clickableElem.addEventListener("click", (e) => {
    clickElementAnimation(clickableElem);
  });
}

// Build the 2D array of clickable menu items

let innerGridInd = 0;
let clickableGrid = [[]];

for (let val of clickableElements) {
  let gridInd = clickableGrid.length - 1;

  if (
    clickableGrid[gridInd].length === 0 ||
    clickableGrid[gridInd][innerGridInd - 1].className === val.className
  ) {
    clickableGrid[gridInd].push(val);
  } else {
    innerGridInd = 0;
    clickableGrid.push([]);
    clickableGrid[clickableGrid.length - 1].push(val);
  }
  innerGridInd++;
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      // Left pressed
      moveCursorHorizontal(-1);
      break;
    case "ArrowRight":
      // Right pressed
      moveCursorHorizontal(1);
      break;
    case "ArrowUp":
      // Up pressed
      moveCursorVertical(-1);
      break;
    case "ArrowDown":
      // Down pressed
      moveCursorVertical(1);
      break;
    case "Enter":
      clickSelectedElement();
      break;
  }
});

// Event listeners for arrow key buttons

document
  .querySelector(".up-arrow")
  .addEventListener("click", () => moveCursorVertical(-1));

document
  .querySelector(".bottom-arrow")
  .addEventListener("click", () => moveCursorVertical(1));

document
  .querySelector(".left-arrow")
  .addEventListener("click", () => moveCursorHorizontal(-1));

document
  .querySelector(".right-arrow")
  .addEventListener("click", () => moveCursorHorizontal(1));

// Returns the indices within clickableGrid of currently highlighted menu option
// If nothing is selected, returns [0, 0]
function getSelectedOption() {
  let returnInd = [0, 0];
  for (let ind in clickableGrid) {
    for (let elemInd in clickableGrid[ind]) {
      if (clickableGrid[ind][elemInd].className.includes("is-highlighted")) {
        returnInd = [parseInt(ind), parseInt(elemInd)];
        return returnInd;
      }
    }
  }
  return returnInd;
}

function moveCursorHorizontal(val) {
  let selectedOption = getSelectedOption();
  // If nothing is selected, cursor moves to first game
  if (selectedOption.every((v) => v === 0)) {
    highlightMenuOption(clickableGrid[1][0]);
    klickSound.play();
    return;
  }

  let newOption = selectedOption[1] + val;
  // If bounds are exceeded, do nothing
  if (newOption < 0) {
    return;
  }
  if (newOption >= clickableGrid[selectedOption[0]].length) {
    return;
  }
  // Otherwise, cursor moves
  highlightMenuOption(clickableGrid[selectedOption[0]][newOption]);
  klickSound.play();
}

function moveCursorVertical(val) {
  let nextRowValue;
  let selectedOption = getSelectedOption();
  let currentRowValue = selectedOption[1];

  let newOption = selectedOption.at(0) + val;

  // If bounds are exceeded, do nothing
  if (newOption < 0) {
    return;
  }
  if (newOption >= clickableGrid.length) {
    return;
  }

  // regular vertical logic
  nextRowValue = newOption;

  // special logic for going between game selector and menu btn selector
  if (selectedOption[0] === 1 && val === 1) {
    nextRowValue = Math.min(currentRowValue * 2, clickableGrid[2].length - 1);
  }

  if (selectedOption[0] === 2 && val === -1) {
    nextRowValue = Math.min(Math.floor(currentRowValue / 2), 2);
  }

  // Move cursor!
  highlightMenuOption(clickableGrid[newOption][nextRowValue]);
  klickSound.play();
}

// Scale Animation for clicking a selected element

// The click sounds!
let clickSound = document.getElementById("audio");
let profileSound = document.getElementById("profileSound");
let newsSound = document.getElementById("news");

function clickElementAnimation(selectedElement) {
  selectedElement.classList.add("is-clicked");

  if (selectedElement.id === "profile") {
    profileSound.play();
  } else if (selectedElement.className.includes("bubble")) {
    newsSound.play();
  } else {
    clickSound.play();
  }

  setTimeout(() => {
    selectedElement.classList.remove("is-clicked");
  }, 500);
}

function clickSelectedElement() {
  let selectedElement = document.querySelector(".is-highlighted");
  if (!selectedElement) return;

  clickElementAnimation(selectedElement);
}

// Event listeners for alpha buttons

let selectButtons = document.querySelectorAll(".btn-alpha");

selectButtons.forEach((btn) =>
  btn.addEventListener("click", clickSelectedElement)
);

// Hover scroll animation
let gridWrapper = document.querySelector(".grid-wrapper");
let rightMostElements = document.querySelectorAll(
  ".grid-wrapper .is-clickable:nth-child(5), .grid-wrapper .is-clickable:nth-child(4)"
);

rightMostElements.forEach((elem) =>
  elem.addEventListener("mouseover", scrollGamesLeft)
);

function scrollGamesLeft() {
  if (gridWrapper.scrollLeft <= 100) {
    gridWrapper.scroll({ left: 390, behavior: "smooth" });
  }
}

function scrollGamesRight() {
  if (gridWrapper.scrollLeft <= 400 && gridWrapper.scrollLeft >= 251) {
    gridWrapper.scroll({ left: 0, behavior: "smooth" });
  }
}

// Misc button sounds and actions

let miscControllerBtns = document.querySelectorAll(
  ".start-select-btn, .misc-controller-btns"
);
let homeSound = document.getElementById("home-sound");

function clickedMiscButton() {
  homeSound.play();

  // Deselect all elements
  for (let clickableElem of clickableElements) {
    clickableElem.classList.remove("is-highlighted");
  }

  scrollGamesRight();
}

for (let i = 0; i < miscControllerBtns.length; i++) {
  console.log("check");
  miscControllerBtns[i].addEventListener("click", clickedMiscButton);
}

// LR buttons

let leftRightButtons = document.querySelectorAll(".lr-btn");

leftRightButtons.forEach((btn) => {
  btn.addEventListener("mousedown", () => {
    btn.classList.add("clicked");
  });

  btn.addEventListener("mouseup", () => {
    btn.classList.remove("clicked");
  });

  btn.addEventListener("mouseout", () => {
    btn.classList.remove("clicked");
  });
});

// Overlay / Instruction Manual

let overlay = document.querySelector(".overlay");
let openOverlayBtn = document.querySelector(".instruction-manual-button");
let jigSound = document.getElementById("jig-sound");

openOverlayBtn.addEventListener("click", () => {
  overlay.classList.remove("is-hidden");
  jigSound.play();
});
overlay.addEventListener("click", () => overlay.classList.add("is-hidden"));

// Open overlay button animation
// Pulse animation lasts 20 seconds, interval toggles class every 20s, begins 3s after page load

window.addEventListener("load", () => {
  setTimeout(() => {
    setInterval(() => {
      openOverlayBtn.classList.toggle("is-pulsing");
    }, 20000);
    openOverlayBtn.classList.add("is-pulsing");
  }, 3000);
});
