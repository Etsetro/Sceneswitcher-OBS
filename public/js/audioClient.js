let visualizer = document.querySelector(".visualizer");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      addAudioStream(stream);
    })
    .catch((err) => console.log(err)); // TODO: resolve
} else {
  alert("Microphone input is not supported");
}

function addAudioStream(stream) {
  let ctx = new AudioContext();
  let source = ctx.createMediaStreamSource(stream);
  let analyser = ctx.createAnalyser();
  let javasriptNode = ctx.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.1;
  analyser.fftSize = 1024;

  let dest = ctx.createMediaStreamDestination();
  let gainNode = ctx.createGain();

  source.connect(analyser);
  analyser.connect(javasriptNode);
  javasriptNode.connect(ctx.destination);

  javasriptNode.onaudioprocess = () => {
    let arr = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(arr);
    let values = arr.reduce((a, b) => a + b, 0);
    visualizer.innerHTML = Math.round(values / 1000);
  };
}

function handleSlider(index, val) {
  const output = document.querySelector(`.volume-output-${index}`);
  output.innerHTML = val;
}

function handleInput(val) {}

function handleSubmit() {}

window.onload = () => {
  for (let i = 0; i < 4; i++) {
    document.querySelector(".scenes").innerHTML += `
      <div>
          <h3>Scene name</h3>
          <input type="text" class="scene-name-${i}" onchange="handleInput(${i}, this.value)">
          <input type=range class="volume-slider" min=0 max=100 value=1 step=1 oninput="handleSlider(${i}, this.value)">
          <h2 class="volume-output-${i}">1</h2>
      </div>
    `;
  }
};
