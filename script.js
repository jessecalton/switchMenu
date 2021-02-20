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

