"use strict";

const EventEmitter = require("events").EventEmitter;
const net = require("net");
const fs = require("fs");
const os = require("os");

const streamChunks = require("./stream-util").streamChunks;
const makePrivate = require("./make-private");

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

    this.client = client;

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
    this.client.write(bufferFrom(message));
  }

}

Port = makePrivate(Port);

class MessagingChannel extends EventEmitter {

  connect(sockPath) {
    if (this.server) throw new Error("Channel already connected");
    this.sockPath = sockPath;

    this.server = net.Server();

    const listeningPromise = new Promise((resolve, reject) => {
      this.server.once("listening", () => {
        this.server.removeListener("error", reject);
        resolve();
      });
      this.server.once("error", () => {
        this.server.removeListener("listening", resolve);
        reject();
      });
    });

    this.server.on("connection", (client) => {
      this.emit("connection", new Port(client));
    });

    this.server.listen(this.sockPath);

    return listeningPromise;
  }

  disconnect() {
    // Needs to be synchronous as it could be called when exiting the process.
    this.server.close();
    if (fs.existsSync(this.sockPath)) fs.unlinkSync(this.sockPath);
  }

}

module.exports = makePrivate(MessagingChannel);
