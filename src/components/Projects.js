import { useState, useRef, useEffect } from 'react'

import projects from './data/projects';

import ProjectTemplate from './ProjectTemplate';
import Details from './Details';

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

function revealDetails(d = null){
  console.log('revealDetails, mobileScroll : ', mobileScroll);
  if (mobileScroll){
    let duration = 250;
    let details = document.getElementById('details');
    let scrollContainer = document.getElementById('scrollContainer');
    if (hadClass){
      console.log('hadClass');
      scrollContainer.scrollTop = 0;
      details.animate([
        { left: '100%' }
      ], {
        duration: duration
      });
      setTimeout(() => {
        details.style.left = "100%";
        scrollContainer.className = hadClass;
        hadClass = null;
      }, duration);
    } else {
      hadClass = scrollContainer.className;
      console.log(hadClass);
      scrollContainer.className = "";
      details.style.top = scrollContainer.scrollTop;
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
    const scrollContainer = document.getElementById('scrollContainer')
    let offset = document.getElementById('scrollToDetailsAnchor').offsetLeft;
  
    function doScrollLeft(){
      scrollContainer.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
    function doScrollRight(){
      scrollContainer.scrollTo({
        left: offset,
        behavior: 'smooth'
      });
    }
  
    if (d){
      if (d == 0) {
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
    revealDetails(0);
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
function scrollHandler(e) {
  if (!wheelFlag){
    // console.log("blocked scroll");
    // console.log('dy',dy);
    // console.log('dx',dx);

    // console.log("clear scroll");
    clearTimeout(_scrollTimeout);
    _scrollTimeout = setTimeout(function() {
      // console.log("Haven't scrolled in 250ms");
      wheelFlag = true;
      // dy = 0;
      dx = 0;
    }, 250);
  }

  // first (or after timeout) scroll :
  if (dx == 0 
    // && dy == 0
    ){
    // console.log('first scroll');
    // test direction
    if (e.deltaX > 25){
      // go right
      // console.log('first right');
      dx = 1;
    } else if (e.deltaX < -25){
      // go left
      dx = -1;
    } 
    // else if (e.deltaY > 25){
    //   // go down
    //   dy = 1;
    // } else if (e.deltaY < -25){
    //   // go up
    //   dy = -1;
    // } 
    else {
      return;
    }
    // console.log('scrollY',dy);
    console.log('scrollX',dx);
    wheelFlag = false;
    if (dx > 0){
      console.log('going right');
      revealDetails(1);
    } else if (dx < 0){
      console.log("going left");
      revealDetails(0);
    }
    // if (dy > 0){
    //   console.log('going down', e.deltaY);
    //   scrollProjectHandler.d = 1;
    //   window.dispatchEvent(scrollProjectHandler);
    //   scrollProjectHandlerListener = true;
    //   // scrollProject(1);
    // } else if (dy < 0){
    //   console.log("going up", e.deltaY);
    //   scrollProjectHandler.d = 0;
    //   window.dispatchEvent(scrollProjectHandler);
    //   scrollProjectHandlerListener = true;
    //   // scrollProject(0);
    // }
    return;
  }
  // if (dy == 0 && (e.deltaY > 25 || e.deltaY < 25)){
  //   dy=1;
  //   console.log('up/down first scroll');
  //   // test direction
  //   if (e.deltaY > 25){
  //     // go down
  //     dy = 1;
  //   } else if (e.deltaY < -25){
  //     // go up
  //     dy = -1;
  //   }
  //   console.log('scrollY',dy);
  //   console.log('scrollX',dx);
  //   wheelFlag = false;
  //   if (dy > 0){
  //     console.log('going down', e.deltaY);
  //     scrollProjectHandler.d = 1;
  //     window.dispatchEvent(scrollProjectHandler);
  //     scrollProjectHandlerListener = true;
  //     // scrollProject(1);
  //   } else if (dy < 0){
  //     console.log("going up", e.deltaY);
  //     scrollProjectHandler.d = 0;
  //     window.dispatchEvent(scrollProjectHandler);
  //     scrollProjectHandlerListener = true;
  //     // scrollProject(0);
  //   }
  //   return;
  // }

  // do first scroll
  // if (wheelFlag){
  //   // console.log('scrollY',dy);
  //   // console.log('scrollX',dx);
  //   wheelFlag = false;
  //   // if (dx > 0){
  //   //   console.log('going right');
  //   //   revealDetails(1);
  //   // } else if (dx < 0){
  //   //   console.log("going left");
  //   //   revealDetails(0);
  //   // }
  //   if (dy > 0){
  //     console.log('going down', e.deltaY);
  //     scrollProjectHandler.d = 1;
  //     window.dispatchEvent(scrollProjectHandler);
  //     scrollProjectHandlerListener = true;
  //     // scrollProject(1);
  //   } else if (dy < 0){
  //     console.log("going up", e.deltaY);
  //     scrollProjectHandler.d = 0;
  //     window.dispatchEvent(scrollProjectHandler);
  //     scrollProjectHandlerListener = true;
  //     // scrollProject(0);
  //   }
  //   return;
  // }

  // next scrolls (detect last move) :
  if (dx > 0){
    // last move : right
    if (e.deltaX < -25){
      // go left
      // console.log('go left !');
      dx = -1;
      // dy = 0;
      // wheelFlag = true;
      revealDetails(0);
    }
  }
  if (dx < 0){
    // last move : left
    if (e.deltaX > 25){
      // go right
      // console.log('go right !');
      dx = 1;
      // dy = 0;
      // wheelFlag = true;
      revealDetails(1);
    }
  }
  // if (dy > 0){
  //   // last move : down
  //   if (e.deltaY < -25){
  //     // go up
  //     dy = -1;
  //     dx = 0;
  //     console.log('go up !');
  //     scrollProjectHandler.d = 0;
  //     window.dispatchEvent(scrollProjectHandler);
  //     scrollProjectHandlerListener = true;
  //   }
  // }
  // if (dy < 0){
  //   // last move : up
  //   if (e.deltaY > 25){
  //     // go down
  //     dy = 1;
  //     dx = 0;
  //     console.log('go down !');
  //     scrollProjectHandler.d = 1;
  //     window.dispatchEvent(scrollProjectHandler);
  //     scrollProjectHandlerListener = true;
  //   }
  // }
}

function projectScroll(e){
  console.log(e);
  if (e.deltaX > 0 || e.deltaX < 0){
    e.preventDefault();
  }
}

function preventDefault(e) {
  e.preventDefault();
  scrollHandler(e);
  // console.log('horizontal?');
  // if (e.deltaY > 1 || e.deltaY < -1 ){
  //   console.log('horizontal',e.deltaX);
  // } else {
    
  // }
}
function preventDefaultForScrollKeys(e) {
  if (keysUp[e.keyCode] || keysDown[e.keyCode] || otherKeys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
  if (e.keyCode == 37) {
    preventDefault(e);
    revealDetails(0);
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

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
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
  if (window.innerWidth < 1024 || window.innerHeight < 720){
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

function Projects() {
  const [lastProject, updateLastProject] = useState(0);
  const [currentProject, updateCurrentProject] = useState(0);
  const firstRender = useRef([true, 0]);

  function scrollProject(d = null){
    console.log('scrollProject d',d);
    let id = 0;
    if (d == 0){
      id = currentProject - 1;
    } else if (d == 1){
      id = currentProject + 1;
    }
    if (id >= projects.length){
      id = 0;
    } else if (id < 0){
      id = projects.length - 1;
    }
    console.log('scrollProject id',id);
    updateCurrentProject(id);
    if (mobileScroll){
      document.getElementById('projectContainerScroll').scrollTo({
        left: document.getElementById('projectElem-'+id).offsetLeft - 100,
        behavior: 'smooth'
      });
    } else {      
      updateCurrentProject(id);
      document.getElementById('projectContainerScroll').scrollTo({
        top: document.getElementById('projectElem-'+id).offsetTop,
        behavior: 'smooth'
      });
    }
  }
  function keyScroll(e){
    if (keysUp[e.keyCode]) {
      scrollProject(0);
    } else if (keysDown[e.keyCode]){
      scrollProject(1);
    }
  }

  function mouseScroll(e){
    if(mobileScroll){
      if (mouseScrollFlag){
        console.log('mouseScroll');
        if (e.deltaX > 10){
          // go right
          // projectdx = 1;
          console.log('right');
          scrollProject(1);
          mouseScrollFlag = false;
        } else if (e.deltaX < -10){
          // go left
          // dx = -1;
          console.log('left');
          scrollProject(0);
          mouseScrollFlag = false;
        }
      } else {
        // console.log('mouseScroll');
  
        // if (dy > 0){
        //   // last move : down
        //   if (e.deltaY < -25){
        //     // go up
        //     dy = -1;
        //     console.log('up');
        //     scrollProject(0);
        //     mouseScrollFlag = false;
        //   }
        // } else if (dy < 0){
        //   // last move : up
        //   if (e.deltaY > 25){
        //     // go down
        //     dy = 1;
        //     console.log('down');
        //     scrollProject(1);
        //     mouseScrollFlag = false;
        //   }
        // }
      }
    } else {
      if (mouseScrollFlag){
        console.log('mouseScroll');
        if (e.deltaY > 25){
          // go down
          dy = 1;
          console.log('down');
          scrollProject(1);
          mouseScrollFlag = false;
        } else if (e.deltaY < -25){
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
          if (e.deltaY < -25){
            // go up
            dy = -1;
            console.log('up');
            scrollProject(0);
            mouseScrollFlag = false;
          }
        } else if (dy < 0){
          // last move : up
          if (e.deltaY > 25){
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
  }

  useEffect(() => {
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
      tabIndex="0"
      id='scrollToDetailsAnchor'>
        <p className="pl-10 pt-10 z-10 relative text-2xl order-1" onClick={() => scrollProject()}><a href="#root">Programming</a></p>

        <div className="flex flex-col 460:block items-center cursor-pointer z-10 text-1xl lg:absolute bottom-6 w-full font-medium text-center order-3">
          <div className="flex 460:inline-block">
            <a href="#root" onClick={() => scrollProject(0)} className='w-fit inline-block m-3  btn'>Last project</a><a
            
             href="#root" onClick={() => scrollProject(1)} className='w-fit inline-block m-3 a btn'>Next project</a>
          </div><a 
          
          href="#root" onClick={() => {
            revealDetails();
            if (!mobileScroll){
              let learnMoreBtn = document.getElementById('learnMoreBtn');
              learnMoreBtn.textContent = learnMoreBtn.textContent == 'Go back' ? 'Learn more' : 'Go back';
            }            
            }} className='w-fit inline-block m-3 btn' id='learnMoreBtn'>Learn more</a>
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
        text={projects[lastProject].text}
        skills={projects[lastProject].skills}
      />
    </div>
  );
}

export default Projects;