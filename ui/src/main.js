import App from "./App.svelte";
let buttonName = "Start";
let clients = [1, 2];
let pos = [];
for (let i = 0; i < clients.length; i++) {
  pos[clients[i]] = { x: 0, y: 0, z: 0 };
}

let listener = [];
let audioCtx;

let handleClick = async (id) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  /* Panner for spatial audio: */
  const panner = audioCtx.createPanner();
  listener[id] = audioCtx.listener;

  panner.panningModel = "HRTF";
  panner.distanceModel = "inverse";
  panner.refDistance = 1;
  panner.maxDistance = 100;
  panner.rolloffFactor = 1;
  panner.coneInnerAngle = 360;
  panner.coneOuterAngle = 0;
  panner.coneOuterGain = 0;

  let audio = document.querySelector("#audio" + id);
  var audioSrc = audioCtx.createMediaElementSource(audio);
  audioSrc.connect(panner).connect(audioCtx.destination);
  audio.src = "/audio/" + id;
  audio.controls = true;
  audio.play();
};

let updateDistance = (id) => {
  let l = listener[id];
  let pos1 = pos[id];

  if (!l) {
    console.log("not updating, listener is not active");
    return;
  }
  console.log("updating distances", pos1);
  l.positionX.setValueAtTime(-pos1.x, audioCtx.currentTime);
  l.positionY.setValueAtTime(pos1.y, audioCtx.currentTime);
  l.positionZ.setValueAtTime(pos1.z, audioCtx.currentTime);
};

let handleRecord = async (id) => {
  var constraints = { audio: true };
  console.log("getting mediastream:");
  // clear out buffer for user:
  try {
    await fetch("/clearBuffer/" + id, { method: "POST" });
  } catch (err) {
    console.log("error", err);
  }
  try {
    let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

    var mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "audio/webm;codecs=opus" });

    mediaRecorder.ondataavailable = async (e) => {
      console.log("data is available...");
      try {
        await fetch("/audio/" + id, {
          method: "POST",
          body: e.data,
        });
      } catch (err) {
        console.log("error", err);
      }
    };
    mediaRecorder.start(1000);
  } catch (err) {
    console.log("error", err);
  }
};

const app = new App({
  target: document.body,
  props: {
    handleClick: handleClick,
    updateDistance: updateDistance,
    handleRecord: handleRecord,
    pos: pos,
    clients: clients,
  },
});

export default app;
