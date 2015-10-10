"use strict";

const child_process = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const tmp = require("tmp");
tmp.setGracefulCleanup();

const pkg = require("../package.json");
const PromiseUtil= require("./promise-util");
const wrapRun = PromiseUtil.wrapRun;
const which = PromiseUtil.wrapCPS(require("which"));

const makeTemporaryDirectory = PromiseUtil.wrapCPS(tmp.dir, { multi: ["path", "cleanup"] });
const fileExists = PromiseUtil.wrapCPS(fs.exists, { noError: true });
const readFile = PromiseUtil.wrapCPS(fs.readFile);
const writeFile = PromiseUtil.wrapCPS(fs.writeFile);
const mkdir = PromiseUtil.wrapCPS(fs.mkdir);

const withTemporaryDirectory = wrapRun(function* (options, fn) {
  const result = yield makeTemporaryDirectory(options);
  try {
    return yield fn(result.path);
  }
  finally {
    result.cleanup();
  }
});

const withTemporaryUserDataDirectory = (fn) =>
  withTemporaryDirectory({ prefix: `${pkg.name}-UserData-`, unsafeCleanup: true }, fn);

const withSpawn = (bin, args, options, fn) =>
  new Promise((resolve, reject) => {
    const child = child_process.spawn(bin, args, options);
    let isAlive = true;
    let onKilled;
    const whenKilled = (action) =>
      (result) => {
        if (!isAlive) {
          action(result);
        }
        else {
          onKilled = () => action(result);
          child.kill();
        }
      };

    child.on("exit", () => {
      isAlive = false;
      if (onKilled) onKilled();
    });

    PromiseUtil.castPromise(fn(child))
    .then(whenKilled(resolve), whenKilled(reject));
  });


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

const withChromium = wrapRun(function* (flags, fn) {
  return withSpawn(yield getDefaultBinaryPath(), flagsToArgs(flags), {}, fn);
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

const createProfile = wrapRun(function* (userDataDirectory, name) {
  const profileDirectory = path.join(userDataDirectory, name);
  yield mkdir(profileDirectory);
  return profileDirectory;
});

module.exports = {
  withTemporaryUserDataDirectory,
  withChromium,
  installExtension,
  createProfile,
};
