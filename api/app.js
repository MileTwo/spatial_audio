const { PassThrough, Writable } = require("stream");
const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const port = 3001;
const proxy = require("express-http-proxy");

var streamBuffers = require("stream-buffers");

const globalStreams = {};

app.use(cors());

app.post("/audio/:id", function (req, res) {
  console.log("Data post init");
  const _id = req.params.id;
  let stream = globalStreams[_id];
  if (!stream) {
    // stream = new PassThrough(); // this will pass through, will require more configuration for webm metadata (icecast?)
    stream = new streamBuffers.ReadableStreamBuffer({}); // this collects all the data
    globalStreams[_id] = stream;
  }

  req.on("data", (data) => {
    // stream.write(data);
    stream.put(data);
  });

  req.on("end", () => {
    console.log("request end");
    res.status(200);
    res.end();
  });
});
app.get("/audio/:id", function (req, res) {
  const _id = req.params.id;
  let stream = globalStreams[_id];
  console.log(":Reading from /audio/:id", _id);
  if (!stream) {
    res.status = 404;
    res.end("No such buffer");
    console.log("**ERROR: no buffer found.");
    return;
  } else {
    const head = {
      "Content-Type": "audio/webm;codecs=opus",
    };
    res.writeHead(200, head);
    stream.pipe(res);
  }
});

app.use("/build", express.static("build"));
app.use("/", proxy("localhost:5000"));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
