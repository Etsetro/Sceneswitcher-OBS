const express = require("express");
const OBSWebSocket = require("obs-websocket-js");
const socket = require("socket.io");

const app = express();
const server = require("http").createServer(app);

const PORT = 3000;

// const obs = new OBSWebSocket();
// obs
//   .connect({ address: "localhost:4444", password: "secret" })
//   .catch((err) => console.log(err));

const io = socket(server);

app.use(express.static("./public"));

io.on("connection", (socket) => {
  socket.on("audioInput", (body) => {
    console.log({
      volume: parseInt(body.volume),
      id: body.id,
      scene: body.scene,
      limit: parseInt(body.limit),
    });
    changeScene({
      volume: parseInt(body.volume),
      id: body.id,
      scene: body.scene,
      limit: -25,
    });
  });
});
function changeScene() {
  obs
    .send("SetCurrentScene", { "scene-name": "Primary" })
    .catch((err) => console.log(err));
}

// setInterval(() => {
//   changeScene();
// }, 1000);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
