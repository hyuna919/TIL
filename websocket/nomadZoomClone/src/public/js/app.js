/*

WebRTC 버전 front 코드

*/

const socket = io();

const myFace = document.getElementById("myFace");
const cameraBtn = document.getElementById("cameraBtn");
const micBtn = document.getElementById("micBtn");
const cameraSelect = document.getElementById("cameraSelect");

let myStream;
let cameraState = false;
let micState = false;

// 리스너
cameraBtn.addEventListener("click", handleCamereClick);
micBtn.addEventListener("click", handleMicClick);

// 미디어 불러오기
getMedia();

/*
함수영역
*/
async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myFace.srcObject = myStream;
    await getCameras();
  } catch (e) {
    console.log(e);
  }
}

function handleCamereClick() {
  console.log(myStream.getVideoTracks());
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!cameraState) {
    cameraBtn.innerText = "🎥 TURN ON";
    cameraState = true;
  } else {
    cameraBtn.innerText = "🎥 TURN OFF";
    cameraState = false;
  }
}

function handleMicClick() {
  console.log(myStream.getAudioTracks());
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  if (!micState) {
    micBtn.innerText = "🎤 UNMUTE";
    micState = true;
  } else {
    micBtn.innerText = "🎤 MUTE";
    micState = false;
  }
}

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    console.log(cameras);
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}
