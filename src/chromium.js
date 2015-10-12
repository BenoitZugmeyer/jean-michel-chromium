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

const installExtension = wrapRun(function* (profilePath, settings) {
  const preferencesPath = path.join(profilePath, "Preferences");
  const preferences = (yield fileExists(preferencesPath)) ?
    yield readFile(preferencesPath).then(JSON.parse) :
    {};

  if (!preferences.extensions) preferences.extensions = {};
  if (!preferences.extensions.settings) preferences.extensions.settings = {};
  preferences.extensions.settings[computeExtensionId(settings.path)] = settings;
  yield writeFile(preferencesPath, JSON.stringify(preferences));
});


const installMessaging = wrapRun(function* (userDataDirectory, name, allowedExtensions) {
  const pipeioPath = path.join(userDataDirectory, `${name}_pipeio.js`)
  const sockPath = path.join(userDataDirectory, `${name}_pipeio.sock`);
  const hostsPath = path.join(userDataDirectory, "NativeMessagingHosts");
  const manifestPath = path.join(hostsPath, name + ".json");

  if (!(yield fileExists(hostsPath))) yield mkdir(hostsPath);

  if (!(yield fileExists(manifestPath))) {
    yield symlink(path.join(__dirname, "..", "pipeio", "pipeio.js"), pipeioPath);
    const manifest = {
      name,
      description: `${pkg.name} messaging channel for ${name}`,
      path: pipeioPath,
      type: "stdio",
      allowed_origins: allowedExtensions.map((ext) => `chrome-extension://${computeExtensionId(ext)}/`),
    }
    yield writeFile(manifestPath, JSON.stringify(manifest));
  }

  return new MessagingChannel(sockPath);
});

const createProfile = wrapRun(function* (userDataDirectory, name) {
  const profileDirectory = path.join(userDataDirectory, name);
  yield mkdir(profileDirectory);
  return profileDirectory;
});

module.exports = {
  createTemporaryUserDataDirectory,
  spawnChromium,
  installExtension,
  installMessaging,
  createProfile,
};
