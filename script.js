let inactivityTimer; //time in ms after which blink resumes
document.addEventListener("mousemove", function (e) {
  clearTimeout(inactivityTimer);
  eyeMovement(e);

  //smile on mouse move
  //stop blink
   
  toggleBlink("paused");

  inactivityTimer = setTimeout(() => toggleBlink("running"), 2000);
    
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
      e.clientX - pupilCenterX
    );
    const maxDistance = 5; // pixels the pupil can move
    const distance = Math.min(
      maxDistance,
      Math.sqrt(
        (e.clientX - pupilCenterX) ** 2 + (e.clientY - pupilCenterY) ** 2
      ) / 10
    );
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    pupil.style.transform = `translate(${x}px, ${y}px)`;
  }
}

function toggleBlink(state){
  const playState = state === "paused" ? "paused" : "running";
  const eyes = document.getElementsByClassName("eye");    
  for (let eye of eyes) {
    eye.style.animationPlayState = playState;
  }
}
