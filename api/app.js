const { Readable, Writable } = require("stream");
const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const port = 3001;
const proxy = require("express-http-proxy");

var streamBuffers = require("stream-buffers");

const globalStreams = {};

app.unsubscribe(cors());
app.post("/clearBuffer/:id", function (req, res) {
  const _id = req.params.id;
  console.log("Status: clearing buffer: " + _id);
  try {
    let stream = new streamBuffers.ReadableStreamBuffer({});
    globalStreams[_id] = stream;
    res.status(200);
    res.end();
  } catch (err) {
    console.error(error, err);
    res.status(500);
    res.end();
  }
});
app.post("/audio/:id", function (req, res) {
  console.log("Data post init");
  const _id = req.params.id;
  let stream = globalStreams[_id];
  if (!stream) {
    stream = new streamBuffers.ReadableStreamBuffer({});

    globalStreams[_id] = stream;
  }
  req.on("data", (data) => {
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
app.get("/audio", function (req, res) {
  const path = "out.mp3";
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "audio/mp3",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "audio/mp3",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});
app.use("/build", express.static("build"));
app.use("/", proxy("localhost:5000"));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
