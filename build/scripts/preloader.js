"use strict";

var $preloader = document.querySelector('.preloader');
var $preloader_container = document.querySelector('.preloader__container');
var $preloader_items = document.querySelectorAll('.preloader__back path');
var preloader_flag = localStorage.getItem('preloader');
var preloader_time = 0;
var preloader_mintime = 1;
var preloader_values = [];
$preloader_items.forEach(function ($line, index) {
  preloader_values[index] = $line.getTotalLength();
  $line.style.strokeDasharray = preloader_values[index];
});

if (!preloader_flag) {
  $preloader_container.style.transition = "opacity ".concat(preloader_mintime / 2, "s ease-in-out");
  $preloader_container.style.opacity = '1'; //

  var interval = setInterval(function () {
    preloader_time += 0.1;
  }, 100); //

  setTimeout(function () {
    clearInterval(interval);
    $preloader_items.forEach(function ($line) {
      $line.style.transition = 'none';
    });
  }, preloader_mintime * 1000); //

  $preloader_items.forEach(function ($line, index) {
    $line.style.strokeDashoffset = preloader_values[index];
  });
  setTimeout(function () {
    $preloader_items.forEach(function ($line) {
      $line.style.transition = "stroke-dashoffset ".concat(preloader_mintime, "s ease-in-out, opacity ").concat(preloader_mintime / 2, "s ease-in-out");
      $line.style.strokeDashoffset = '0';
    });
  });
} else {
  $preloader_container.style.opacity = '1';
}
//# sourceMappingURL=maps/preloader.js.map
