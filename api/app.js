const express = require("express");
const fs = require("fs");
// var stream = require("stream")
const buffer = require("buffer");
const app = express();
const cors = require("cors");
const port = 3001;
const proxy = require("express-http-proxy");

const globalBuffers = {};

app.unsubscribe(cors());
// app.get("/", (req, res) => res.send("Hello World!"));
app.post("/audio/:id", function (req, res) {
  const _id = req.params.id;
  let buffer = globalBuffers[_id];
  if (!buffer) {
    let buffer = new Buffer();
    globalBuffers[_id] = buffer;
  }
  // buffer.write(req.)
});
app.get("/audio", function (req, res) {
  //   const path = "ff-16b-2c-44100hz.mp3";
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

app.use("/", proxy("localhost:5000"));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
