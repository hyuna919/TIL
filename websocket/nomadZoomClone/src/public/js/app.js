/*

WebRTC 버전 front 코드

*/

const socket = io();

const myFace = document.getElementById("myFace");
const cameraBtn = document.getElementById("cameraBtn");
const micBtn = document.getElementById("micBtn");
const cameraSelect = document.getElementById("cameraSelect");
const welcome = document.getElementById("welcome");
const call = document.getElementById("call");
const welcomeForm = welcome.querySelector("form");

call.hidden = true;

let myStream;
let cameraState = false;
let micState = false;
let roomName;
let myPeerConnection;

// 리스너
cameraBtn.addEventListener("click", handleCamereClick);
micBtn.addEventListener("click", handleMicClick);
cameraSelect.addEventListener("input", handleCamereChange);
welcomeForm.addEventListener("submit", handleWelcomeSubmit);

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

async function startMedia() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

/*
소켓 영역 
*/

socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  socket.emit("offer", offer, roomName);
});
socket.on("offer", (offer) => {
  console.log(offer);
});

/*
WebRTC
*/
function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
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

function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  roomName = input.value;
  socket.emit("join_room", roomName, startMedia);
  input.value = "";
}
