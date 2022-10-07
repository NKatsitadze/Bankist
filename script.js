'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const sections = document.querySelectorAll('.section');



const openModal = function (e) {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  e.preventDefault();
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  

};

btnsOpenModal.forEach((arg) => {
    arg.addEventListener('click', openModal)
})



btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

// Selecting elements
// we can do this by 
// querySelector, getElements by tag name, or class name, or ID ect...
// querySelectors return nodelists that do not update

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const allButtons = document.getElementsByTagName('button');
const id = document.getElementById('logo');



// Creating and inserting elements
// .insertAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use Cookies for improvement <button class="btn btn--close-cookie"
>Got it!</button>`;
// header.before(message);
header.insertAdjacentElement('afterbegin', message);


// Deleting an element
document.querySelector('.btn--close-cookie')
.addEventListener('click', function() {
    message.remove();
})

// Styles
message.style.backgroundColor = 'lightgreen';
message.style.borderBottomLeftRadius = '40px'
message.style.borderBottomRightRadius = '40px'
message.style.color = 'black'
message.style.width = '100%';
message.style.height = Number.parseFloat(  getComputedStyle(message).height) + 30 + 'px';


// Attributes
const logo = document.querySelector('.nav__logo');

/////////////////////////////
/////////////////////////////
/////////////////////////////
// Tabbed component
/////////////////////////////
/////////////////////////////
/////////////////////////////

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  // if we want to end some operation before it throws error
  // we can make it return right away, it will return nothing and
  // operation stops
  if (!clicked) return;

  // Removing active class
  tabs.forEach((t) => { t.classList.remove('operations__tab--active') });
  tabsContent.forEach((c)=> {  c.classList.remove('operations__content--active')  });
  
  // Adding active class
  clicked.classList.add('operations__tab--active');
  
  // Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');

});


///////////////////////////////////
///////////////////////////////////
// Adding sticky nav, with Intersection Observer API
///////////////////////////////////
///////////////////////////////////
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function(entries) {
  entries.forEach(entry => {
    // console.log(entry.isIntersecting);
    if(entry.isIntersecting === false) {nav.classList.add('sticky')} else {
      nav.classList.remove('sticky');
    } 
  })
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);


//////////////////////////////////
//////////////////////////////////
// Revealing sections with animations 
//////////////////////////////////
//////////////////////////////////
// sections.forEach(s => s.classList.add('section--hidden'));
// console.log(...sections)

const revealSection = function(entries, observer) {
  const [entry] = entries;
  if(entry.isIntersecting) { entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
  }; 
};

const obsOptions2 = {
  root: null,
  threshold: 0.15, 
};

const sectionObserver = new IntersectionObserver(revealSection, obsOptions2);
allSections.forEach(function(s){
  sectionObserver.observe(s);
});



////////////////////////////////////
////////////////////////////////////
// Implementing Lazy Loading
////////////////////////////////////
////////////////////////////////////

const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets)


const loadImg = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.2,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));





/////////////////////////////////////////
/////////////////////////////////////////
// Making Slider
/////////////////////////////////////////
/////////////////////////////////////////
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');

  //////////////////////////
  //////////////////////////
  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //////////////////////////
  //////////////////////////
  // Next and Previous slides
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  //////////////////////////
  //////////////////////////
  // Event listeners
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();










