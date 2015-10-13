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

const privatePort = makePrivate();

class Port extends EventEmitter {

  constructor(client) {
    super();
    const privy = privatePort(this);
    privy.client = client;

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
    privatePort(this).client.write(bufferFrom(message));
  }

}

const privateMessagingChannel = makePrivate();

class MessagingChannel extends EventEmitter {

  connect(sockPath) {
    const privy = privateMessagingChannel(this);
    if (privy.server) throw new Error("Channel already connected");
    privy.sockPath = sockPath;

    privy.server = net.Server();

    const listeningPromise = new Promise((resolve, reject) => {
      privy.server.once("listening", () => {
        privy.server.removeListener("error", reject);
        resolve();
      });
      privy.server.once("error", () => {
        privy.server.removeListener("listening", resolve);
        reject();
      });
    });

    privy.server.on("connection", (client) => {
      this.emit("connection", new Port(client));
    });

    privy.server.listen(privy.sockPath);

    return listeningPromise;
  }

  disconnect() {
    const privy = privateMessagingChannel(this);
    // Needs to be synchronous as it could be called when exiting the process.
    privy.server.close();
    if (fs.existsSync(privy.sockPath)) fs.unlinkSync(privy.sockPath);
  }

}

module.exports = MessagingChannel;
