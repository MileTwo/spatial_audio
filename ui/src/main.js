import App from "./App.svelte";
let buttonName = "Start";
let pos1 = { x: 0, y: 0 };

let listener;
let audioCtx;
let handleClick = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  /* Panner for spatial audio: */
  const panner = audioCtx.createPanner();
  // panner.setOrientation(1, 0, 0);
  listener = audioCtx.listener;
  // listener.setOrientation(0, 0, -1, 0, 1, 0);

  panner.panningModel = "HRTF";
  panner.distanceModel = "inverse";
  panner.refDistance = 1;
  panner.maxDistance = 100;
  panner.rolloffFactor = 1;
  panner.coneInnerAngle = 360;
  panner.coneOuterAngle = 0;
  panner.coneOuterGain = 0;

  let audio = document.querySelector("audio");
  var audioSrc = audioCtx.createMediaElementSource(audio);
  audioSrc.connect(panner).connect(audioCtx.destination);
  audio.src = "/audio/1";
  audio.controls = true;
  audio.play();
};

let updateDistance = () => {
  if (!listener) {
    console.log("not updating, listener is not active");
    return;
  }
  console.log("updating distances", pos1);
  listener.positionX.setValueAtTime(-pos1.x, audioCtx.currentTime);
  listener.positionY.setValueAtTime(pos1.y, audioCtx.currentTime);
};

let handleRecord = async () => {
  var constraints = { audio: true };
  console.log("getting mediastream:");
  try {
    let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

    var mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "audio/webm;codecs=opus" });

    mediaRecorder.ondataavailable = async (e) => {
      console.log("data is available...");
      try {
        await fetch("/audio/1", {
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
    buttonName: buttonName,
    handleClick: handleClick,
    updateDistance: updateDistance,
    handleRecord: handleRecord,
    pos1: pos1,
  },
});

export default app;
