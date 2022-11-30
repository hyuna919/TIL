import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); // express를 http서버로 만들어야 접근할 수 있어서 이렇게 함.
const wss = new WebSocket.Server({ server }); // 인자로 server를 넘셔서 같은 포트에서 http, ws모두 사용할 수 있게됨

const sockets = [];
wss.on("connection", (socket) => {
  // init
  socket.send("서버와 연결되었습니다.");
  console.log("🟢 Connected 2 Browser 🟢");
  socket["nickname"] = "guest";

  // socket 기록
  sockets.push(socket);

  // 수신
  socket.on("message", (message) => {
    const msg = JSON.parse(message);

    if (msg.type == "nickname") {
      socket["nickname"] = msg.payload;
    } else if (msg.type == "msg") {
      sockets.forEach((aSocket) =>
        aSocket.send(`${socket.nickname}: ${msg.payload}`)
      );
    }
  });

  // 연결 종료
  socket.on("close", () => console.log("❌ Disconnected from the Browser ❌"));
});

server.listen(3000, handleListen);
