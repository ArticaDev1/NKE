import 'lazysizes';
lazySizes.cfg.init = false;
lazySizes.cfg.expand = 100;
document.addEventListener('lazybeforeunveil', function(e){
  if(e.target.tagName!=='IMG') {
    let bg = e.target.getAttribute('data-src');
    e.target.style.backgroundImage = `url('${bg}')`;
  }
});
import {gsap} from "gsap";
import scrollLock from 'scroll-lock';
import Inputmask from "inputmask";

const brakepoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1600
}
const $body = document.body;
const $wrapper = document.querySelector('.wrapper');
const $header = document.querySelector('.header');
const speed = 1;

const Mask = {
  init: function() {
    Inputmask({
      mask: "+7 999 999-9999",
      showMaskOnHover: false,
      clearIncomplete: false
    }).mask('[data-phone]');
  }
}

window.onload = function(){
  lazySizes.init();
  TouchHoverEvents.init();
  Mask.init();
  Preloader.init();
}

const TouchHoverEvents = {
  targets: 'a, button, label, tr, .jsTouchHover',
  touched: false,
  touchEndDelay: 100, //ms
  init: function() {
    document.addEventListener('touchstart',  (event)=>{this.events(event)});
    document.addEventListener('touchend',    (event)=>{this.events(event)});
    document.addEventListener('mouseenter',  (event)=>{this.events(event)},true);
    document.addEventListener('mouseleave',  (event)=>{this.events(event)},true);
    document.addEventListener('mousedown',   (event)=>{this.events(event)});
    document.addEventListener('mouseup',     (event)=>{this.events(event)});
    document.addEventListener('contextmenu', (event)=>{this.events(event)});
  },
  events: function(event) {
    let $targets = [];
    $targets[0] = event.target!==document?event.target.closest(this.targets):null;
    let $element = $targets[0], i = 0;

    while($targets[0]) {
      $element = $element.parentNode;
      if($element!==document) {
        if($element.matches(this.targets)) {
          i++;
          $targets[i] = $element;
        }
      } 
      else {
        break;
      }
    }

    //touchstart
    if(event.type=='touchstart') {
      this.touched = true;
      if(this.timeout) clearTimeout(this.timeout);
      if($targets[0]) {
        for(let $target of document.querySelectorAll(this.targets)) $target.classList.remove('touch');
        for(let $target of $targets) $target.setAttribute('data-touch', '');
      }
    } 
    //touchend
    else if(event.type=='touchend' || (event.type=='contextmenu' && this.touched)) {
      this.timeout = setTimeout(() => {this.touched = false}, 500);
      if($targets[0]) {
        setTimeout(()=>{
          for(let $target of $targets) {
            $target.dispatchEvent(new CustomEvent("customTouchend"));
            $target.removeAttribute('data-touch');
          }
        }, this.touchEndDelay)
      }
    } 
    
    //mouseenter
    if(event.type=='mouseenter' && !this.touched && $targets[0] && $targets[0]==event.target) {
      $targets[0].setAttribute('data-hover', '');
    }
    //mouseleave
    else if(event.type=='mouseleave' && !this.touched && $targets[0] && $targets[0]==event.target) {
      $targets[0].removeAttribute('data-focus');
      $targets[0].removeAttribute('data-hover');
    }
    //mousedown
    if(event.type=='mousedown' && !this.touched && $targets[0]) {
      $targets[0].setAttribute('data-focus', '');
    } 
    //mouseup
    else if(event.type=='mouseup' && !this.touched  && $targets[0]) {
      $targets[0].removeAttribute('data-focus');
    }
  }
}

const Preloader = {
  init: function() {
    this.vector = document.querySelector('.preloader__icon');
    this.line1 = document.querySelector('.preloader__back path:nth-child(1)');
    this.line2 = document.querySelector('.preloader__back path:nth-child(2)');
    this.w1 = this.line1.getTotalLength();
    this.w2 = this.line2.getTotalLength();

    this.line1.setAttribute("style", `stroke-dasharray:${this.w1};stroke-dashoffset:0;`);
    this.line2.setAttribute("style", `stroke-dasharray:${this.w2};stroke-dashoffset:0;`);

    this.show();
    setTimeout(()=>{
      this.hide();
    }, speed*1000)

  },
  hide: function() {
    gsap.timeline()
      .fromTo(this.line1, {css:{'stroke-dashoffset':0}}, {css:{'stroke-dashoffset':-this.w1}, duration:speed, ease:'power2.inOut'})
      .fromTo(this.line2, {css:{'stroke-dashoffset':0}}, {css:{'stroke-dashoffset':this.w2}, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
      .to(this.vector, {autoAlpha:0, duration:speed/2, ease:'power2.inOut'}, `-=${speed/2}`)
  }, 
  show: function() {
    gsap.timeline()
      .to(this.vector, {autoAlpha:1, duration:speed/2, ease:'power2.inOut'})
      .fromTo(this.line1, {css:{'stroke-dashoffset':this.w1}}, {css:{'stroke-dashoffset':0}, duration:speed, ease:'power2.inOut'}, `-=${speed/2}`)
      .fromTo(this.line2, {css:{'stroke-dashoffset':-this.w2}}, {css:{'stroke-dashoffset':0}, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
  }
}