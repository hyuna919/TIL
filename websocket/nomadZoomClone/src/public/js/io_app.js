/*

Socket.IO 버전 front 코드

*/

const socket = io();

// 괜히 이것저것 써서 선택해보기
const welcome = document.getElementById("welcome");
const form = document.querySelector("form"); // 가장 처음에 있는거 가져온다
const room = document.getElementById("room");

// 초기화
room.hidden = true;

let roomName;

// 이벤트 붙이기
form.addEventListener("submit", handleRoomSubmit);
// room.addEventListener("submit", handleMsgSubmit);

// 소켓 이벤트
socket.on("welcome", (user, memberCnt) => {
  addMsg(`👋👋 ${user} is joined! 👋👋`);
  revaliateMemberCnt(memberCnt);
});
socket.on("bye", (user, memberCnt) => {
  addMsg(`-- ${user} is left --`);
  revaliateMemberCnt(memberCnt);
});
socket.on("send_msg", addMsg);
socket.on("revalidate_rooms", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    roomList.innerHTML = "";
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
}); // === socket.on("room_change", (msg) => console.log(msg));

// 방 입장 -> 서버로
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, enterRoom);
  roomName = input.value;
  input.value = "";
}

// 방 입장 -> 프론트 변화
function enterRoom() {
  // 방 보여주기
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room [${roomName}]`;

  // 메세지창에 이벤트 달기
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMsgSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function addMsg(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

// 메세지 보내기
function handleMsgSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const msg = input.value;
  socket.emit("send_msg", msg, roomName, () => {
    addMsg(`You: ${msg}`);
  });
  input.value = "";
}

// 이름 정하기
function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const msg = input.value;
  socket.emit("nickname", msg);
  input.value = "";
}

// 인원수 갱신
function revaliateMemberCnt(memberCnt) {
  // const welcome = document.getElementById("welcome");
  // const h3 = room.querySelector("h3");
  const h3 = document.getElementById("roomCnt");
  h3.innerText = `(${memberCnt}명)`;
}
