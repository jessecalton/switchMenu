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