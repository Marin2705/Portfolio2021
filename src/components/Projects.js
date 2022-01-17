import { useState, useRef, useEffect } from 'react'

import projects from './data/projects';

import ProjectTemplate from './ProjectTemplate';
import Details from './Details';

const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                  navigator.userAgent &&
                  navigator.userAgent.indexOf('CriOS') == -1 &&
                  navigator.userAgent.indexOf('FxiOS') == -1;

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

let  noScrollCompatibility = isSafari || isFirefox ? true : false;
console.log('no scroll compatibility ? ', noScrollCompatibility);

// this function looks for the picture in the /assets repertory
// if no picture is found, it returns an empty string
function findPic(urlInAssets){
  try {
    return require('./assets/' + urlInAssets);
  } catch {
    return "";
  }
}

// mouse scroll
let mouseScrollTimeout = null;
let mouseScrollFlag = true;
let mobileScroll = false;
let hadClass = null;

let touchstartY;
let touchstartX;

document.addEventListener('touchstart', (e) => {
  touchstartY = e.touches[0].clientY;
  touchstartX = e.touches[0].clientX;
})

function revealDetails(d = null){
  console.log('Reveal ', d);
  // console.log('revealDetails, mobileScroll : ', mobileScroll);
  if (mobileScroll || isSafari){
    console.log('mobilescroll');
    let duration = 250;
    let details = document.getElementById('details');
    let scrollContainer = document.getElementById('scrollContainer');
    if (!scrollContainer.classList.contains('overflow-x-hidden')){
      scrollContainer.classList.add('overflow-x-hidden')
      scrollContainer.classList.add('overflow-y-visible')
      scrollContainer.classList.remove('overflow-y-hidden')
      details.animate([
        { left: '100%' }
      ], {
        duration: duration
      });
      setTimeout(() => {
        details.style.left = "100%";
      }, duration);
    } else {
      scrollContainer.classList.remove('overflow-x-hidden')
      scrollContainer.classList.remove('overflow-y-visible')
      scrollContainer.classList.add('overflow-y-hidden')
      details.style.top = scrollContainer.scrollTop + 'px';
      details.animate([
        { left: '0' }
      ], {
        duration: duration
      });
      setTimeout(() => {
        details.style.left = 0;
      }, duration);
    }
  } else {
    // console.log('!mobilescroll');
    const arrowProject = document.getElementById('arrowProject');
    const scrollContainer = document.getElementById('scrollContainer');
    let offset = document.getElementById('scrollToDetailsAnchor').offsetLeft;
  
    function doScrollLeft(){
      arrowProject.style.opacity = 1;
      arrowProject.classList.remove('cursor-pointer');
      arrowProject.animate([
          { opacity: '0' }
      ], {
          duration: 500
      });
      setTimeout(() => {
        arrowProject.style.opacity = 0;
      }, 500);
      
      console.log('SCROLLTO LEFT');

      if (noScrollCompatibility) {
        let scrollIntervalLeft = setInterval(() => {
          (scrollContainer.scrollLeft <= (offset/3)) ? (scrollContainer.scrollLeft -= 15) : (scrollContainer.scrollLeft -= 25);
          scrollContainer.scrollLeft <= 0 && clearInterval(scrollIntervalLeft);
        }, 5);
      } else {
        scrollContainer.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }

    function doScrollRight(){
      arrowProject.style.opacity = 0;
      arrowProject.classList.add('cursor-pointer');
      arrowProject.animate([
          { opacity: '1' }
      ], {
          duration: 500
      });
      setTimeout(() => {
        arrowProject.style.opacity = 1;
      }, 500);

      console.log('SCROLLTO RIGHT');

      if (noScrollCompatibility){
        let scrollIntervalRight = setInterval(() => {
          (scrollContainer.scrollLeft >= 2*(offset/3)) ? (scrollContainer.scrollLeft += 15) : (scrollContainer.scrollLeft += 25);
          scrollContainer.scrollLeft >= offset && clearInterval(scrollIntervalRight);
        }, 5);
      } else {
        scrollContainer.scrollTo({
          left: offset,
          behavior: 'smooth'
        });
      }

    }
  
    if (d){
      if (d == -1) {
        doScrollLeft();
      } else if (d == 1){
        doScrollRight();
      }
      return;
    }
  
    if (scrollContainer.scrollLeft >= offset){
      doScrollLeft();
    } else {
      doScrollRight();
    }
  }
}
document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('arrowDetails').onclick = () => {
    revealDetails(-1);
  }
  // listen for click on each project
  projects.map((project, i) => {
    document.getElementById('projectElem-'+i).firstChild.onclick = () => {
          revealDetails(1);
        }
  })
  
  // document.querySelectorAll('projectElem').forEach(projectElem => {
  //   console.log(projectElem);
  //   projectElem
  // })
});

// disable scroll
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
let keysUp = {38: 1, 33: 1, 35: 1};
let keysDown = {40: 1, 32: 1, 34: 1};
let otherKeys = {35: 1, 36: 1}

// handle scroll calls
// let scrollProjectHandler = new Event('scrollProjectHandler');
// let scrollProjectHandlerListener = true;
let wheelFlag = true;
let _scrollTimeout = null;
let dy = 0;
let dx = 0;
let lastDeltaX = 25;
let lastDeltaFlag = false;
let repetitions = 0
function scrollHandler(e) {
  // if (!wheelFlag){
  //   clearTimeout(_scrollTimeout);
  //   _scrollTimeout = setTimeout(function() {
  //     wheelFlag = true;
  //     dx = 0;
  //   }, 250);
  // }

  // calculate delta for touchscreens
  let deltaX;
  // let deltaY;
  if ('changedTouches' in e){
    deltaX = touchstartX-e.changedTouches[0].clientX;
    // deltaY = touchstartY-e.changedTouches[0].clientY;
  } else {
    deltaX = e.deltaX;
    // deltaY = e.deltaY;
  }

  // console.log('delta ', deltaX, ' > last : ', lastDeltaX);

  if (lastDeltaFlag && lastDeltaX > 0 && deltaX < lastDeltaX){
    console.log('REDESCENTE');
    lastDeltaFlag = false;
  } else if (lastDeltaFlag && lastDeltaX < 0 && deltaX > lastDeltaX){
    console.log('REMONTEE');
    lastDeltaFlag = false;
  }

  if (!lastDeltaFlag && deltaX > 25){

     if (deltaX > lastDeltaX + 10){
      if (++repetitions > 3){
        console.log('RIGHT');
        lastDeltaFlag = true;
        repetitions = 0;
        revealDetails(1);
      }
      // go right
    }

  } else if (!lastDeltaFlag && deltaX < -25) {
    if (deltaX < lastDeltaX - 10){
      if (++repetitions > 3){
        console.log('LEFT');
        lastDeltaFlag = true;
        repetitions = 0;
        revealDetails(-1);
      }
      // go right
    }
  }

  lastDeltaX = deltaX;
  return;

  // // first (or after timeout) scroll :
  // if (dx == 0){
  //   // test direction
  //   if (deltaX > 25){
  //     // go right
  //     dx = 1;
  //   } else if (deltaX < -25){
  //     // go left
  //     dx = -1;
  //   } else {
  //     return;
  //   }
    
  //   wheelFlag = false;
  //   if (dx > 0){
  //     revealDetails(1);
  //   } else if (dx < 0){
  //     revealDetails(0);
  //   }
  //   return;
  // }

  // // next scrolls (detect last move) :
  // if (dx > 0){
  //   // last move : right
  //   if (deltaX < -25){
  //     // go left
  //     dx = -1;
  //     revealDetails(0);
  //   }
  // }
  // if (dx < 0){
  //   // last move : left
  //   if (deltaX > 25){
  //     // go right
  //     dx = 1;
  //     revealDetails(1);
  //   }
  // }
}

function projectScroll(e){
  // calculate delta for touchscreens
  let deltaX;
  let deltaY;
  let touch = false;
  if ('changedTouches' in e){
    touch = true;
    deltaX = touchstartX-e.changedTouches[0].clientX;
    deltaY = touchstartX-e.changedTouches[0].clientY;
  } else {
    deltaX = e.deltaX;
    deltaY = e.deltaY;
  }

  if (touch){
    if (deltaX >= 10 || deltaX <= -10){
      // console.log('TOUCH');
      e.preventDefault();
    }
  } else {
    if (deltaX > 2 || deltaX < -2){
      // console.log('MOUSE ', deltaX);
      e.preventDefault();
    }
  }

  
}

function preventDefault(e) {
  e.preventDefault();
  scrollHandler(e);
}
function preventDefaultForScrollKeys(e) {
  if (keysUp[e.keyCode] || keysDown[e.keyCode] || otherKeys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
  if (e.keyCode == 37) {
    preventDefault(e);
    revealDetails(-1);
  } else if (e.keyCode == 39){
    preventDefault(e);
    revealDetails(1);
  }
}
// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

let wheelOpt = supportsPassive ? { passive: false } : false;
let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
// touchstart touchend, mouseup mouseover
// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false); // also listens to key scroll

  if (window.onload){
    console.log('project scroll - disable - loaded');
      let projectContainerScroll = document.getElementById('projectContainerScroll');
      projectContainerScroll.removeEventListener('DOMMouseScroll', projectScroll, false); // older FF
      projectContainerScroll.removeEventListener(wheelEvent, projectScroll, wheelOpt); // modern desktop
      projectContainerScroll.removeEventListener('touchmove', projectScroll, wheelOpt); // mobile
      projectContainerScroll.removeEventListener('keydown', projectScroll, false); // also listens to key scroll
  } else {
    window.onload = () => {
      console.log('project scroll - disable - onload');
      let projectContainerScroll = document.getElementById('projectContainerScroll');
      projectContainerScroll.removeEventListener('DOMMouseScroll', projectScroll, false); // older FF
      projectContainerScroll.removeEventListener(wheelEvent, projectScroll, wheelOpt); // modern desktop
      projectContainerScroll.removeEventListener('touchmove', projectScroll, wheelOpt); // mobile
      projectContainerScroll.removeEventListener('keydown', projectScroll, false); // also listens to key scroll
    }; 
  }   
}
disableScroll();

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);


  console.log('project scroll - enable');
  let projectContainerScroll = document.getElementById('projectContainerScroll');
  projectContainerScroll.addEventListener('DOMMouseScroll', projectScroll, false); // older FF
  projectContainerScroll.addEventListener(wheelEvent, projectScroll, wheelOpt); // modern desktop
  projectContainerScroll.addEventListener('touchmove', projectScroll, wheelOpt); // mobile
  projectContainerScroll.addEventListener('keydown', projectScroll, false); // also listens to key scroll
}

function handleNoScroll(){
  console.log('resize');
  if (window.innerWidth < 1024 || window.innerHeight < 860){
    console.log('enable');
    enableScroll();
    document.getElementById('scrollContainer').scrollTo({
      left: 0
    });
    mobileScroll = true;
  } else {
    disableScroll();
    mobileScroll = false;
    document.getElementById('scrollContainer').scrollTo({
      top: 0
    });
  }
}
window.onresize = handleNoScroll;
window.onload = handleNoScroll;

// function listenToScroll() {
//   window.addEventListener('DOMMouseScroll', scrollHandler, false); // older FF
//   window.addEventListener(wheelEvent, scrollHandler, wheelOpt); // modern desktop
//   window.addEventListener('touchmove', scrollHandler, wheelOpt); // mobile
//   // keys : handled in preventDefaultForScrollKeys()
// }
// listenToScroll();

let scrollIntervalProjectRight;
let scrollIntervalProjectLeft;
let scrollIntervalProjectUp;
let scrollIntervalProjectDown;

function Projects() {
  const [lastProject, updateLastProject] = useState(0);
  const [currentProject, updateCurrentProject] = useState(0);
  const firstRender = useRef([true, 0]);
  let category = 'Programming';

  function scrollProject(d = null){
    console.log('scrollProject d ',d);
    let id = 0;
    if (d == 0){
      id = currentProject - 1;
    } else if (d == 1){
      id = currentProject + 1;
    }
    if (id >= projects.length){
      // console.log(projects.length - 1);
      document.getElementById('projectElem-'+(projects.length - 1)).classList.add('animateShake');
      setTimeout(() => {
        document.getElementById('projectElem-'+(projects.length - 1)).classList.remove('animateShake');
      }, 500);
      // id = 0;
      return;
    } else if (id < 0){
      document.getElementById('projectElem-0').classList.add('animateShake');
      setTimeout(() => {
        document.getElementById('projectElem-0').classList.remove('animateShake');
      }, 500);
      // id = projects.length - 1;
      return;
    }
    console.log('scrollProject id',id);
    updateCurrentProject(id);
    if (mobileScroll){
      // SCROLL HORIZONTAL PROJECT
      console.log('SCROLL HORIZONTAL PROJECT');

      if (noScrollCompatibility) {
        console.log('noScrollCompatibility');
        let projectContainerScroll = document.getElementById('projectContainerScroll');
        let offset = document.getElementById('projectElem-'+id).offsetLeft - 100;
        let movement = offset - projectContainerScroll.scrollLeft;
        let l = 0;

        if (id >= projects.length - 1){
          clearInterval(scrollIntervalProjectLeft);
          scrollIntervalProjectRight = setInterval(() => {
            projectContainerScroll.scrollLeft += 50;
            projectContainerScroll.scrollLeft <= l && clearInterval(scrollIntervalProjectRight);
            l = projectContainerScroll.scrollLeft;
          }, 15);
          
        } else if (id <= 0){
          clearInterval(scrollIntervalProjectRight);
          scrollIntervalProjectLeft = setInterval(() => {
            projectContainerScroll.scrollLeft -= 50;
            projectContainerScroll.scrollLeft <= 0 && clearInterval(scrollIntervalProjectLeft);
          }, 15);
        } else {
          if (movement >= 0) {
            clearInterval(scrollIntervalProjectLeft);
            scrollIntervalProjectRight = setInterval(() => {
              projectContainerScroll.scrollLeft += 50;
              projectContainerScroll.scrollLeft >= offset && clearInterval(scrollIntervalProjectRight);
            }, 15);
          } else {
            clearInterval(scrollIntervalProjectRight);
            scrollIntervalProjectLeft = setInterval(() => {
              projectContainerScroll.scrollLeft -= 50;
              projectContainerScroll.scrollLeft <= offset && clearInterval(scrollIntervalProjectLeft);
            }, 15);
          }
        }
      } else {
        document.getElementById('projectContainerScroll').scrollTo({
          left: document.getElementById('projectElem-'+id).offsetLeft - 100,
          behavior: 'smooth'
        });
      }
      
    } else {
      // SCROLL VERTICAL PROJECT


      console.log('SCROLL VERTICAL PROJECT');

      if (noScrollCompatibility){
        console.log('noScrollCompatibility');
        let projectContainerScroll = document.getElementById('projectContainerScroll');
        let offset = document.getElementById('projectElem-'+id).offsetTop;
        let movement = offset - projectContainerScroll.scrollTop;
        let l = 0;

        if (id >= projects.length - 1){
          clearInterval(scrollIntervalProjectDown);
          scrollIntervalProjectDown = setInterval(() => {
            projectContainerScroll.scrollTop += 60;
            projectContainerScroll.scrollTop <= l && clearInterval(scrollIntervalProjectDown);
            l = projectContainerScroll.scrollTop;
          }, 5);
          
        } else if (id <= 0){
          clearInterval(scrollIntervalProjectDown);
          scrollIntervalProjectDown = setInterval(() => {
            projectContainerScroll.scrollTop -= 60;
            projectContainerScroll.scrollTop <= 0 && clearInterval(scrollIntervalProjectDown);
          }, 5);
        } else {
          if (movement >= 0) {
            clearInterval(scrollIntervalProjectDown);
            scrollIntervalProjectDown = setInterval(() => {
              projectContainerScroll.scrollTop += 60;
              projectContainerScroll.scrollTop >= offset && clearInterval(scrollIntervalProjectDown);
            }, 15);
          } else {
            clearInterval(scrollIntervalProjectUp);
            scrollIntervalProjectUp = setInterval(() => {
              projectContainerScroll.scrollTop -= 60;
              projectContainerScroll.scrollTop <= offset && clearInterval(scrollIntervalProjectUp);
            }, 15);
          }
        }
      } else {
        document.getElementById('projectContainerScroll').scrollTo({
          top: document.getElementById('projectElem-'+id).offsetTop,
          behavior: 'smooth'
        });
      }
      
    }
  }
  function keyScroll(e){
    if (mobileScroll){
      if (e.keyCode == 37) {
        scrollProject(0);
      } else if (e.keyCode == 39){
        scrollProject(1);
      }
    } else {
      if (keysUp[e.keyCode]) {
        scrollProject(0);
      } else if (keysDown[e.keyCode]){
        scrollProject(1);
      }
    }
  }

  let projectLastDeltaY = 25;
  let projectLastDeltaX = 25;
  let projectLastDeltaFlag = false;
  let projectTimeFlag = false;
  let projectRepetitions = 0;
  function mouseScroll(e){
    let touch = false;
    let deltaX;
    let deltaY;
    if ('changedTouches' in e){
      touch = true;
      deltaX = touchstartX-e.changedTouches[0].clientX;
      deltaY = touchstartY-e.changedTouches[0].clientY;
    } else {
      deltaX = e.deltaX;
      deltaY = e.deltaY;
    }

    if (touch){
      if(mobileScroll){
        if (mouseScrollFlag){
          console.log('mouseScroll');
          if (deltaX > 10){
            // go right
            dx = 1;
            scrollProject(1);
            mouseScrollFlag = false;
          } else if (deltaX < -10){
            // go left
            dx = -1;
            scrollProject(0);
            mouseScrollFlag = false;
          }
        } else {
          console.log('mouseScroll');
    
          if (dx > 0){
            if (deltaX < -25){
              dx = -1;
              scrollProject(0);
              mouseScrollFlag = false;
            }
          } else if (dx < 0){
            if (deltaX > 25){
              dx = 1;
              scrollProject(1);
              mouseScrollFlag = false;
            }
          }
        }
      } else {
        if (mouseScrollFlag){
          console.log('mouseScroll');
          if (deltaY > 25){
            // go down
            dy = 1;
            console.log('down');
            scrollProject(1);
            mouseScrollFlag = false;
          } else if (deltaY < -25){
            // go up
            dy = -1;
            console.log('up');
            scrollProject(0);
            mouseScrollFlag = false;
          }
        } else {
          console.log('mouseScrollFlag !');
    
          if (dy > 0){
            // last move : down
            if (deltaY < -25){
              // go up
              dy = -1;
              console.log('up');
              scrollProject(0);
              mouseScrollFlag = false;
            }
          } else if (dy < 0){
            // last move : up
            if (deltaY > 25){
              // go down
              dy = 1;
              console.log('down');
              scrollProject(1);
              mouseScrollFlag = false;
            }
          }
        }
      }
  
      clearTimeout(mouseScrollTimeout);
      mouseScrollTimeout = setTimeout(function() {
        console.log("clear mouseScroll");
        mouseScrollFlag = true;
      }, 250);

    } else {
      if (mobileScroll){
        if (projectLastDeltaFlag && projectLastDeltaX > 0 && deltaX < projectLastDeltaX){
          console.log('REDESCENTE');
          projectLastDeltaFlag = false;
        } else if (projectLastDeltaFlag && projectLastDeltaX < 0 && deltaX > projectLastDeltaX){
          console.log('REMONTEE');
          projectLastDeltaFlag = false;
        }
    
        if (!projectTimeFlag 
          && !projectLastDeltaFlag && deltaX > 5
          && deltaX > projectLastDeltaX
          && ++projectRepetitions > 10){
            console.log('RIGHT');
            projectTimeFlag = true;
            setTimeout(() => {
              projectTimeFlag = false;
              console.log('TIME OK');
            }, 150);
            projectLastDeltaFlag = true;
            projectRepetitions = 0;
            scrollProject(1);
    
        } else if (!projectTimeFlag 
          && !projectLastDeltaFlag && deltaX < -5
          && deltaX < projectLastDeltaX
          && ++projectRepetitions > 10) {
            console.log('LEFT');
            projectTimeFlag = true;
            setTimeout(() => {
              console.log('TIME OK');
              projectTimeFlag = false;
            }, 150);
            projectLastDeltaFlag = true;
            projectRepetitions = 0;
            scrollProject(0);
        }
  
        projectLastDeltaX = deltaX;
  
      } else {
        if (projectLastDeltaFlag && projectLastDeltaY > 0 && deltaX < projectLastDeltaY){
          console.log('REDESCENTE');
          projectLastDeltaFlag = false;
        } else if (projectLastDeltaFlag && projectLastDeltaY < 0 && deltaX > projectLastDeltaY){
          console.log('REMONTEE');
          projectLastDeltaFlag = false;
        }
    
        if (!projectTimeFlag 
          && !projectLastDeltaFlag && deltaY > 5
          && deltaY > projectLastDeltaY
          && ++projectRepetitions > 10){
            console.log('UP');
            projectTimeFlag = true;
            setTimeout(() => {
              projectTimeFlag = false;
              console.log('TIME OK');
            }, 150);
            projectLastDeltaFlag = true;
            projectRepetitions = 0;
            scrollProject(1);
    
        } else if (!projectTimeFlag 
          && !projectLastDeltaFlag && deltaY < -5
          && deltaY < projectLastDeltaY
          && ++projectRepetitions > 10) {
            console.log('DOWN');
            projectTimeFlag = true;
            setTimeout(() => {
              console.log('TIME OK');
              projectTimeFlag = false;
            }, 150);
            projectLastDeltaFlag = true;
            projectRepetitions = 0;
            scrollProject(0);
        }
  
        projectLastDeltaY = deltaY;
      }
    }

    

    return;

    // if (!projectTimeFlag && !projectLastDeltaFlag && deltaY > 5){

    //   if (deltaY > projectLastDeltaY){
    //     if (++projectRepetitions > 10){
    //       console.log('UP');
    //       projectTimeFlag = true;
    //       setTimeout(() => {
    //         projectTimeFlag = false;
    //         console.log('TIME OK');
    //       }, 150);
    //       projectLastDeltaFlag = true;
    //       projectRepetitions = 0;
    //       scrollProject(1);
    //     }
    //     // go right
    //   }

    // } else if (!projectTimeFlag && !projectLastDeltaFlag && deltaY < -5) {
    //   if (deltaY < projectLastDeltaY){
    //     if (++projectRepetitions > 10){
    //       console.log('DOWN');
    //       projectTimeFlag = true;
    //       setTimeout(() => {
    //         console.log('TIME OK');
    //         projectTimeFlag = false;
    //       }, 150);
    //       projectLastDeltaFlag = true;
    //       projectRepetitions = 0;
    //       scrollProject(0);
    //     }
    //     // go right
    //   }
    // }


    //////


    // // calculate delta for touchscreens
    // let deltaX;
    // let deltaY;
    // if ('changedTouches' in e){
    //   deltaX = touchstartX-e.changedTouches[0].clientX;
    //   deltaY = touchstartY-e.changedTouches[0].clientY;
    // } else {
    //   deltaX = e.deltaX;
    //   deltaY = e.deltaY;
    // }
  }

  useEffect(() => {
    if (projects[currentProject].category > 0){
      category = 'Creative & video';
    } else {
      category = 'Programming';
    }
    let cat = document.getElementById('category');
    if (cat.textContent != category){
      cat.animate([
          { opacity: '0' }
      ], {
          duration: 500
      });
      setTimeout(() => {
        cat.style.opacity = 0;
        cat.textContent = category;
      }, 500);
      setTimeout(() => {
          cat.animate([
              { opacity: '1' }
          ], {
              duration: 500
          });
          setTimeout(() => {
              cat.style.opacity = 1;
          }, 500);          
      }, 600);
    }
    
    if(firstRender.current[0]){
      firstRender.current[0] = false;
    } else if (mobileScroll){
      updateLastProject(currentProject);
      return;
    } else {
      document.getElementById("animateDetails").animate([
          { opacity: '0' }
      ], {
          duration: 500
      });

      setTimeout(() => {
        document.getElementById("animateDetails").style.opacity = 0;

        updateLastProject(currentProject);
      }, 500);

      setTimeout(() => {
          document.getElementById("animateDetails").animate([
              { opacity: '1' }
          ], {
              duration: 500
          });
          setTimeout(() => {
              document.getElementById("animateDetails").style.opacity = 1;
          }, 500);          
      }, 600);
    }
  }, [currentProject])

  return (
    <div className=''>
      <div className="projectSection z-10"
      onKeyDown={keyScroll}
      onWheel={mouseScroll}
      onTouchMove={mouseScroll}
      tabIndex="0"
      id='scrollToDetailsAnchor'>
        <svg className="hidden lg:block mt-10 pl-10 w-1/5 h-[100px] invisible z-10 relative lg:visible opacity-0" width="75" height="75" viewBox="0 0 45 30" fill="none" xmlns="http://www.w3.org/2000/svg" id='arrowProject'
        onClick={() => {
          const scrollContainer = document.getElementById('scrollContainer');
          let offset = document.getElementById('scrollToDetailsAnchor').offsetLeft;
          if (scrollContainer.scrollLeft >= offset){
            revealDetails(-1);
          }
        }}
        >
          <path d="M43 17C44.1046 17 45 16.1046 45 15C45 13.8954 44.1046 13 43 13V17ZM0.585786 13.5858C-0.195262 14.3668 -0.195262 15.6332 0.585786 16.4142L13.3137 29.1421C14.0948 29.9232 15.3611 29.9232 16.1421 29.1421C16.9232 28.3611 16.9232 27.0948 16.1421 26.3137L4.82843 15L16.1421 3.68629C16.9232 2.90524 16.9232 1.63891 16.1421 0.857864C15.3611 0.0768158 14.0948 0.0768158 13.3137 0.857864L0.585786 13.5858ZM43 13L2 13V17L43 17V13Z" fill="black"/>
        </svg>
        <p className="pl-10 pt-10 lg:pt-0 z-10 relative text-3xl order-1 lg:text-[2rem]" id='category'>Programming</p>

        <div className="flex flex-col 460:block items-center cursor-pointer z-10 text-1xl lg:absolute bottom-[100px] w-full font-medium text-center order-3 mb-5">
          
          <div className="inline-block 460:flex m-auto justify-between w-full max-w-[400px]">
            <a href="#root" onClick={() => scrollProject(0)} className='bg-white block m-auto w-fit mb-2 460:inline-block 460:m-3 460:ml-0 border-2 border-solid border-black p-2 460:w-2/5 transition-all hover:bg-black hover:text-white transform hover:scale-110'>Previous project</a>
            <a href="#root" onClick={() => scrollProject(1)} className='bg-white block m-auto w-fit 460:inline-block 460:m-3 460:mr-0 border-2 border-solid border-black p-2 460:w-2/5 transition-all hover:bg-black hover:text-white transform hover:scale-110'>Next project</a>
          </div>
        </div>

        <div className="projectContainer order-2" id="projectContainerScroll">
          {
            projects.map((project, i) => {
              return (
                <ProjectTemplate 
                  
                  currentProject={currentProject}
                  updateCurrentProject={updateCurrentProject}
                  key={i}
                  i={i}
                  class="a"
                  thumb={findPic(project.thumb)}
                  thumbAlt={project.thumbAlt}
                  thumbCaption={project.thumbCaption}
                  text={project.text}
                />
              );
            })
          }
        </div>
      </div>
      <Details
        pic={findPic(projects[lastProject].pic)}
        picAlt={projects[lastProject].picAlt}
        title={projects[lastProject].title}
        date={projects[lastProject].date}
        text={projects[lastProject].text}
        link={projects[lastProject].link}
        skills={projects[lastProject].skills}
      />
    </div>
  );
}

export default Projects;