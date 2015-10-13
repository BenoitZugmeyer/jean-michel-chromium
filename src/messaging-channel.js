"use strict";

const EventEmitter = require("events").EventEmitter;
const net = require("net");
const os = require("os");
const path = require("path");

const streamChunks = require("./stream-util").streamChunks;
const PromiseUtil = require("./promise-util");
const makePrivate = require("./make-private");
const FsUtil = require("./fs-util");

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

// Quoting the doc:
// This name can only contain lowercase alphanumeric characters, underscores and dots. The
// name cannot start or end with a dot, and a dot cannot be followed by another dot.
const validMessagingName = (name) => /^([a-z0-9_]+\.)*[a-z0-9_]+$/.test(name);

const listen = (server, sockPath) => {
  const listeningPromise = new Promise((resolve, reject) => {
    server.once("listening", () => {
      server.removeListener("error", reject);
      resolve();
    });
    server.once("error", () => {
      server.removeListener("listening", resolve);
      reject();
    });
  });

  server.listen(sockPath);
  return listeningPromise;
};

const privateMessagingChannel = makePrivate();

const disconnect = (channel) => {
  const privy = privateMessagingChannel(channel);
  privy.cancelConnect = true;
  if (privy.server) privy.server.close();
  if (privy.directory) privy.directory.cleanup();
};

const connect = PromiseUtil.wrapRun(function* (channel) {
  const privy = privateMessagingChannel(channel);
  privy.cancelConnect = false;

  const assertNotCanceled = () => {
    if (privy.cancelConnect) throw new Error("Connection canceled");
  };

  try {
    privy.directory = yield FsUtil.createTemporaryDirectory({ prefix: `MessagingChannel-${privy.name}-`})
    assertNotCanceled();
    privy.sockPath = path.join(privy.directory.path, "pipeio.sock");
    const pipeioPath = path.join(privy.directory.path, "pipeio.js")

    yield FsUtil.symlink(path.join(__dirname, "..", "pipeio", "pipeio.js"), pipeioPath);
    assertNotCanceled();

    privy.server = net.Server();

    yield listen(privy.server, privy.sockPath);
    assertNotCanceled();

    privy.server.on("connection", (client) => {
      channel.emit("connection", new Port(client));
    });

    return { name: privy.name, pipeioPath };
  }
  catch (e) {
    disconnect(channel);
    throw e;
  }
});

class MessagingChannel extends EventEmitter {

  constructor(name) {
    if (!name) throw new Error("Messaging channel name is mendatory");
    name = String(name);
    if (!validMessagingName(name)) throw new Error("Invalid messaging channel name");
    super();
    const privy = privateMessagingChannel(this);
    privy.name = name;
    privy.refs = new Set();
  }

  get name() {
    return privateMessagingChannel(this).name;
  }

  _ref(chromium) {
    const privy = privateMessagingChannel(this);
    privy.refs.add(chromium);
    if (!privy.connectPromise) privy.connectPromise = connect(this);
    return privy.connectPromise;
  }

  _unref(chromium) {
    const privy = privateMessagingChannel(this);
    if (privy.refs.has(chromium)) {
      privy.refs.delete(chromium);
      if (privy.refs.size === 0) disconnect(this);
    }
  }

}

module.exports = MessagingChannel;
