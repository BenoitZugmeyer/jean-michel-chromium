"use strict";
/*eslint no-console: 0*/

const Chromium = require("../src/chromium");
const wrapRun = require("../src/promise-util").wrapRun;
const path = require("path");

// Run chromium in a temporary user data directory
const runAnonymousProfile = (fn) =>

  // Create a temporary user data directory
  Chromium.withTemporaryUserDataDirectory(wrapRun(function* (userDataDirectory) {

    // Create a default profile
    const profileDirectory = yield Chromium.createProfile(userDataDirectory, "Default");

    // Install a custom extension
    yield Chromium.installExtension(
      profileDirectory,
      {
        path: path.join(__dirname, "extension"),
        location: 4,
      }
    );

    // Spawn chromium
    yield Chromium.withChromium({
      userDataDir: userDataDirectory,
      profileDirectory: "Default",
      noFirstRun: true,
    }, fn);

  }));

const wait = (delay) =>
  new Promise((resolve) => setTimeout(() => resolve(), delay))

// Run chromium, wait 10 seconds then quit
runAnonymousProfile(() => wait(10000))
.then((result) => console.log('RESULT', result))
.catch((error) => console.error(error.stack));
