"use strict";

const EventEmitter = require("events").EventEmitter;
const net = require("net");
const fs = require("fs");
const os = require("os");

const streamChunks = require("./stream-util").streamChunks;

const endianness = os.endianness();
const uint32Size = 4;

const bufferFrom = (object) => {
  const serialized = JSON.stringify(object);
  const length = Buffer.byteLength(serialized, "utf8")
  const buffer = new Buffer(uint32Size + length);

  buffer[`writeUInt32${endianness}`](length, 0);
  buffer.write(serialized, uint32Size);

  return buffer;
};

const streamObjects = (readable, emit) => {
  let objectSize;
  streamChunks(readable, () => {
    return objectSize === undefined ?
      uint32Size : // read the size of the object
      objectSize;  // read the object
  }, (chunk) => {
    if (objectSize === undefined) {
      objectSize = chunk[`readUInt32${endianness}`](0);
    }
    else {
      objectSize = undefined;
      emit(chunk);
    }
  });
};


class Port extends EventEmitter {

  constructor(client) {
    super();
    this._client = client;

    streamObjects(client, (message) => {
      let parsed;
      try {
        parsed = JSON.parse(message);
      }
      catch (e) {
        this.emit("error", new Error(`While parsing "${message}": ${e}`));
        return;
      }

      this.emit("message", parsed);
    });

    client.on("close", () => this.emit("disconnect"));
  }

  post(message) {
    this._client.write(bufferFrom(message));
  }

}

class MessagingChannel extends EventEmitter {

  constructor(sockPath) {
    super();
    this._server = net.Server();

    this._server.on("connection", (client) => {
      this.emit("connection", new Port(client));
    });

    this._server.listen(sockPath);
  }

  close() {
    // Needs to be synchronous as it could be called when exiting the process.
    if (fs.existsSync(this._sockPath)) fs.unlinkSync(this._sockPath);
  }

}

module.exports = MessagingChannel;
