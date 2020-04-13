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
  panner.setOrientation(1, 0, 0);
  listener = audioCtx.listener;
  listener.setOrientation(0, 0, -1, 0, 1, 0);

  panner.panningModel = "HRTF";
  panner.distanceModel = "inverse";
  panner.refDistance = 1;
  panner.maxDistance = 10000;
  panner.rolloffFactor = 1;
  panner.coneInnerAngle = 360;
  panner.coneOuterAngle = 0;
  panner.coneOuterGain = 0;

  /* Destination for pushing chunks.. */
  var dest = audioCtx.createMediaStreamDestination();
  var mediaRecorder = new MediaRecorder(dest.stream);

  mediaRecorder.ondataavailable = function (evt) {
    // push each chunk (blobs) in an array
    // chunks.push(evt.data);
    // TODO -- stream the data to the server!!
  };
  let audio = document.querySelector("audio");
  var audioSrc = audioCtx.createMediaElementSource(audio);
  audioSrc.connect(panner).connect(dest).connect(audioCtx.destination);
  audio.src = "http://localhost:3001/audio";
  audio.controls = true;
  audio.play();
};

let updateDistance = () => {
  console.log("updating distances", pos1);
  listener.positionX.setValueAtTime(-pos1.x, audioCtx.currentTime);
  listener.positionY.setValueAtTime(pos1.y, audioCtx.currentTime);
};

let handleRecord = async () => {
  var constraints = { audio: true };
  console.log("getting mediastream:");
  try {
    let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    //await context.audioWorklet.addModule('bypass-processor.js');
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
