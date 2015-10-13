"use strict";

const child_process = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const tmp = require("tmp");
tmp.setGracefulCleanup();

const pkg = require("../package.json");
const PromiseUtil= require("./promise-util");
const MessagingChannel= require("./messaging-channel");
const makePrivate = require("./make-private");
const wrapRun = PromiseUtil.wrapRun;
const which = PromiseUtil.wrapCPS(require("which"));

const createTemporaryDirectory = PromiseUtil.wrapCPS(tmp.dir, { multi: ["path", "cleanup"] });
const fileExists = PromiseUtil.wrapCPS(fs.exists, { noError: true });
const readFile = PromiseUtil.wrapCPS(fs.readFile);
const writeFile = PromiseUtil.wrapCPS(fs.writeFile);
const symlink = PromiseUtil.wrapCPS(fs.symlink);
const mkdir = PromiseUtil.wrapCPS(fs.mkdir);

const createTemporaryUserDataDirectory = () =>
  createTemporaryDirectory({ prefix: `${pkg.name}-UserData-`, unsafeCleanup: true });

const createTemporaryProfileDirectory = (userDataDirectory) =>
  createTemporaryDirectory({ dir: userDataDirectory, prefix: "Session-", unsafeCleanup: true });

let _defaultBinaryPath;

const findExecutableInPath = wrapRun(function* (names) {
  for (const name of names) {
    try {
      return yield which(name);
    }
    catch (e) {
      // This executable wasn't found, try the next one
    }
  }
  throw new Error(`No executable found in PATH (tried ${names})`);
});

const getDefaultBinaryPath = () => {
  if (!_defaultBinaryPath) {
    _defaultBinaryPath = findExecutableInPath([
      "chromium",
      "google-chrome",
      "chrome",
      "chromium-continuous-bin",
    ]);
  }
  return _defaultBinaryPath;
};

const flagsToArgs = (flags) =>
  Object.keys(flags).map((flag) => {
    const argName = flag.replace(/[A-Z]/g, (ch) => "-" + ch.toLowerCase());
    const argValue = flags[flag];
    if (argValue === true) return `--${argName}`;
    if (argValue !== false) return `--${argName}=${argValue}`;
  });

const spawnChromium = wrapRun(function* (flags, args) {
  const argsWithFlags = flagsToArgs(flags);
  if (args) argsWithFlags.push.apply(argsWithFlags, args);

  const result = child_process.spawn(yield getDefaultBinaryPath(), argsWithFlags, {});

  const exitPromise = new Promise((resolve) => {
    result.on("exit", (code, signal) => {
      resolve({ code, signal });
    });
  });

  result.asyncKill = (signal) => {
    result.kill(signal);
    return exitPromise;
  };

  return result;
});

const computeExtensionId = (path) =>
  crypto
  .createHash('sha256')
  .update(path)
  .digest('hex')
  .slice(0, 32)
  .replace(/./g, (ch) => String.fromCharCode(97 + parseInt(ch, 16)));

const getter =
  (value, a, b, c, d) => PromiseUtil.castPromise(typeof value === "function" ? value(a, b, c, d) : value)

const formatDirectory = function (descriptor, name) {
  let path;
  let cleanup;

  if (typeof descriptor === "string") {
    path = descriptor;
  }
  else if (descriptor && typeof descriptor === "object" && typeof descriptor.path === "string") {
    path = descriptor.path;
    cleanup = descriptor.cleanup;
  }
  else {
    throw new Error(`Bat ${name} value`);
  }

  return { path, cleanup: cleanup || (() => {}) };
};

const mkdirIfNeeded = wrapRun(function* (path) {
  if (!(yield fileExists(path))) yield mkdir(path);
});

const installUserDataDirectory = wrapRun(function* (value) {
  const userData = formatDirectory(yield getter(value), "userDataDirectory");
  if (!path.isAbsolute(userData.path)) throw new Error("userDataDirectory must be absolute");
  yield mkdirIfNeeded(userData.path);
  return userData;
});

const installProfileDirectory = wrapRun(function* (userDataPath, value) {
  const profile = formatDirectory(yield getter(value, userDataPath), "profileDirectory");
  if (!path.isAbsolute(profile.path)) profile.path = path.resolve(userDataPath, profile.path);

  profile.name = path.relative(userDataPath, profile.path);
  if (!/\w+/.test(profile.name)) throw new Error(`Invalid profileDirectory ${profile.path}`);

  yield mkdirIfNeeded(profile.path);

  return profile;
});

const installPreferences = wrapRun(function* (profilePath) {
  const preferencesPath = path.join(profilePath, "Preferences");
  let cleanup;
  let data;

  if (yield fileExists(preferencesPath)) {
    const originalPreferencesContent = yield readFile(preferencesPath);
    cleanup = () => writeFile(preferencesPath, originalPreferencesContent);
    data = JSON.parse(originalPreferencesContent);
  }
  else {
    cleanup = () => {};
    data = {};
  }

  if (!data.extensions) data.extensions = {};
  if (!data.extensions.settings) data.extensions.settings = {};

  return {
    data,
    cleanup,
    path: preferencesPath,
  };
});

const installExtension = wrapRun(function* (preferences, extension) {
  if (!extension || typeof extension !== "object") {
    throw new Error(`Invalid extension type: expected object, received ${typeof extension}`);
  }

  if (typeof extension.path !== "string") {
    throw new Error("Extension path is mendatory");
  }

  if (!(yield fileExists(extension.path))) {
    throw new Error(`Extension does not exist at ${extension.path}`);
  }

  preferences.extensions.settings[computeExtensionId(extension.path)] = extension;
});

const installMessaging = wrapRun(function* (userDataPath, name, allowedExtensions, channel) {
  const pipeioPath = path.join(userDataPath, `${name}_pipeio.js`)
  const sockPath = path.join(userDataPath, `${name}_pipeio.sock`);
  const hostsPath = path.join(userDataPath, "NativeMessagingHosts");
  const manifestPath = path.join(hostsPath, `${name}.json`);

  if (yield fileExists(manifestPath)) {
    throw Error(`Extension ${name} already installed`);
  }

  yield mkdirIfNeeded(hostsPath);

  yield symlink(path.join(__dirname, "..", "pipeio", "pipeio.js"), pipeioPath);

  const manifest = {
    name,
    description: `${pkg.name} messaging channel for ${name}`,
    path: pipeioPath,
    type: "stdio",
    allowed_origins: allowedExtensions.map((ext) => `chrome-extension://${ext}/`),
  };
  yield writeFile(manifestPath, JSON.stringify(manifest));

  yield channel.connect(sockPath);

  return {
    cleanup() {
      fs.unlinkSync(manifestPath);
      channel.disconnect();
    },
  };
});

const addCleanup = (chromium, fn) => {
  privateChromium(chromium).toCleanup.unshift(fn);
}

const cleanup = (chromium) => {
  const privy = privateChromium(chromium);
  for (const obj of privy.toCleanup) {
    obj.cleanup();
  }
  privy.toCleanup.length = 0;
  privy.spawning = false;
  privy.cancelSpawn = false;
}

const privateChromium = makePrivate();

class Chromium {

  constructor(options) {
    const privy = privateChromium(this);

    if (!options) options = {};
    privy.profileDirectory = options.profileDirectory || createTemporaryProfileDirectory;
    privy.userDataDirectory = options.userDataDirectory || createTemporaryUserDataDirectory;
    privy.extensions = options.extensions || [];
    privy.messaging = new Map(
      (options.messaging || []).map((name) => [name, new MessagingChannel(this)])
    );
    privy.flags = options.flags || {};

    privy.child = null;
    privy.spawned = false;
    privy.cancelSpawn = false;
    privy.toCleanup = [];
  }

  messaging(name) {
    return privateChromium(this).messaging.get(name);
  }

  spawn() {
    const privy = privateChromium(this);

    return PromiseUtil.run(function* () {
      if (privy.spawned) throw new Error("Already spawned");
      privy.spawned = true;

      try {
        const userData = yield installUserDataDirectory(privy.userDataDirectory);
        addCleanup(this, userData);
        const profile = yield installProfileDirectory(userData.path, privy.profileDirectory);
        addCleanup(this, profile);
        const preferences = yield installPreferences(profile.path);
        addCleanup(this, preferences);

        for (const extension of privy.extensions) {
          yield installExtension(preferences.data, extension);
        }

        const extensionIds = Object.keys(preferences.data.extensions.settings);
        for (const entry of privy.messaging) {
          const name = entry[0];
          const channel = entry[1];

          addCleanup(this,
            yield installMessaging(userData.path, name, extensionIds, channel)
          );
        }

        yield writeFile(preferences.path, JSON.stringify(preferences.data));

        if (privy.cancelSpawn) throw new Error("Killed before spawning");

        privy.child = yield spawnChromium(Object.assign({}, privy.flags, {
          userDataDir: userData.path,
          profileDirectory: profile.name,
        }));
      }
      catch (e) {
        cleanup(this);
        throw e;
      }
    }.bind(this));
  }

  kill() {
    const privy = privateChromium(this);

    if (!privy.spawned) throw new Error("Not spawned");

    return PromiseUtil.run(function* () {
      if (privy.child) {
        yield privy.child.asyncKill();
      }
      else {
        privy.cancelSpawn = true;
      }
      cleanup(this);
    }.bind(this));
  }

  spawnWith(fn) {
    return PromiseUtil.run(function* () {
      let result;
      try {
        yield this.spawn();
        result = yield fn(this);
      }
      finally {
        yield this.kill();
      }
      return result;
    }.bind(this));
  }

}

module.exports = Chromium;
