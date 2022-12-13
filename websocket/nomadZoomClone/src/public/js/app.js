/*

WebRTC 버전 front 코드

*/

const socket = io();

const myFace = document.getElementById("myFace");
const cameraBtn = document.getElementById("cameraBtn");
const micBtn = document.getElementById("micBtn");

let myStream;
let cameraState = false;
let micState = false;

getMedia();

cameraBtn.addEventListener("click", handleCamereClick);
micBtn.addEventListener("click", handleMicClick);

/*
함수영역
*/
async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: micState,
      video: true,
    });
    myFace.srcObject = myStream;
  } catch (e) {
    console.log(e);
  }
}

function handleCamereClick() {
  if (!cameraState) {
    cameraBtn.innerText = "UNMUTE";
    cameraState = true;
  } else {
    cameraBtn.innerText = "Mute";
    cameraState = false;
  }
  getMedia();
}

function handleMicClick() {
  if (!micState) {
    micBtn.innerText = "UNMUTE";
    micState = true;
  } else {
    micBtn.innerText = "Mute";
    micState = false;
  }
  getMedia();
}
