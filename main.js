var count = 0;
var timeLeft = 90;

function convertSeconds(s) {
  // Calculate the number of hours, minutes, and seconds
  var hr = Math.floor(s / 3600);
  var min = Math.floor((s - hr * 3600) / 60);
  var sec = s % 60;

  // var hrStr = hr.toString();
  // var minStr = min.toString();
  // var secStr = sec.toString();

  // Pad any number less than 10 with a '0' in front
  var hrStr = hr.toString().padStart(2, "0");
  var minStr = min.toString().padStart(2, "0");
  var secStr = sec.toString().padStart(2, "0");

  // if (hr < 10) {
  //   hrStr = "0" + hrStr;
  // }

  // if (min < 10) {
  //   minStr = "0" + minStr;
  // }

  // if (sec < 10) {
  //   secStr = "0" + secStr;
  // }

  return hrStr + ":" + minStr + ":" + secStr;
}

$(document).ready(function () {
  var timer = $("#timer");
  timer.html(convertSeconds(timeLeft - count));

  var btnStart = $("#btnStart");
  var btnPause = $("#btnPause");
  var btnReset = $("#btnReset");

  var hrSpinner = $("#hrSpinner").spinner();
  var minSpinner = $("#minSpinner").spinner();
  var secSpinner = $("#secSpinner").spinner();

  var alarm = $("audio#alarm")[0];

  // Setup the spinners
  hrSpinner.spinner({
    min: 0,
    max: 99,
  });
  minSpinner.spinner({
    min: 0,
    max: 59,
  });
  secSpinner.spinner({
    min: 0,
    max: 59,
  });

  var interval;

  btnStart.click(function () {
    // Convert the time from the spinners into seconds
    var hr = parseInt(hrSpinner.val()) * 3600;
    var min = parseInt(minSpinner.val()) * 60;
    var sec = parseInt(secSpinner.val());
    timeLeft = hr + min + sec;
    timer.html(convertSeconds(timeLeft - count));

    // If the timer set is 0, don't start the timer
    if (timeLeft == 0) {
      return;
    }

    btnStart.prop("disabled", true);
    btnPause.prop("disabled", false);
    btnReset.prop("disabled", false);

    hrSpinner.spinner("disable");
    minSpinner.spinner("disable");
    secSpinner.spinner("disable");

    // Start counting down every second
    interval = setInterval(timeIt, 1000);
  });

  btnPause.click(function () {
    btnStart.prop("disabled", false);
    btnPause.prop("disabled", true);

    // Stop counting down every second
    clearInterval(interval);
  });

  btnReset.click(function () {
    if (!alarm.paused) {
      // Stop the audio track and set it back to the beginning
      alarm.pause();
      alarm.currentTime = 0;
      $("#timer").css("background-color", "white");
    }

    btnStart.prop("disabled", false);
    btnPause.prop("disabled", true);
    btnReset.prop("disabled", true);

    // Don't allow the time to be set until the Reset button is pressed
    hrSpinner.spinner("enable");
    minSpinner.spinner("enable");
    secSpinner.spinner("enable");

    count = 0;
    timer.html(convertSeconds(timeLeft - count));

    // Stop counting down every second
    clearInterval(interval);
  });

  // Function that gets called every second
  function timeIt() {
    count++;
    timer.html(convertSeconds(timeLeft - count));

    // Check if time's up
    if (count == timeLeft) {
      alarm.play();
      btnPause.prop("disabled", true);
      $("#timer").css("background-color", "red");

      // Stop counting down every second
      clearInterval(interval);
    }
  }
});
