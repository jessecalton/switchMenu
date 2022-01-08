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

var pro = document.getElementById('control-stick-wrapper');
var cer = document.getElementById('control-stick');
var proR = pro.getBoundingClientRect();
var cirR = cer.getBoundingClientRect();
// radii
var rW = (cirR.right - cirR.left) / 2;
var rH = (cirR.bottom - cirR.top) / 2;
// page coords of center
var oX = (proR.right - proR.left) / 2;
var oY = (proR.bottom - proR.top) / 2;
var x, y;
// max movement
var max = 25;

function setPos(x, y) {
  cer.style.left = (x + oX - rW) + "px";
  cer.style.top = (y + oY - rH) + "px";
}

pro.addEventListener("mouseleave", function() {
  setPos(0, 0);
});

pro.addEventListener("mousemove", function(e) {
  // other numbers are the absolute positioning values
  x = e.clientX - oX + 13.5;
  y = e.clientY - oY - 105;
  // limit to max
  console.log(y);
  if (x < -max) x = -max;
  if (x > max) x = max;
  if (y < -max) y = -max;
  if (y > max) y = max;
  // set circle position
  setPos(x, y);
});

setPos(0, 0);














// var pro = document.getElementById('control-stick-wrapper');
// var cer = document.getElementById('control-stick');
// var proR = pro.getBoundingClientRect();
// var cirR = cer.getBoundingClientRect();
// // radii
// var rW = (cirR.right - cirR.left) / 2;
// var rH = (cirR.bottom - cirR.top) / 2;
// // page coords of center
// var oX = (proR.right + proR.left) / 2;
// var oY = (proR.bottom + proR.top) / 2;
// var x, y;
// // max movement
// var max = 15;

// console.log(proR);
// console.log(cirR);
// console.log(object);

// function setPos(x, y) {
//   cer.style.left = (x + oX - rW) + "px";
//   cer.style.top = (y + oY - rH) + "px";
// }

// pro.addEventListener("mouseleave", function() {
//   setPos(0, 0);
//   console.log('left');
// });

// pro.addEventListener("mousemove", function(e) {
//   // 0,0 is at center
//   x = e.clientX - oX;
//   y = e.clientY - oY;
//   // limit to max
//   if (x < -max) x = -max;
//   if (x > max) x = max;
//   if (y < -max) y = -max;
//   if (y > max) y = max;
//   // set circle position
//   setPos(x, y);
// });

// setPos(0, 0);