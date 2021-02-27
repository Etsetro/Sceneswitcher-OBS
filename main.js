const OBSWebSocket = require("obs-websocket-js");
const express = require("express");

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const PORT = 3000;

const obs = new OBSWebSocket();
obs
  .connect({ address: "localhost:4444", password: "secret" })
  .catch((err) => console.log(err));

app.use(express.static("./public"));

io.on("connection", (socket) => {
  io.on("audioInput", (body) => {
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
  socket.on("input check", ({ index, value }) => {
    obs
      .send("SetCurrentScene", { "scene-name": value })
      .then((data) => {
        if (data) {
          socket.emit("correct input", index);
        }
      })
      .catch((err) => socket.emit("incorrect input", index));
  });
});
function changeScene() {
  obs
    .send("SetCurrentScene", { "scene-name": "Primary" })
    .catch((err) => console.log(err));
}

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
