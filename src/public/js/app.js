const msgList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const msgForm = document.querySelector("#msg");
const socket = new WebSocket(`ws://${window.location.host}`);

const list = [];

/*
form 이벤트
*/
msgForm.addEventListener("submit", handleSumit);
nickForm.addEventListener("submit", handleNickSubmit);

/*
소켓 이벤트
*/
socket.addEventListener("open", () => {
  console.log("🟢 Connected 2 Server 🟢");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  msgList.append(li);
});

socket.addEventListener("close", () => {
  console.log("❌ Disconnected from Server ❌");
});

/*
init msg
*/
setTimeout(() => {
  socket.send(makeMsg("msg", "클라이언트 연결 확인 메세지"));
}, 3000);

/*
함수
*/
function handleSumit(event) {
  event.preventDefault(); // 새로고침 방지
  const input = msgForm.querySelector("input");
  socket.send(makeMsg("msg", input.value));
  input.value = "";

  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  msgList.append(li);
}

function handleNickSubmit(event) {
  event.preventDefault(); // 새로고침 방지
  const input = nickForm.querySelector("input");
  socket.send(makeMsg("nickname", input.value));
}

function makeMsg(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}
