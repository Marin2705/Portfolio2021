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

let touchstartY;
let touchstartX;

document.addEventListener('touchstart', (e) => {
  touchstartY = e.touches[0].clientY;
  touchstartX = e.touches[0].clientX;
})

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
    const arrowProject = document.getElementById('arrowProject')
    const scrollContainer = document.getElementById('scrollContainer')
    let offset = document.getElementById('scrollToDetailsAnchor').offsetLeft;
  
    function doScrollLeft(){
      arrowProject.style.opacity = 1;
      arrowProject.animate([
          { opacity: '0' }
      ], {
          duration: 500
      });
      setTimeout(() => {
        arrowProject.style.opacity = 0;
      }, 500);
      scrollContainer.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
    function doScrollRight(){
      arrowProject.style.opacity = 0;
      arrowProject.animate([
          { opacity: '1' }
      ], {
          duration: 500
      });
      setTimeout(() => {
        arrowProject.style.opacity = 1;
      }, 500);
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
    clearTimeout(_scrollTimeout);
    _scrollTimeout = setTimeout(function() {
      wheelFlag = true;
      dx = 0;
    }, 250);
  }

  // calculate delta for touchscreens
  let deltaX;
  let deltaY;
  if ('changedTouches' in e){
    deltaX = touchstartX-e.changedTouches[0].clientX;
    deltaY = touchstartY-e.changedTouches[0].clientY;
  } else {
    deltaX = e.deltaX;
    deltaY = e.deltaY;
  }

  // first (or after timeout) scroll :
  if (dx == 0){
    // test direction
    if (deltaX > 25){
      // go right
      dx = 1;
    } else if (deltaX < -25){
      // go left
      dx = -1;
    } else {
      return;
    }
    
    wheelFlag = false;
    if (dx > 0){
      revealDetails(1);
    } else if (dx < 0){
      revealDetails(0);
    }
    return;
  }

  // next scrolls (detect last move) :
  if (dx > 0){
    // last move : right
    if (deltaX < -25){
      // go left
      dx = -1;
      revealDetails(0);
    }
  }
  if (dx < 0){
    // last move : left
    if (deltaX > 25){
      // go right
      dx = 1;
      revealDetails(1);
    }
  }
}

function projectScroll(e){
  // calculate delta for touchscreens
  let deltaX;
  if ('changedTouches' in e){
    deltaX = touchstartX-e.changedTouches[0].clientX;
  } else {
    deltaX = e.deltaX;
  }

  if (deltaX > 0 || deltaX < 0){
    e.preventDefault();
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
  let category = 'Programming';

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

  function mouseScroll(e){
    // calculate delta for touchscreens
    let deltaX;
    let deltaY;
    if ('changedTouches' in e){
      deltaX = touchstartX-e.changedTouches[0].clientX;
      deltaY = touchstartY-e.changedTouches[0].clientY;
    } else {
      deltaX = e.deltaX;
      deltaY = e.deltaY;
    }

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
        <svg className="cursor-pointer hidden lg:block mt-10 pl-10 w-1/5 h-[100px] invisible z-10 relative lg:visible opacity-0" width="75" height="75" viewBox="0 0 45 30" fill="none" xmlns="http://www.w3.org/2000/svg" id='arrowProject'
        onClick={() => {revealDetails();console.log("a");}}
        >
          <path d="M43 17C44.1046 17 45 16.1046 45 15C45 13.8954 44.1046 13 43 13V17ZM0.585786 13.5858C-0.195262 14.3668 -0.195262 15.6332 0.585786 16.4142L13.3137 29.1421C14.0948 29.9232 15.3611 29.9232 16.1421 29.1421C16.9232 28.3611 16.9232 27.0948 16.1421 26.3137L4.82843 15L16.1421 3.68629C16.9232 2.90524 16.9232 1.63891 16.1421 0.857864C15.3611 0.0768158 14.0948 0.0768158 13.3137 0.857864L0.585786 13.5858ZM43 13L2 13V17L43 17V13Z" fill="black"/>
        </svg>
        <p className="pl-10 pt-10 lg:pt-0 z-10 relative text-3xl order-1 lg:text-[2rem]" 
        // onClick={() => scrollProject()}
        ><a href="#root" id='category'>Programming</a></p>

        <div className="flex flex-col 460:block items-center cursor-pointer z-10 text-1xl lg:absolute bottom-[100px] w-full font-medium text-center order-3">
          
          <div className="flex 460:inline-block">
            <a href="#root" onClick={() => scrollProject(0)} className='w-fit inline-block m-3 btn'>Previous project</a><a
            
             href="#root" onClick={() => scrollProject(1)} className='w-fit inline-block m-3 a btn'>Next project</a>
          </div>
          
          {/* <a 
          
          href="#root" onClick={() => {
            revealDetails();
            if (!mobileScroll){
              let learnMoreBtn = document.getElementById('learnMoreBtn');
              learnMoreBtn.textContent = learnMoreBtn.textContent == 'Go back' ? 'Learn more' : 'Go back';
            }            
            }} className='w-fit inline-block m-3 btn' id='learnMoreBtn'>Learn more</a> */}
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