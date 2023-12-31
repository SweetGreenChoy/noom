import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function handleConnection(socket) {
  console.log(socket);
}

function onSocketClose(socket) {
  console.log("Disconnected from browser");
}

const users = [];

wss.on("connection", (socket) => {
  users.push(socket);
  console.log("Connected to Browser");
  socket.on("close", onSocketClose);
  socket.on("message", (message) => {
    const messageString = message.toString("utf8");
    users.forEach((aSocket) => aSocket.send(messageString));
  });
});

server.listen(3000, handleListen);
