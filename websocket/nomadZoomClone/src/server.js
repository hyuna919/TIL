import http from "http";
import express from "express";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import { emit } from "process";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app); // express를 http서버로 만들어야 접근할 수 있어서 이렇게 함.
// const wss = new WebSocket.Server({ server }); // 인자로 server를 넘셔서 같은 포트에서 http, ws모두 사용할 수 있게됨
const ioServer = SocketIO(httpServer);

ioServer.on("connection", (socket) => {
  // 초기화
  socket["nickname"] = "Anonymous";

  // 발생한 이벤트 알려줌
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  // 입장
  socket.on("enter_room", (roomName, done) => {
    // 입장
    socket.join(roomName);
    done(); // 콜백 : 프론트에서 showRoom실행
    socket.to(roomName).emit("welcome", socket.nickname); // 입장 알림

    // 접속 중단이 되었을 때(방에서 나가는 것 아님)
    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) =>
        socket.to(room).emit("bye", socket.nickname)
      );
    });

    // 메세지 전송
    socket.on("send_msg", (msg, room, done) => {
      socket.to(room).emit("send_msg", `${socket.nickname}: ${msg}`);
      done();
    });

    // 닉네임
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));

    // 개인 메세지
    // socket.to(roomName).emit("an event", { some: "data" });
  });
});

// ws 코드
// const sockets = [];
// wss.on("connection", (socket) => {
//   // init
//   socket.send("서버와 연결되었습니다.");
//   console.log("🟢 Connected 2 Browser 🟢");
//   socket["nickname"] = "guest";

//   // socket 기록
//   sockets.push(socket);

//   // 수신
//   socket.on("message", (message) => {
//     const msg = JSON.parse(message);

//     if (msg.type == "nickname") {
//       socket["nickname"] = msg.payload;
//     } else if (msg.type == "msg") {
//       sockets.forEach((aSocket) =>
//         aSocket.send(`${socket.nickname}: ${msg.payload}`)
//       );
//     }
//   });

//   // 연결 종료
//   socket.on("close", () => console.log("❌ Disconnected from the Browser ❌"));
// });

httpServer.listen(3000, handleListen);
