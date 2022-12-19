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

async function initCall() {
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

socket.on("offer", async (offer) => {
  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

/*
WebRTC
*/
function makeConnection() {
  myPeerConnection = new RTCPeerConnection();

  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("track", handleAddStream);
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  const peerFace = document.getElementById("peerFace");
  peerFace.srcObject = data.streams[0];
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

async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  await initCall();
  roomName = input.value;
  socket.emit("join_room", roomName);
  input.value = "";
}
