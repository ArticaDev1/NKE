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
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import Inputmask from "inputmask";
const validate = require("validate.js");

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

const dev = false;

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
  Theme.init();
  Nav.init();
  Preloader.init();
  Header.init();
  Validation.init();
  onExitEvents();
  inputs();
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
    if(!dev) {
      if(!preloader_flag) {
        if(preloader_time<preloader_mintime) {
          setTimeout(()=>{
            this.hide();
          }, (preloader_mintime-preloader_time)*1000)
        }
      } else {
        localStorage.removeItem('preloader');
        this.hide();
      }
    } else {
      gsap.set($preloader, {autoAlpha:0})
    }
    
  },
  hide: function() {
    gsap.timeline()
      .fromTo($preloader_items[0], {css:{'stroke-dashoffset':preloader_values[0]*2}}, {css:{'stroke-dashoffset':preloader_values[0]}, duration:speed*0.75, ease:'power2.inOut'})
      .fromTo($preloader_items[1], {css:{'stroke-dashoffset':preloader_values[1]*2}}, {css:{'stroke-dashoffset':preloader_values[1]}, duration:speed*0.75, ease:'power2.inOut'}, `-=${speed*0.75}`)
      .to($preloader, {autoAlpha:0, duration:speed/2, ease:'power2.inOut'}, `-=${speed*0.5}`)
  }, 
  show: function(callback) {
    gsap.timeline()
      .to($preloader, {autoAlpha:1, duration:speed*0.5, ease:'power2.inOut'})
      .fromTo($preloader_items[0], {css:{'stroke-dashoffset':preloader_values[0]}}, {css:{'stroke-dashoffset':0}, duration:speed*0.75, ease:'power2.inOut'}, `-=${speed*0.5}`)
      .fromTo($preloader_items[1], {css:{'stroke-dashoffset':preloader_values[1]}}, {css:{'stroke-dashoffset':0}, duration:speed*0.75, ease:'power2.inOut'}, `-=${speed*0.75}`)
      .eventCallback('onComplete', ()=>{
        if(callback) callback();
      })
  }
}


function onExitEvents() {
  document.addEventListener('click',  (event)=>{
    let $link = event.target!==document?event.target.closest('a'):false;
    if($link) {
      let href = $link.getAttribute('href'),
          split = href.split('/')[0];
      if((split=='.' || split=='') && !dev) {
        event.preventDefault();
        Nav.close();
        Preloader.show(()=>{
          localStorage.setItem('preloader', 'true');
          document.location.href = href;
        })
      }
    }
  });
}

const Theme = {
  init: function() {
    let $toggle = document.querySelectorAll('[data-theme-toggle]');
    $toggle.forEach(($this)=>{
      $this.addEventListener('click', ()=>{
        localStorage.setItem('theme_time', +new Date());
        if(theme_state) {
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
  init: function() {
    window.addEventListener('scroll', ()=>{
      this.check();
    })
    this.check();
  }, 
  check: function() {
    let y = window.pageYOffset;

    if(y>0 && !this.fixed) {
      this.fixed = true;
      $header.classList.add('header_fixed');
    } else if(y==0 && this.fixed) {
      this.fixed = false;
      $header.classList.remove('header_fixed');
    }
  }
}

const Nav = {
  init: function() {
    this.$nav = document.querySelector('.nav');
    this.$bg = document.querySelector('.nav__bg');
    this.$container = document.querySelector('.nav__container');
    this.$toggle = document.querySelector('.nav-toggle');
    this.$theme = document.querySelector('.nav__theme');
    this.$items = document.querySelectorAll('.nav__item');
    this.$dev = document.querySelector('.nav .dev-label');
    this.$copy = document.querySelector('.nav__copy');
    this.$socials = document.querySelectorAll('.nav .socials__item');
    this.state = false;
    this.opened = false;

    this.animation = gsap.timeline({paused:true, 
      onStart:()=>{
        this.opened = true;
      }, 
      onReverseComplete:()=>{
        this.opened = false;
      }
    })
      .set(this.$nav, {autoAlpha:1})
      //
      .fromTo(this.$bg, {autoAlpha:0}, {autoAlpha:1, duration:speed*0.5, ease:'power2.out'})
      .fromTo(this.$container, {xPercent:100}, {xPercent:0, duration:speed*0.5, ease:'power2.out'}, `-=${speed*0.5}`)
      .fromTo([this.$theme, this.$dev, this.$copy], {autoAlpha:0, x:15}, {autoAlpha:1, x:0, duration:speed*0.35, ease:'power2.inOut'}, `-=${speed*0.35}`)
      .fromTo(this.$items, {autoAlpha:0, x:15}, {autoAlpha:1, x:0, duration:speed*0.35, ease:'power2.inOut', stagger:{amount:speed*0.15}}, `-=${speed*0.5}`)
      .fromTo(this.$socials, {autoAlpha:0, x:15}, {autoAlpha:1, x:0, duration:speed*0.35, ease:'power2.inOut', stagger:{amount:speed*0.15}}, `-=${speed*0.5}`)
      
    this.$bg.addEventListener('click', ()=>{
      if(this.state) this.close();
    })
    this.$toggle.addEventListener('click', ()=>{
      if(!this.state) this.open();
      else this.close();
    })

    this.setSize();
    window.addEventListener('resize', ()=>{this.setSize()});
  },
  checkToggleButton: function(event) {
    if(!this.opened) {
      if((event.type=='mouseenter' && !TouchHoverEvents.touched) || event.type=='touchstart') {
        this.$toggle_items.forEach(($item, index)=>{
          $item.setAttribute('d', this.button_forms[2])
        })
      } 
      else if(event.type=='mouseleave' || event.type=='customTouchend') {
        this.$toggle_items.forEach(($item)=>{
          $item.setAttribute('d', this.button_forms[0])
        })
      }
    }
  },
  open: function() {
    if(this.timeout) clearTimeout(this.timeout);
    $header.classList.add('header_nav-opened');
    this.$nav.classList.add('nav_opened');
    this.$toggle.classList.add('active');
    this.state=true;
    this.animation.play();
    disablePageScroll();
  },
  close: function() {
    this.timeout = setTimeout(()=>{
      $header.classList.remove('header_nav-opened');
    }, Math.max(0, (this.animation.time()-0.25)*1000));
    this.$nav.classList.remove('nav_opened');
    this.$toggle.classList.remove('active');
    this.state=false;
    this.animation.reverse();
    enablePageScroll();
  },
  setSize: function() {
    if(window.innerWidth>brakepoints.md) {
      let w = window.innerWidth,
          cw = document.querySelector('.container').getBoundingClientRect().width,
          w2 = (w-cw)/2,
          nw = this.$container.querySelector('.nav__block').getBoundingClientRect().width;
      this.$container.style.width = `${nw+w2}px`;
    } 
  }
}

function inputs() {
  let $inputs = document.querySelectorAll('input, textarea');
  $inputs.forEach(($input)=>{

    $input.addEventListener('focus', ()=>{
      $input.parentNode.classList.add('focused');
    })

    $input.addEventListener('blur', ()=>{
      let value = $input.value;
      if(validate.single(value, {presence: {allowEmpty: false}})!==undefined) {
        $input.value = '';
        $input.parentNode.classList.remove('focused');
      }
    })

  })
  
}


const Validation = {
  init: function() {
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
          minimum: 5,
          tooShort: "^Сообщение слишком короткое (минимум %{count} символов)",
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

    document.addEventListener('submit', (event)=>{
      event.preventDefault();
      let $form = event.target;
      if($form.classList.contains('js-validation') && this.checkValid($form)) {
        /* $form.classList.add('loading');
        //submit
        $($form).request('onSend', {
          success: ()=>{
            let modal = document.querySelector('#modal-succes');
            Modal.open(modal);
            setTimeout(()=>{
              Modal.close(modal);
            }, 3000)
            this.reset($form);
            $form.classList.remove('loading');
          }
        }) */
      }
    })
    document.addEventListener('input', (event)=>{
      let $input = event.target,
          $form = $input.closest('form');
      if($form.classList.contains('js-validation')) {
        this.checkValid($form, $input);
      }
    })

  },
  checkValid: function($form, $input) {
    let $inputs = $form.querySelectorAll('input, textarea'),
        values = {},
        constraints = {},
        resault;

    $inputs.forEach(($input)=>{
      let name = $input.getAttribute('name');
      for(let key in this.namspaces) {
        if($input.getAttribute('data-validate')==this.namspaces[key]) {
          values[name] = $input.value;
          constraints[name] = this.constraints[key];
        }
      }
    })

    resault = validate(values, constraints);

    if(resault!==undefined) {
      if($input!==undefined) {
        let flag = true,
            name = $input.getAttribute('name');
        for(let key in resault) {
          if(name==key) {
            flag=false;
          }
        }
        if(flag && $input.parentNode.classList.contains('error')) {
          $input.parentNode.classList.remove('error');
          let $msg = $input.parentNode.querySelector('.input__message');
          gsap.to($msg, {autoAlpha:0, duration:0.3, ease:'power2.inOut', onComplete:function() {
            $msg.remove();
          }})
        }
      } 
      else {
        $inputs.forEach(($input)=>{
          let name = $input.getAttribute('name');
          for(let key in resault) {
            if(name==key) {
              if(!$input.parentNode.classList.contains('error')) {
                $input.parentNode.classList.add('error');
                $input.parentNode.insertAdjacentHTML('beforeend', `<span class="input__message">${resault[key][0]}</span>`);
                let $msg = $input.parentNode.querySelector('.input__message');
                gsap.to($msg, {autoAlpha:1, duration:0.3, ease:'power2.inOut'})
              } else {
                $input.parentNode.querySelector('.input__message').textContent = `${resault[key][0]}`;
              }
            }
          }
        })
      }
      return false;
    } else {
      $inputs.forEach(($input)=>{
        $input.parentNode.classList.remove('error');
        let $msg = $input.parentNode.querySelector('.input__message');
        if($msg) {
          gsap.to($msg, {autoAlpha:0, duration:0.3, ease:'power2.inOut'}).eventCallback('onComplete', ()=>{
            $msg.remove();
          })
        }
      })
      return true;
    }
  },
  reset: function($form) {
    let $inputs = $form.querySelectorAll('input, textarea');
    $inputs.forEach(($input)=>{
      $input.value = '';
      let $parent = $input.parentNode;
      if($parent.classList.contains('focused')) {
        $parent.classList.remove('focused');
      }
      if($parent.classList.contains('error')) {
        $parent.classList.remove('error');
        let $msg = $input.parentNode.querySelector('.input__message');
        if($msg) {
          gsap.to($msg, {autoAlpha:0, duration:0.3, ease:'power2.inOut', onComplete:function() {
            $msg.remove();
          }})
        }
      }
    })
  }
}