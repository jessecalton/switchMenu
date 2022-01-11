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

let main = document.getElementById('main');
let baseSize = {
    w: 1571,
    h: 724    
}

function updateScale() {
    
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    let newScale = 1;
    
    if(windowWidth/windowHeight < baseSize.w/baseSize.h) {
        newScale = windowWidth / baseSize.w;
    } else {
        newScale = windowHeight / baseSize.h;        
    }
    
    main.style.transform = 'scale(' + newScale + ',' +  newScale + ')';
    
    console.log(newScale);
}

window.addEventListener('resize', updateScale);
window.addEventListener('load', updateScale);

// Joystick animation

let ctrlStickWrappers = document.getElementsByClassName('control-stick-wrapper');
let ctrlSticks = document.getElementsByClassName('control-stick');
let leftCtrlStick = document.getElementById('left-control-stick');
let rightCtrlStick = document.getElementById('right-control-stick');

let ctrlStickWrapperRect = ctrlStickWrappers[0].getBoundingClientRect();
let ctrlStickRect = ctrlStickWrappers[0].querySelector('.control-stick').getBoundingClientRect();

// radii
let radiusWidth = ctrlStickRect.width / 2;
let radiusHeight = ctrlStickRect.height / 2;
// page coords of center
let centerX = ctrlStickWrapperRect.width / 2;
let centerY = ctrlStickWrapperRect.height / 2;
let x, y;
// max movement
let max = 25;

for (let csw of ctrlStickWrappers) {
  csw.addEventListener("mouseleave", function(e) {
    setPos(e.target.querySelector('.control-stick'), 0, 0);
  });
  
  csw.addEventListener("mousemove", function(e) {
    x = e.offsetX - centerX;
    y = e.offsetY - centerY;
    // limit to max
    if (x < -max) x = -max;
    if (x > max) x = max;
    if (y < -max) y = -max;
    if (y > max) y = max;
    // set circle position
    // console.log(e.target.querySelector('.control-stick').getBoundingClientRect().x);
    setPos(e.target.querySelector('.control-stick'), x, y);
  });

}

function setPos(elem, x, y) {
  elem.style.left = (x + centerX - radiusWidth) + "px";
  elem.style.top = (y + centerY - radiusHeight) + "px";
}



setPos(leftCtrlStick, 0, 0);
setPos(rightCtrlStick, 0, 0);
