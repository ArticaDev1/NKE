import 'lazysizes';
lazySizes.cfg.init = false;
lazySizes.cfg.expand = 100;
lazySizes.cfg.preloadAfterLoad = true;

import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import {disablePageScroll, enablePageScroll, getPageScrollBarWidth} from 'scroll-lock';
import Inputmask from "inputmask";
import SwipeListener from 'swipe-listener';
import autosize from 'autosize';
import Rellax from 'rellax';
const validate = require("validate.js");
import Splide from '@splidejs/splide';

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
const Speed = 1;

const dev = false;

//get width
const contentWidth = () => {
  return $wrapper.getBoundingClientRect().width;
}
//check device
function mobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

//scroll btn
document.addEventListener('click', (event)=>{
  let $btn = event.target!==document?event.target.closest('[data-scroll]'):null;
  if($btn) {
    let target = $btn.getAttribute('data-scroll'), y;
    if(target=='bottom') {
      let $parent = $btn.closest('section');
      y = $parent.getBoundingClientRect().top + $parent.getBoundingClientRect().height + window.pageYOffset;
    } 
    else if(target=='self') {
      let $parent = $btn.closest('section');
      y = $parent.getBoundingClientRect().top + window.pageYOffset;
    }
    else {
      let $target = document.querySelector(target);
      if($target) y = $target.getBoundingClientRect().top + window.pageYOffset;
    }
    Scroll.scrollTop(y+1, Speed);
  }
});

window.onload = function () {
  TouchHoverEvents.init();
  Theme.init();
  Nav.init();
  Preloader.init();
  Header.init();
  Modal.init();
  Scroll.init();
  onExitEvents();
  //form
  Validation.init();
  inputs();
  autosize(document.querySelectorAll('textarea.input__element'));

  //video
  let $video = document.querySelector('.video-slider');
  if ($video) new Video($video, {points: [2, 4, 5.9, 9.08, 11.5]}).init();

  //work slider
  let $work_slider = document.querySelector('.work-slider');
  if($work_slider) new WorkSlider($work_slider).init();
  
  //vsection
  let $vsection = document.querySelector('.v-section');
  if($vsection) {
    let instance;
    let check = ()=>{
      if(window.innerWidth>=brakepoints.xl && !instance) {
        instance = new VSection($vsection);
        instance.init();
      } 
      else if(window.innerWidth<brakepoints.xl && instance) {
        instance.destroy();
        instance = false;
      }
    }
    check();
    window.addEventListener('resize', check);
  }

  //animations
  let $anim_top = document.querySelectorAll('.js-animate-top');
  if($anim_top.length) {
    let animations = [];
    let check=()=>{
      if(window.innerWidth>=brakepoints.xl && !animations.length) {
        $anim_top.forEach(($block, index)=>{
          animations[index] = new TopAnimation($block);
          animations[index].init();
        })
      } 
      else if(window.innerWidth<brakepoints.xl && animations.length) {
        for(let animation of animations) {
          animation.destroy();
        }
        animations = [];
      }
    }
    check();
    window.addEventListener('resize', check);
  }
  let $anim_fade = document.querySelectorAll('.js-animate-fade');
  if($anim_fade.length) {
    let animations = [];
    let check=()=>{
      if(window.innerWidth>=brakepoints.xl && !animations.length) {
        $anim_fade.forEach(($block, index)=>{
          animations[index] = new FadeAnimation($block);
          animations[index].init();
        })
      } 
      else if(window.innerWidth<brakepoints.xl && animations.length) {
        for(let animation of animations) {
          animation.destroy();
        }
        animations = [];
      }
    }
    check();
    window.addEventListener('resize', check);
  }

  //arrow
  let $btn = document.querySelector('.home-screen__scroll');
  if($btn) new ScrollBtn($btn).init();

  //bgvideo
  let $bgvideos = document.querySelectorAll('.background-video');
  if($bgvideos.length) {
    let videos = [];
    let check=()=>{
      if(!mobile() && window.innerWidth>=brakepoints.lg && !videos.length) {
        $bgvideos.forEach(($video, index)=>{
          videos[index] = new BGVideo($video);
          videos[index].init();
        })
      } 
      else if((mobile() || window.innerWidth<brakepoints.lg) && videos.length) {
        for(let video of videos) {
          video.destroy();
        }
        videos = [];
      }
    }
    check();
    window.addEventListener('resize', check);
  }

  //rslider
  let $rslider = document.querySelectorAll('.rslider');
  if($rslider.length) {
    $rslider.forEach(($slider)=>{
      new RSlider($slider).init();
    })
  }

  //else
  if(mobile()) {
    mobileWindow.init();
    $body.classList.add('mobile');
  } else {
    //parralax
    new Rellax('.rellax');
  }

  //lazy
  lazySizes.init();
}

const TouchHoverEvents = {
  targets: 'a, button, label, tr, .jsTouchHover',
  touched: false,
  touchEndDelay: 100, //ms
  init: function () {
    document.addEventListener('touchstart', (event) => {
      this.events(event)
    });
    document.addEventListener('touchend', (event) => {
      this.events(event)
    });
    document.addEventListener('mouseenter', (event) => {
      this.events(event)
    }, true);
    document.addEventListener('mouseleave', (event) => {
      this.events(event)
    }, true);
    document.addEventListener('mousedown', (event) => {
      this.events(event)
    });
    document.addEventListener('mouseup', (event) => {
      this.events(event)
    });
    document.addEventListener('contextmenu', (event) => {
      this.events(event)
    });
  },
  events: function (event) {
    let $targets = [];
    $targets[0] = event.target !== document ? event.target.closest(this.targets) : null;
    let $element = $targets[0],
      i = 0;

    while ($targets[0]) {
      $element = $element.parentNode;
      if ($element !== document) {
        if ($element.matches(this.targets)) {
          i++;
          $targets[i] = $element;
        }
      } else {
        break;
      }
    }

    //touchstart
    if (event.type == 'touchstart') {
      this.touched = true;
      if (this.timeout) clearTimeout(this.timeout);
      if ($targets[0]) {
        for (let $target of $targets) {
          $target.setAttribute('data-touch', '');
          //event
          document.dispatchEvent(new CustomEvent('customTouchstart', {
            detail: {target:$target}
          }));
        }
      }
    }
    //touchend
    else if (event.type == 'touchend' || (event.type == 'contextmenu' && this.touched)) {
      this.timeout = setTimeout(() => {
        this.touched = false
      }, 500);
      if ($targets[0]) {
        setTimeout(() => {
          for (let $target of $targets) {
            $target.removeAttribute('data-touch');
            //event
            document.dispatchEvent(new CustomEvent('customTouchend', {
              detail: {target:$target}
            }));
          }
        }, this.touchEndDelay)
      }
    }

    //mouseenter
    if (event.type == 'mouseenter' && !this.touched && $targets[0] && $targets[0] == event.target) {
      $targets[0].setAttribute('data-hover', '');
      //event
      document.dispatchEvent(new CustomEvent('customMouseenter', {
        detail: {target:$targets[0]}
      }));
    }
    //mouseleave
    else if (event.type == 'mouseleave' && !this.touched && $targets[0] && $targets[0] == event.target) {
      $targets[0].removeAttribute('data-focus');
      $targets[0].removeAttribute('data-hover');
      //event
      document.dispatchEvent(new CustomEvent('customMouseleave', {
        detail: {target:$targets[0]}
      }));
    }
    //mousedown
    if (event.type == 'mousedown' && !this.touched && $targets[0]) {
      $targets[0].setAttribute('data-focus', '');
    }
    //mouseup
    else if (event.type == 'mouseup' && !this.touched && $targets[0]) {
      $targets[0].removeAttribute('data-focus');
    }
  }
}

const Scroll = {
  init: function () {
    this.y = 0;
    window.addEventListener('scroll', () => {
      this.y = window.pageYOffset;
    })
  },
  scrollTop: function (y, speed = 0) {
    if (!this.inScroll) {
      this.inScroll = true;
      if (speed > 0) {
        let scroll = {y: this.y};
        this.animation = gsap.to(scroll, {y: y,duration: speed,ease: 'power2.inOut',onComplete: () => {
          cancelAnimationFrame(this.frame);
          setTimeout(() => {
            this.inScroll = false;
          }, 100)
        }})
        this.checkScroll = () => {
          window.scrollTo(0, scroll.y);
          this.frame = requestAnimationFrame(() => {
            this.checkScroll()
          });
        }
        this.checkScroll();
      } else {
        window.scrollTo(0, y);
      }
    }
  },
  stop: function () {
    this.inScroll = false;
    if (this.animation) this.animation.pause();
    if (this.frame) cancelAnimationFrame(this.frame);
  }
}

const Preloader = {
  init: function () {
    if (!dev) {
      if (!preloader_flag) {
        if (preloader_time < preloader_mintime) {
          setTimeout(() => {
            this.hide();
          }, (preloader_mintime - preloader_time) * 1000)
        }
      } else {
        localStorage.removeItem('preloader');
        this.hide();
      }
    } else {
      $body.style.overflow = 'auto';
      gsap.set($preloader, {
        autoAlpha: 0
      })
    }

  },
  hide: function () {
    $body.style.overflow = 'auto';
    disablePageScroll();
    //home animation
    let $screen = document.querySelector('.home-screen');
    if($screen && !mobile()) {
      let $bg = $screen.querySelector('.home-screen__background img'),
          $text = $screen.querySelectorAll('.home-screen__item');
      gsap.timeline()
        .fromTo($bg, {scale:1.2}, {scale:1, ease:'power2.out', duration:Speed*1.5})
        .fromTo($text, {autoAlpha:0}, {autoAlpha:1, duration:Speed*0.85, ease:'power2.inOut', stagger:{amount:Speed*0.15}}, `-=${Speed}`)
        .fromTo($text, {y:50}, {y:0, duration:Speed*0.85, ease:'power2.out', stagger:{amount:Speed*0.15}}, `-=${Speed}`)
    }
    
    
    //
    gsap.timeline()
      .fromTo($preloader_items[0], {css: {'stroke-dashoffset': preloader_values[0] * 2}}, {css: {'stroke-dashoffset': preloader_values[0]},duration: Speed * 0.75,ease: 'power2.inOut'})
      .fromTo($preloader_items[1], {css: {'stroke-dashoffset': preloader_values[1] * 2}}, {css: {'stroke-dashoffset': preloader_values[1]},duration: Speed * 0.75,ease: 'power2.inOut'}, `-=${Speed*0.75}`)
      .to($preloader, {autoAlpha: 0,duration:Speed/2, ease:'power2.inOut'}, `-=${Speed*0.5}`)
      .eventCallback('onComplete', () => {
        enablePageScroll();
      })
  },
  show: function (callback) {
    disablePageScroll();
    gsap.timeline()
      .to($preloader, {autoAlpha: 1,duration: Speed * 0.5,ease: 'power2.inOut'})
      .fromTo($preloader_items[0], {css: {'stroke-dashoffset': preloader_values[0]}}, {css: {'stroke-dashoffset': 0},duration: Speed * 0.75,ease: 'power2.inOut'}, `-=${Speed*0.5}`)
      .fromTo($preloader_items[1], {css: {'stroke-dashoffset': preloader_values[1]}}, {css: {'stroke-dashoffset': 0},duration: Speed * 0.75,ease: 'power2.inOut'}, `-=${Speed*0.75}`)
      .eventCallback('onComplete', () => {
        if (callback) callback();
      })
  }
}

function onExitEvents() {
  document.addEventListener('click', (event) => {
    let $link = event.target !== document ? event.target.closest('a') : false;
    if ($link) {
      let href = $link.getAttribute('href'),
        split = href.split('/')[0];
      if ((split == '.' || split == '') && !dev) {
        event.preventDefault();
        Nav.close();
        Preloader.show(() => {
          localStorage.setItem('preloader', 'true');
          document.location.href = href;
        })
      }
    }
  });
}

const Theme = {
  init: function () {
    let $toggle = document.querySelectorAll('[data-theme-toggle]');
    $toggle.forEach(($this) => {
      $this.addEventListener('click', () => {
        localStorage.setItem('theme_time', +new Date());
        if (theme_state) {
          theme_state = false;
          localStorage.setItem('theme', 'dark');
          theme_dark.removeAttribute('disabled');
        } else {
          theme_state = true;
          localStorage.setItem('theme', 'light');
          theme_dark.setAttribute('disabled', '');
        }
      })
    })
  }
}

const Header = {
  init: function () {
    this.scrollY = 0;
    window.addEventListener('scroll', () => {
      this.check();
    })
    this.check();
  },
  check: function () {
    let y = window.pageYOffset,
        h = window.innerHeight/2;

    if (y > 0 && !this.fixed) {
      this.fixed = true;
      $header.classList.add('header_fixed');
    } else if (y<=0 && this.fixed) {
      this.fixed = false;
      $header.classList.remove('header_fixed');
    }

    if(this.scrollY<y && this.scrollY>h && !this.hidden && !Nav.opened) {
      this.hidden = true;
      $header.classList.add('header_hidden');
    } else if(this.scrollY>y && this.hidden) {
      this.hidden = false;
      $header.classList.remove('header_hidden');
    }  

    //check
    let count = 0;
    document.querySelectorAll('[data-hide-header]').forEach(($element, index)=>{
      let h = $element.getBoundingClientRect().height;
      if(h<window.innerHeight+2 && h>window.innerHeight-2) {
        let t = $element.getBoundingClientRect().top;
        if(t<2 && t>-2) {
          count++;
        }
      }
    })

    if(count>0) {
      $header.classList.add('header_content-hidden');
    } else {
      $header.classList.remove('header_content-hidden');
    }

    this.scrollY = y;
  }
}

const Nav = {
  init: function () {
    this.$nav = document.querySelector('.nav');
    this.$bg = document.querySelector('.nav__bg');
    this.$container = document.querySelector('.nav__container');
    this.$toggle = document.querySelector('.nav-toggle');
    this.$theme = document.querySelector('.nav__theme');
    this.$theme_t = document.querySelector('.header .theme-toggle-btn');
    this.$items = document.querySelectorAll('.nav__item');
    this.$dev = document.querySelector('.nav .dev-label');
    this.$copy = document.querySelector('.nav__copy');
    this.$socials = document.querySelectorAll('.nav .socials__item');
    this.state = false;
    this.opened = false;

    if(window.innerWidth<brakepoints.sm) {
      let w1 = this.$theme.getBoundingClientRect().width,
          x1 = this.$theme_t.getBoundingClientRect().left,
          val = x1 - w1 - 16;
      this.swanim = gsap.timeline({paused:true}).to(this.$theme_t, {x:-val, duration:Speed*0.5, ease:'power2.inOut'})
    }

    this.animation = gsap.timeline({paused: true,
        onStart: () => {
          disablePageScroll();
          this.opened = true;
        },
        onReverseComplete: () => {
          enablePageScroll();
          this.opened = false;
        }
      })
      .set(this.$nav, {autoAlpha: 1})
      .fromTo(this.$bg, {autoAlpha: 0}, {autoAlpha: 1,duration: Speed * 0.5,ease: 'power2.out'})
      .fromTo(this.$container, {xPercent: 100}, {xPercent: 0,duration: Speed * 0.5,ease: 'power2.out'}, `-=${Speed*0.5}`)
      .fromTo([this.$theme, this.$dev, this.$copy], {autoAlpha: 0,x: 15}, {autoAlpha: 1,x: 0,duration: Speed * 0.35,ease: 'power2.inOut'}, `-=${Speed*0.35}`)
      .fromTo(this.$items, {autoAlpha: 0,x: 15}, {autoAlpha: 1,x: 0,duration: Speed * 0.35,ease: 'power2.inOut',stagger: {amount: Speed * 0.15}}, `-=${Speed*0.5}`)
      .fromTo(this.$socials, {autoAlpha: 0,x: 15}, {autoAlpha: 1,x: 0,duration: Speed * 0.35,ease: 'power2.inOut',stagger: {amount: Speed * 0.15}}, `-=${Speed*0.5}`)

    this.$bg.addEventListener('click', () => {
      if (this.state) this.close();
    })
    this.$toggle.addEventListener('click', () => {
      if (!this.state) this.open();
      else this.close();
    })

    this.setSize();
    window.addEventListener('resize', () => {
      this.setSize()
    });
  },
  setSize: function () {
    if (window.innerWidth >= brakepoints.sm) {
      let cw = document.querySelector('.container').getBoundingClientRect().width,
        w2 = (contentWidth() - cw) / 2,
        nw = this.$container.querySelector('.nav__block').getBoundingClientRect().width;
      this.$container.style.width = `${nw+w2}px`;
    }
  },
  open: function () {
    if (this.timeout) clearTimeout(this.timeout);
    $header.classList.add('header_nav-opened');
    this.$nav.classList.add('nav_opened');
    this.$toggle.classList.add('active');
    this.state = true;
    this.animation.play();
    if(this.swanim) this.swanim.play();
  },
  close: function () {
    this.timeout = setTimeout(() => {
      $header.classList.remove('header_nav-opened');
    }, Math.max(0, (this.animation.time() - 0.2) * 1000));
    this.$nav.classList.remove('nav_opened');
    this.$toggle.classList.remove('active');
    this.state = false;
    this.animation.reverse();
    if(this.swanim) this.swanim.reverse();
  }
}

function inputs() {
  let $inputs = document.querySelectorAll('input, textarea');
  $inputs.forEach(($input) => {

    $input.addEventListener('focus', () => {
      $input.parentNode.classList.add('focused');
    })

    $input.addEventListener('blur', () => {
      let value = $input.value;
      if (validate.single(value, {presence: {allowEmpty: false}}) !== undefined) {
        $input.value = '';
        $input.parentNode.classList.remove('focused');
        //textarea
        if($input.tagName=='TEXTAREA') {
          $input.style.height = '45px';
        }
      }
    })

  })

}

const Validation = {
  init: function () {
    this.namspaces = {
      name: 'name',
      phone: 'phone',
      email: 'email',
      message: 'message'
    }
    this.constraints = {
      name: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваше имя'
        },
        format: {
          pattern: /[A-zА-яЁё ]+/,
          message: '^Введите корректное имя'
        },
        length: {
          minimum: 2,
          tooShort: "^Имя слишком короткое (минимум %{count} символа)",
          maximum: 20,
          tooLong: "^Имя слишком длинное (максимум %{count} символов)"
        }
      },
      phone: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваш номер телефона'
        },
        format: {
          pattern: /^\+7 \d{3}\ \d{3}\-\d{4}$/,
          message: '^Введите корректный номер телефона'
        }
      },
      email: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваш email'
        },
        email: {
          message: '^Неправильный формат email-адреса'
        }
      },
      message: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваше сообщение'
        },
        length: {
          minimum: 2,
          tooShort: "^Сообщение слишком короткое (минимум %{count} символа)",
          maximum: 100,
          tooLong: "^Сообщение слишком длинное (максимум %{count} символов)"
        }
      }
    };
    this.mask = Inputmask({
      mask: "+7 999 999-9999",
      showMaskOnHover: false,
      clearIncomplete: false
    }).mask("[data-validate='phone']");

    gsap.registerEffect({
      name: "fadeMessages",
      effect: ($message) => {
        return gsap.timeline({
          paused: true
        }).fromTo($message, {
          autoAlpha: 0
        }, {
          autoAlpha: 1,
          duration: 0.3,
          ease: 'power2.inOut'
        })
      }
    });

    document.addEventListener('submit', (event) => {
      let $form = event.target,
        $inputs = $form.querySelectorAll('input, textarea'),
        l = $inputs.length,
        i = 0;
      while (i < l) {
        if ($inputs[i].getAttribute('data-validate')) {
          event.preventDefault();
          let flag = 0;
          $inputs.forEach(($input) => {
            if (!this.validInput($input)) flag++;
          })
          if (!flag) this.submitEvent($form);
          break;
        } else i++
      }
    })

    document.addEventListener('input', (event) => {
      let $input = event.target,
        $parent = $input.parentNode;
      if ($parent.classList.contains('error')) {
        this.validInput($input);
      }
    })

  },
  validInput: function ($input) {
    let $parent = $input.parentNode,
      type = $input.getAttribute('data-validate'),
      required = $input.getAttribute('data-required') !== null,
      value = $input.value,
      empty = validate.single(value, {
        presence: {
          allowEmpty: false
        }
      }) !== undefined,
      resault;

    for (let key in this.namspaces) {
      if (type == key && (required || !empty)) {
        resault = validate.single(value, this.constraints[key]);
        break;
      }
    }
    //если есть ошибки
    if (resault) {
      if (!$parent.classList.contains('error')) {
        $parent.classList.add('error');
        $parent.insertAdjacentHTML('beforeend', `<span class="input__message">${resault[0]}</span>`);
        let $message = $parent.querySelector('.input__message');
        gsap.effects.fadeMessages($message).play();
      } else {
        $parent.querySelector('.input__message').textContent = `${resault[0]}`;
      }
      return false;
    }
    //если нет ошибок
    else {
      if ($parent.classList.contains('error')) {
        $parent.classList.remove('error');
        let $message = $parent.querySelector('.input__message');
        gsap.effects.fadeMessages($message).reverse(1).eventCallback('onReverseComplete', () => {
          $message.remove();
        });
      }
      return true;
    }
  },
  reset: function ($form) {
    let $inputs = $form.querySelectorAll('input, textarea');
    $inputs.forEach(($input) => {
      $input.value = '';
      //textarea
      if($input.tagName=='TEXTAREA') {
        $input.style.height = '45px';
      }

      let $parent = $input.parentNode;
      if ($parent.classList.contains('focused')) {
        $parent.classList.remove('focused');
      }
      if ($parent.classList.contains('error')) {
        $parent.classList.remove('error');
        let $message = $parent.querySelector('.input__message');
        gsap.effects.fadeMessages($message).reverse(1).eventCallback('onReverseComplete', () => {
          $message.remove();
        });
      }
    })
  },
  submitEvent: function ($form) {
    let $submit = $form.querySelector('button'),
        $inputs = $form.querySelectorAll('input, textarea');
    $inputs.forEach(($input) => {
      $input.parentNode.classList.add('loading');
    })
    $submit.classList.add('loading');
    //test
    setTimeout(() => {
      $inputs.forEach(($input) => {
        $input.parentNode.classList.remove('loading');
      })
      $submit.classList.remove('loading');
      this.reset($form);
      Modal.open(document.querySelector('#succes'));
      setTimeout(()=>{
        Modal.close();
      }, 3000)
    }, 2000)
  }
}

const mobileWindow = {
  init: function () {
    let $el = document.createElement('div')
    $el.style.cssText = 'position:fixed;height:100%;';
    $body.insertAdjacentElement('beforeend', $el);
    this.h = $el.getBoundingClientRect().height;
    $el.remove();
    //
    let $window = document.querySelector('[data-mobile-window]');
    if ($window) {
      $window.style.height = `${this.h}px`;
      let wh = $window.getBoundingClientRect().height;
      if ($window.closest('.home')) {
        let $block = document.querySelector('.home-more'),
            $bg = document.querySelector('.home-screen__background'),
          h = $block.getBoundingClientRect().height;
        $window.style.paddingBottom = `${h+50}px`;
        $block.style.marginTop = `${-h}px`;
        $bg.style.height = `${wh-h}px`;
      }
    }
  }
}

const Modal = {
  init: function () {
    gsap.registerEffect({
      name: "modal",
      effect: ($modal, $content) => {
        let anim = gsap.timeline({paused: true}).fromTo($modal, {autoAlpha: 0}, {autoAlpha: 1,duration: Speed / 2,ease: 'power2.inOut'})
          .fromTo($content, {y: 20}, {y: 0,duration: Speed,ease: 'power2.out'}, `-=${Speed/2}`)
        return anim;
      },
      extendTimeline: true
    });

    document.addEventListener('click', (event) => {
      let $open = event.target.closest('[data-modal="open"]'),
        $close = event.target.closest('[data-modal="close"]'),
        $wrap = event.target.closest('.modal'),
        $block = event.target.closest('.modal-block');

      //open
      if ($open) {
        event.preventDefault();
        let $modal = document.querySelector(`${$open.getAttribute('href')}`);
        this.open($modal);
      }
      //close 
      else if ($close || (!$block && $wrap)) {
        this.close();
      }

    })


  },
  open: function ($modal) {
    let play = () => {
      this.$active = $modal;
      disablePageScroll();
      $header.classList.add('header_hidden');
      let $content = $modal.querySelector('.modal-block');
      this.animation = gsap.effects.modal($modal, $content);
      this.animation.play();
    }
    if ($modal) {
      if (this.$active) this.close(play);
      else play();
    }
  },
  close: function (callback) {
    if(this.$active) {
      this.animation.timeScale(2).reverse().eventCallback('onReverseComplete', () => {
        $header.classList.remove('header_hidden');
        delete this.animation;
        enablePageScroll();
        if (callback) callback();
      })
      //reset form
      let $form = this.$active.querySelector('form');
      if ($form) Validation.reset($form);
  
      delete this.$active;
    }
  }
}

class Video {
  constructor($parent, options = {}) {
    this.$parent = $parent;
    this.points = options.points;
  }

  init() {
    this.index = 0;
    this.$wrapper = this.$parent.querySelector('.video-slider__background');
    this.$videos = this.$parent.querySelectorAll('.video-slider__video');
    this.$video_normal = this.$parent.querySelector('.video-slider__video_normal');
    this.$video_reversed = this.$parent.querySelector('.video-slider__video_reversed');
    this.$content = this.$parent.querySelector('.video-slider__content');
    this.$time_item = this.$parent.querySelector('.video-slider__timeline-item');
    this.$index_value = this.$parent.querySelector('.video-slider__timeline-item span');
    this.$next = this.$parent.querySelector('.video-slider__next');
    this.$prev = this.$parent.querySelector('.video-slider__prev');
    this.$title = this.$parent.querySelectorAll('.video-slider__title');
    this.$text = this.$parent.querySelectorAll('.video-slider__text-item');

    //create timeline
    this.$time_item.style.width = `${100/(this.points.length+2)}%`;
    this.$index_value.textContent = '01';
    gsap.set(this.$title[0], {autoAlpha:1})
    gsap.set(this.$text[0], {autoAlpha:1})

    //load videos
    let loaded = 0;
    [this.$video_reversed, this.$video_normal].forEach(($element)=>{
      let $src = $element.querySelector('source'),
          src = $src.getAttribute('data-src');
      $src.removeAttribute('data-src');
      $src.setAttribute('src', src);
      $element.addEventListener('canplaythrough', (event)=>{
        loaded++;
        if(loaded==2) this.loaded();
      })
      $element.load();
    })

    this.resize = () => {
      let h = this.$wrapper.getBoundingClientRect().height,
        w = contentWidth(),
        res = 0.5625;

      if (h / w < res) {
        this.$videos.forEach(($video) => {
          $video.style.width = `${w}px`;
          $video.style.height = `auto`;
        })
      } else {
        this.$videos.forEach(($video) => {
          $video.style.width = `auto`;
          $video.style.height = `${h}px`;
        })
      }

      //content
      let h1 = [], h2 = [];
      this.$title.forEach(($element, index)=>{
        h1[index] = $element.getBoundingClientRect().height;
      })
      this.$text.forEach(($element, index)=>{
        h2[index] = $element.getBoundingClientRect().height;
      })
      let v1 = Math.max(...h1), v2 = Math.max(...h2);
      this.$title[0].parentNode.style.height = `${v1}px`;
      this.$text[0].parentNode.style.height = `${v2}px`;
    } 

    this.autoScroll = () => {
      if (this.autoscroll_timeout) clearTimeout(this.autoscroll_timeout);
      if(!mobile()) {
        let h = this.$parent.getBoundingClientRect().height;
        if(!Scroll.inScroll && h==window.innerHeight) {
          let y = this.$parent.getBoundingClientRect().top,
              t = this.$parent.getBoundingClientRect().top + pageYOffset;
          if (h/3 - y > 0 && h * 1.33 > window.innerHeight - y) {
            this.autoscroll_timeout = setTimeout(() => {
              Scroll.scrollTop(t, Speed);
            }, 100)
          } 
        } 
      }
    }

    this.checkInfo = ()=> {
      if(this.index==0) this.first_slide=true;
      else this.first_slide=false;
      if(this.index==this.points_normal.length-1) this.last_slide=true;
      else this.last_slide=false;
    }

    this.checkButtons = () => {
      this.$prev.classList.remove('disabled', 'last');
      this.$next.classList.remove('disabled');
      if(this.first_slide) {
        this.$prev.classList.add('disabled');
      } else if (this.last_slide) {
        this.$next.classList.add('disabled');
        this.$prev.classList.add('last');
      }
    }

    //controls events
    this.$next.addEventListener('click', () => {
      if (!this.played && this.initialized && !this.last_slide) this.slide('next');
    })
    this.$prev.addEventListener('click', () => {
      if (!this.played && this.initialized && !this.first_slide) this.slide('prev');
    })
    this.swipes = SwipeListener(this.$parent);
    this.$parent.addEventListener('swipe', (event) => {
      if(!this.played && this.initialized) {
        if (event.detail.directions.left && !this.last_slide) this.slide('next');
        else if (event.detail.directions.right && !this.first_slide) this.slide('prev');
      }
    });
    document.addEventListener('keyup', (event) => {
      if(!this.played && this.initialized) {
        if (event.code == 'ArrowRight' && !this.last_slide) this.slide('next');
        else if (event.code == 'ArrowLeft' && !this.first_slide) this.slide('prev');
      }
    });

    //after videos loaded
    this.loaded = ()=> {
      this.points_normal = this.points;
      this.points_normal.unshift(0);
      this.points_normal.push(this.$video_normal.duration);
      this.points_reversed = [];
      for (let point of this.points_normal) {
        this.points_reversed.push(this.$video_normal.duration - point);
      }
      this.$video_normal.classList.add('loaded');
      setTimeout(()=>{
        this.$video_reversed.classList.add('loaded');
      }, 500)
      this.checkInfo();
      this.checkButtons();
      this.initialized = true;
    }

    //wheel
    window.addEventListener('wheel', ()=>{
      if(Scroll.inScroll) Scroll.stop();
    });
    //resize
    this.resize();
    window.addEventListener('resize', this.resize);
    //scroll
    window.addEventListener('scroll', this.autoScroll);
  }


  slide(direction) {
    this.played = true;

    let index,
      vn = this.$video_normal,
      vr = this.$video_reversed;

    if (direction == 'next') index = this.index + 1;
    else index = this.index - 1;
    //
    let pn = this.points_normal[index],
        pr = this.points_reversed[index],
        time = Math.abs(pn - this.points_normal[this.index]);

    gsap.to(this.$time_item, {xPercent: 100 * index, duration: time, ease: 'power2.inOut'});

    //change text animations
    let $items_old = [this.$title[this.index], this.$text[this.index]],
        $items_new = [this.$title[index], this.$text[index]],
        x, y;
    if(window.innerWidth>=brakepoints.lg) {x=0;y=40;}
    else {x=60;y=0;}
    let animation_start = gsap.timeline({paused:true})
      .to($items_old, {autoAlpha:0, duration:Speed*0.5, ease:'power2.inOut', stagger:{amount:Speed*0.1}})
      .to($items_old, {y:-y, x:-x, duration:Speed*0.5, ease:'power2.in', stagger:{amount:Speed*0.1}}, `-=${Speed*0.6}`)
    let animation_finish = gsap.timeline({paused:true})
      .fromTo($items_new, {autoAlpha:0}, {autoAlpha:1, duration:Speed*0.5, ease:'power2.inOut', stagger:{amount:Speed*0.1}})
      .fromTo($items_new, {y:y, x:x}, {y:0, x:0, duration:Speed*0.5, ease:'power2.out', stagger:{amount:Speed*0.1}}, `-=${Speed*0.6}`)

    let changeIndex = (time, x) => {
      gsap.timeline()
        .to(this.$index_value, {x: x,duration: time / 2,ease: 'power2.in'})
        .to(this.$index_value, {autoAlpha: 0,duration: time / 2,ease: 'power2.inOut',onComplete: () => {
            let idx = index + 1,
                val = idx < 10 ? '0' + idx : idx;
            this.$index_value.textContent = val;
          }
        }, `-=${time/2}`)
        .fromTo(this.$index_value, {x: -x}, {immediateRender: false,x: 0,duration: time / 2,ease: 'power2.out'})
        .to(this.$index_value, {autoAlpha: 1,duration: time / 2,ease: 'power2.inOut'}, `-=${time/2}`)
    }

    let play = (video1, video2, point1, point2) => {
      video1.style.zIndex = '3';
      video2.style.zIndex = '2';
      video1.play();
      setTimeout(()=>{
        video2.currentTime = point2;
      }, 100)
      this.interval = setInterval(() => {
        if (video1.currentTime >= point1) {
          clearInterval(this.interval);
          video1.currentTime = point1;
          video1.pause();
          this.$parent.classList.remove('disabled');
          if(window.innerWidth>=brakepoints.lg) {
            animation_finish.play().eventCallback('onComplete', ()=>{
              this.played = false;
            });
          } else {
            this.played = false;
          }
        }
      }, 50)
    }

    this.index = index;
    this.checkInfo();
    this.checkButtons();
    this.$parent.classList.add('disabled');

    if(window.innerWidth<brakepoints.lg) {
      animation_start.play().eventCallback('onComplete', ()=>{
        animation_finish.play();
      })
    } else {
      animation_start.play();
    }

    if (direction == 'next') {
      play(vn, vr, pn, pr);
      changeIndex(time, 15);
    } else if (direction == 'prev') {
      play(vr, vn, pr, pn);
      changeIndex(time, -15);
    }

  }
}

class WorkSlider {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$slider = this.$parent.querySelector('.splide');

    let timeout1, timeout2, flag;
    let Event = (event)=> {
      let $target = event.detail.target !== document ? event.detail.target.closest('.work-slide__container') : null;
      if((event.type=='customMouseenter' && event.detail.target==$target) || (event.type=='customTouchstart' && $target)) {
        clearTimeout(timeout2)
        if(!flag) {
          flag=true;
          $target.parentNode.classList.add('is-active');
        } else {
          timeout1 = setTimeout(()=>{
            $target.parentNode.classList.add('is-active');
          }, 200)
        }
      } 
      
      else if((event.type=='customMouseleave' && event.detail.target==$target) || (event.type=='customTouchend' && $target)) {
        clearTimeout(timeout1)
        timeout2 = setTimeout(()=>{
          flag = false;
        }, 200)
        $target.parentNode.classList.remove('is-active');
      }
    }

    let Click = (event)=> {
      let $target = event.target!==document?event.target.closest('.work-slide'):false,
          slide_index,
          next_index;

      if($target) {
        this.$slider.querySelectorAll('.work-slide').forEach(($this, index)=>{
          if($this.classList.contains('is-active')) {
            slide_index = index;
          }
          if($this==$target) {
            next_index = index;
          }
        })
        let val = next_index-slide_index;
        if(val!==0) {
          if(val>0) val = '+'+val;
          this.slider.go(val, false)
        }
      }
    }

    let check = ()=> {
      if(window.innerWidth<brakepoints.xl && (!this.initialized || !this.flag)) {
        this.flag = true;
        //init
        this.slider = new Splide(this.$slider, {
          type: 'loop',
          perPage: 5,
          perMove: 1,
          flickPower: 10,
          updateOnMove: true,
          focus: 'center',
          arrows: false,
          pagination: false,
          speed: Speed*500,
        });
        this.slider.mount();
        document.addEventListener('click', Click);

        //destroy
        if(this.custom_events) {
          delete this.custom_events;
          document.removeEventListener('customMouseenter', Event)
          document.removeEventListener('customMouseleave', Event)
          document.removeEventListener('customTouchstart', Event)
          document.removeEventListener('customTouchend',   Event)
        }
      } 
      
      else if(window.innerWidth>=brakepoints.xl && (!this.initialized || this.flag)) {
        this.flag = false;
        //init
        this.custom_events = true;
        document.addEventListener('customMouseenter', Event)
        document.addEventListener('customMouseleave', Event)
        document.addEventListener('customTouchstart', Event)
        document.addEventListener('customTouchend',   Event)
        //destroy
        if(this.slider) {
          this.slider.destroy();
          document.removeEventListener('click', Click);
          delete this.slider;
        }
      }
      this.initialized = true;
    }

    check();
    window.addEventListener('resize', check);
  }
}

class ScrollBtn {
  constructor($button) {
    this.$button = $button;
  }
  init() {
    this.$button_icon = this.$button.querySelector('.icon');

    let mobileParralax = ()=> {
      let scroll = window.pageYOffset,
          factor, val;
      //btn
      if(this.old_scroll>scroll && scroll>0) {
        this.$button_icon.classList.add('top');
      } else {
        this.$button_icon.classList.remove('top');
      }


      if(window.innerWidth<brakepoints.sm) {
        factor = Math.min(scroll/(window.innerHeight/2), 1);
        val = 40*factor;
      }
      else {
        factor = Math.min(scroll/(window.innerHeight + 90), 1);
        val = 60*factor;
      }

      this.$button.style.transform = `translateY(${val}px)`;

      this.old_scroll = scroll;
    }

    mobileParralax();
    window.addEventListener('scroll', mobileParralax); 
  }
}

class BGVideo {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.source = this.$parent.getAttribute('data-src');
    //create video
    this.$parent.insertAdjacentHTML('afterbegin', `
      <video class="background-video__element" muted>
        <source src=${this.source} type="video/mp4" />
      </video>
    `)
    this.$video = this.$parent.querySelector('.background-video__element');

    this.animation = gsap.timeline({paused:true})
      .fromTo(this.$video, {autoAlpha:0}, {autoAlpha:1, duration:Speed, ease:'power2.inOut'})

    this.resize = () => {
      let h = this.$parent.getBoundingClientRect().height,
          w = contentWidth(),
          res = 0.5625;
      if (h / w < res) {
        this.$video.style.width = `${w}px`;
        this.$video.style.height = `auto`;
      } else {
        this.$video.style.width = `auto`;
        this.$video.style.height = `${h}px`;
      }
    } 

    this.load = ()=> {
      let check = ()=> {
        this.$video.play();
        this.animation.play();
        this.check_interval = setInterval(()=>{
          if(Math.ceil(this.$video.currentTime)+Speed > this.$video.duration) {
            clearInterval(this.check_interval);
            this.animation.reverse().eventCallback('onReverseComplete', ()=>{
              this.$video.pause();
              this.$video.currentTime = 0;
              check();
            });
          }
        }, 1000)
      }
      check();
    }


    this.$video.addEventListener('canplaythrough', this.load);
    //resize
    this.resize();
    window.addEventListener('resize', this.resize);
    //load
    this.$video.load();
  }

  destroy() {
    window.removeEventListener('resize', this.resize);
    if(this.check_interval) clearInterval(this.check_interval);
    this.$video.remove();
    for(let child in this) {
      delete this[child];
    }
  }
}

class VSection {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$swrapper = this.$parent.querySelector('.v-section__size-wrapper');
    this.$container = this.$parent.querySelector('.v-section__outer');
    this.$wrapper = this.$parent.querySelector('.v-section__wrapper');
    this.$content = this.$parent.querySelector('.v-section__content');
    this.$button = this.$parent.querySelector('.v-section__btn');
    this.$button_icon = this.$parent.querySelector('.v-section__btn .icon');
    this.$blocks = this.$parent.querySelectorAll('.content-block');
    this.$images = this.$parent.querySelectorAll('.content-block .image');
    
    this.updateParams = ()=> {
      this.$container.style.paddingRight = `${getPageScrollBarWidth()}px`;
      let content_width = this.$content.getBoundingClientRect().width,
          wrapper_width = this.$wrapper.getBoundingClientRect().width;
      this.sw = content_width - wrapper_width;
      //animations
      this.v_animation = gsap.timeline({paused:true})
        .fromTo(this.$wrapper, {y:30}, {y:0, duration:1, ease:'power2.out'})
        .fromTo(this.$wrapper, {x:0}, {x:-this.sw, duration:4, ease:'power1.inOut'}, '-=1')
        .to(this.$wrapper, {y:-30, duration:1, ease:'power2.in'}, '-=1')
      this.animation = gsap.timeline({paused:true})
        .fromTo(this.$blocks, {autoAlpha:0, y:50}, {autoAlpha:1, y:0, duration:1, ease:'power1.inOut', stagger:{each:0.5}})
    }

    this.updateParams();
    window.addEventListener('resize', this.updateParams);

    this.st = [];

    this.st[0] = ScrollTrigger.create({
      trigger: this.$container,
      start: "top top",
      end: `+=${this.sw}`,
      pin: true,
      scrub: true,
      onUpdate: self => {
        this.v_animation.progress(self.progress);
        this.$button_icon.classList.remove('back', 'forward', 'top');
        if(self.direction>0) {
          this.$button_icon.classList.add('forward');
        } else {
          this.$button_icon.classList.add('back')
        }
      }
    });

    this.st[1] = ScrollTrigger.create({
      trigger: this.st[0].spacer,
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      onUpdate: self => {
        this.animation.progress(self.progress);
      }
    });

    this.st[2] = ScrollTrigger.create({
      trigger: this.st[0].spacer,
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: self => {
        this.$button_icon.classList.remove('back', 'forward', 'top');
        if(self.direction<0 && self.progress>0) {
          this.$button_icon.classList.add('top');
        }
        let h = this.$container.getBoundingClientRect().height,
            val = (((h+60)/2))*self.progress;
        this.$button.style.transform = `translate3d(0, ${val}px, 0)`;
      }
    });
    
    this.st[3] = ScrollTrigger.create({
      trigger: this.st[0].spacer,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: self => {
        this.$button_icon.classList.remove('back', 'forward', 'top');
        if(self.direction<0) {
          this.$button_icon.classList.add('top');
        }
        let h = this.$container.getBoundingClientRect().height,
            val = (((h+60)/2))*(1+self.progress/1.5);
        this.$button.style.transform = `translate3d(0, ${val}px, 0)`;
      }
    }); 
    
  }

  destroy() {
    window.removeEventListener('resize', this.updateParams);
    this.v_animation.kill();
    this.animation.kill();
    for(let child of this.st) {
      child.kill();
    }
    gsap.set(this.$blocks, {autoAlpha:1, y:0})
    for(let child in this) {
      delete this[child];
    }
  }

}

class TopAnimation {
  constructor($block) {
    this.$block = $block;
  }

  init() {
    this.$child = this.$block.children[0];
    this.animation = gsap.timeline({paused:true})
      .fromTo(this.$block, {autoAlpha:0}, {autoAlpha:1, duration:1, ease:'power2.inOut'})
      .fromTo(this.$child, {y:100}, {y:0, duration:1, ease:'power2.out'}, '-=1')

    this.trigger = ScrollTrigger.create({
      trigger: this.$block,
      start: "top bottom",
      end: "center center",
      scrub: true,
      animation: this.animation
    });
  }

  destroy() {
    this.trigger.kill();
    this.animation.kill();
    gsap.set(this.$block, {autoAlpha:1});
    gsap.set(this.$child, {y:0});
  }
}

class FadeAnimation {
  constructor($block) {
    this.$block = $block;
  }
  init() {
    this.animation = gsap.timeline({paused:true})
      .fromTo(this.$block, {autoAlpha:0}, {autoAlpha:1, duration:1, ease:'power2.inOut'})
      .fromTo(this.$block, {scale:0.7}, {scale:1, duration:1, ease:'power2.out'}, '-=1')

    this.trigger = ScrollTrigger.create({
      trigger: this.$block,
      start: "top bottom",
      end: "center center",
      scrub: true,
      animation: this.animation
    });
  }

  destroy() {
    this.trigger.kill();
    this.animation.kill();
    gsap.set(this.$block, {autoAlpha:1, scale:1});
  }
}

class RSlider {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    //init
    this.slider = new Splide(this.$parent, {
      type: 'loop',
      perPage: 1,
      perMove: 1,
      arrows: true,
      pagination: true,
      speed: Speed*500,
    });
    this.slider.mount();

  }
}
