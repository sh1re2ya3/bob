let inactivityTimer; //time in ms after which blink resumes
let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseTime = Date.now();
let mouseSpeed = 0;
const MAX_SPEED = 10; // pixels per ms - adjust this to change sensitivity
const MAX_SMILE_HEIGHT = 40; // maximum smile height in pixels

document.addEventListener("mousemove", function (e) {
  clearTimeout(inactivityTimer);

  // Calculate mouse speed
  const currentTime = Date.now();
  const timeDelta = currentTime - lastMouseTime;

  if (timeDelta > 0) {
    const distX = e.clientX - lastMouseX;
    const distY = e.clientY - lastMouseY;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);
    mouseSpeed = distance / timeDelta; // pixels per ms
  }

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  lastMouseTime = currentTime;

  eyeMovement(e);
  smile(mouseSpeed);

  //smile on mouse move
  //stop blink

  toggleBlink("paused");

  inactivityTimer = setTimeout(() => {
    toggleBlink("running");
  }, 2000);
    inactivityTimer = setTimeout(() => {
    resetPupils();
  }, 3000);
  inactivityTimer = setTimeout(() => {
    stopSmile();
  }, 100);
});

function eyeMovement(e) {
  const pupils = document.getElementsByClassName("pupil");

  for (let pupil of pupils) {
    // const eye = pupil.parentElement;
    const pupilRect = pupil.getBoundingClientRect();
    const pupilCenterX = pupilRect.left + pupilRect.width / 2;
    const pupilCenterY = pupilRect.top + pupilRect.height / 2;
    const angle = Math.atan2(
      e.clientY - pupilCenterY,
      e.clientX - pupilCenterX,
    );
    const maxDistance = 5; // pixels the pupil can move
    const distance = Math.min(
      maxDistance,
      Math.sqrt(
        (e.clientX - pupilCenterX) ** 2 + (e.clientY - pupilCenterY) ** 2,
      ) / 10,
    );
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    pupil.style.transform = `translate(${x}px, ${y}px)`;
  }
}

function toggleBlink(state) {
  const playState = state === "paused" ? "paused" : "running";
  const eyes = document.getElementsByClassName("eye");
  for (let eye of eyes) {
    eye.style.animationPlayState = playState;
  }

}

function stopSmile() {
  const mouth = document.querySelector(".mouth");
  const decreaseStep = 1; // pixels to decrease per step
  const stepInterval = 30; // milliseconds between steps

  const decreaseInterval = setInterval(() => {
    const newHeight = Math.max(
      0,
      parseFloat(mouth.style.height) - decreaseStep,
    );
    mouth.style.height = newHeight + "px";

    if (newHeight <= 0) {
      clearInterval(decreaseInterval);
      mouth.style.height = "0px";
    }
  }, stepInterval);
}
function resetPupils(){
  const pupils = document.getElementsByClassName("pupil");
  const stepInterval = 50; // milliseconds between steps
  const steps = 10; // number of steps to complete the animation
  let currentStep = 0;
  
  const animateReset = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps; // 0 to 1
    
    for (let pupil of pupils) {
      const transform = pupil.style.transform;
      const match = transform.match(/translate\((.+?)px,\s*(.+?)px\)/);
      
      if (match) {
        const currentX = parseFloat(match[1]);
        const currentY = parseFloat(match[2]);
        
        // Interpolate towards 0
        const newX = currentX * (1 - progress);
        const newY = currentY * (1 - progress);
        
        pupil.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    }
    
    if (currentStep >= steps) {
      clearInterval(animateReset);
      // Ensure final position is exactly 0
      for (let pupil of pupils) {
        pupil.style.transform = "translate(0px, 0px)";
      }
    }
  }, stepInterval);
}
function smile(speed) {
  const mouth = document.querySelector(".mouth");
  const currentHeight = parseFloat(mouth.style.height) || 0;

  // Increase smile height based on speed
  const heightIncrease = (speed / MAX_SPEED) * 1; // increase per frame
  const newHeight = Math.min(currentHeight + heightIncrease, MAX_SMILE_HEIGHT);
  console.log(newHeight);
  mouth.style.height = newHeight + "px";
}

document.addEventListener("mousedown", function() {
  const eyes = document.getElementsByClassName("eye");
  const mouth = document.querySelector(".mouth");
  
  // Change to squinted >o< face
  toggleBlink("paused");
  
  eyes[0].classList.add("squinted");
  eyes[0].innerHTML = ">";
  
  eyes[1].classList.add("squinted");
  eyes[1].innerHTML = "<";
  
  mouth.classList.add("o-mouth");
  mouth.style.height = "auto";
});

document.addEventListener("mouseup", function() {
  const eyes = document.getElementsByClassName("eye");
  const mouth = document.querySelector(".mouth");
  
  // Reset to normal state
  for (let eye of eyes) {
    eye.classList.remove("squinted");
    eye.innerHTML = '<div class="pupil"></div>';
  }
  mouth.classList.remove("o-mouth");
  mouth.style.height = "0px";
  toggleBlink("running");
});
