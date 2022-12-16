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
cameraSelect.addEventListener("input", handleCamereChange);

// 미디어 불러오기
getMedia();

/*
함수영역
*/
async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };

  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

/*
핸들러 영역
*/
function handleCamereClick() {
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

async function handleCamereChange() {
  await getMedia(cameraSelect.value);
}
