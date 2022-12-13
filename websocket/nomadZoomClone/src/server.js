import http from "http";
import express from "express";
import WebSocket from "ws";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app); // express를 http서버로 만들어야 접근할 수 있어서 이렇게 함.
const wss = SocketIO(httpServer); // 인자로 server를 넘셔서 같은 포트에서 http, ws모두 사용할 수 있게됨

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
