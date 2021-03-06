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
  socket.on("audio input", (data) => {
    console.log({
      id: data.id,
      volume: data.volume,
      scene: data.scene,
    });
    changeScene({
      id: data.id,
      volume: data.volume,
      scene: data.scene,
      limit: -25,
    });
  });

  socket.on("input check", ({ index, value }) => {
    obs
      .send("GetSceneList")
      .then((data) => {
        for (i of data.scenes) {
          if (i.name == value) {
            socket.emit("correct input", index);
            return;
          } else {
            socket.emit("incorrect input", index);
          }
        }
      })
      .catch((err) => console.log(err));
  });

  socket.on("submit settings", ({ scenes }) => {
    obs
      .send("GetSceneList")
      .then((data) => {
        for (i of data.scenes) {
          for (let j = 0; j < scenes.length; j++) {
            if (i.name == scenes[j]) {
              socket.emit("valid inputs");
              return;
            } else {
              socket.emit("invalid inputs");
            }
          }
        }
      })
      .catch((err) => console.log(err));
  });
});
function changeScene({ id, volume, scene, limit }) {
  obs
    .send("SetCurrentScene", { "scene-name": scene })
    .catch((err) => console.log(err));
}

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
