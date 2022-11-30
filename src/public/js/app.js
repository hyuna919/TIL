/*

Socket.IO 버전 front 코드

*/

const socket = io();

// 괜히 이것저것 써서 선택해보기
const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const enterBtn = document.querySelector("#enterBtn");

form.addEventListener("submit", handleRoomSubmit);

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("room", { payload: input.value });

  input.value = "";
}
