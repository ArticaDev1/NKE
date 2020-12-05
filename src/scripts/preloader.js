const $preloader = document.querySelector('.preloader');
const $preloader_container = document.querySelector('.preloader__container');
const $preloader_items = document.querySelectorAll('.preloader__back path');
const preloader_flag = localStorage.getItem('preloader');
let preloader_time = 0;
let preloader_mintime = 1;
let preloader_values = [];

$preloader_items.forEach(($line, index)=>{
  preloader_values[index] = $line.getTotalLength();
  $line.style.strokeDasharray = preloader_values[index];
})

if(!preloader_flag) {
  $preloader_container.style.transition = `opacity ${preloader_mintime/2}s ease-in-out`;
  $preloader_container.style.opacity = '1';
  //
  let interval = setInterval(() => {
    preloader_time+=0.1;
  }, 100);
  //
  setTimeout(() => {
    clearInterval(interval);
    $preloader_items.forEach(($line)=>{
      $line.style.transition = 'none';
    })
  }, preloader_mintime*1000);
  //
  $preloader_items.forEach(($line, index)=>{
    $line.style.strokeDashoffset = preloader_values[index];
  })
  setTimeout(()=>{
    $preloader_items.forEach(($line)=>{
      $line.style.transition = `stroke-dashoffset ${preloader_mintime}s ease-in-out, opacity ${preloader_mintime/2}s ease-in-out`;
      $line.style.strokeDashoffset = '0';
    })
  })
} 
else {
  $preloader_container.style.opacity = '1';
}