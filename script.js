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
        if (x === 25) moveCursorHorizontal(1);
        if (x === -25) moveCursorHorizontal(-1);
      }, 1000);
    }

    if (Math.abs(x) !== 25) {
      clearInterval(nIntervId);
      nIntervId = null;
    }
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
}

for (let clickableElem of clickableElements) {
  clickableElem.addEventListener("mouseover", (e) => {
    highlightMenuOption(clickableElem);
  });
}

// Build the 2D array of clickable elements

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
  }
});

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
}
