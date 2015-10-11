"use strict";

const streamChunks = (readable, getLengthToRead, emit) => {
  const unfinishedBuffers = [];
  let lengthToRead = -1;

  readable.on("data", (lastBuffer) => {
    let offset = 0;

    while (offset < lastBuffer.length) {
      if (lengthToRead < 0) {
        lengthToRead = getLengthToRead(lastBuffer.slice(offset));
      }

      // If the buffer does not contain enough bytes, store the remaining bytes to use it later.
      if (lengthToRead < 0 || offset + lengthToRead > lastBuffer.length) {
        unfinishedBuffers.push(lastBuffer.slice(offset));
        lengthToRead -= lastBuffer.length - offset;
        break;
      }

      // Read enough, prepare the buffer to emit.
      let chunkBuffer = lastBuffer.slice(offset, offset + lengthToRead);

      // Prepend unfinished buffers, if any.
      if (unfinishedBuffers.length > 0) {
        unfinishedBuffers.push(chunkBuffer);
        chunkBuffer = Buffer.concat(unfinishedBuffers);
        unfinishedBuffers.length = 0;
      }

      emit(chunkBuffer);

      offset += lengthToRead;
      lengthToRead = -1;
    }
  });

  readable.on("end", () => {
    if (unfinishedBuffers.length > 0 && lengthToRead < 0) {
      emit(Buffer.concat(unfinishedBuffers));
    }
    unfinishedBuffers.length = 0;
  });
};

const streamLines = (readable, emit) => {
  streamChunks(readable, (chunk) => {
    const index = chunk.indexOf("\n");
    return index < 0 ? -1 : index + 1;
  }, emit);
};

module.exports = {
  streamChunks,
  streamLines,
};

// TODO move this in a test runner
if (process.env.NODE_ENV === "test") {

  const emitDataByChunk = (readable, buffer, size) => {
    for (let i = 0; i < buffer.length; i += size) {
      readable.emit("data", buffer.slice(i, i + size));
    }
    readable.emit("end");
  };

  const collect = (fn) => {
    const result = [];
    fn((item) => result.push(item));
    return result;
  }

  const EventEmitter = require("events").EventEmitter;
  const assert = require("assert");
  const readable = new EventEmitter();

  const lines = collect(streamLines.bind(null, readable));

  emitDataByChunk(readable, new Buffer("line 1\nline 2"), 100);
  emitDataByChunk(readable, new Buffer("line 1\nline 2"), 3);
  emitDataByChunk(readable, new Buffer("line 1\nline 2"), 2);
  emitDataByChunk(readable, new Buffer("line 1\nline 2"), 1);

  assert.deepEqual(lines.map(String), [
    "line 1\n", "line 2",
    "line 1\n", "line 2",
    "line 1\n", "line 2",
    "line 1\n", "line 2",
  ]);

  console.log("test passed"); // eslint-disable-line no-console

}
