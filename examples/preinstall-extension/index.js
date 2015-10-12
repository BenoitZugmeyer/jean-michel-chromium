"use strict";
/*eslint no-console: 0*/

const Chromium = require("../../src/chromium");
const run = require("../../src/promise-util").run;
const path = require("path");

const wait = (delay) =>
  new Promise((resolve) => setTimeout(() => resolve(), delay))

run(function* () {
  console.log("Creating a temporary user data directory...");
  const userData = yield Chromium.createTemporaryUserDataDirectory();
  let chromium;

  try {
    console.log("Creating the default profile...");
    const profilePath = yield Chromium.createProfile(userData.path, "Default");

    console.log("Installing the extension...");
    yield Chromium.installExtension(
      profilePath,
      {
        path: path.join(__dirname, "extension"),
        location: 4,
      }
    );

    console.log("Spawning chromium...");
    chromium = yield Chromium.spawnChromium({
      userDataDir: userData.path,
      profileDirectory: "Default",
      noFirstRun: true,
    });

    console.log("Waiting 10 seconds...");
    yield wait(10000);
  }
  finally {
    console.log("Closing...");
    if (chromium) yield chromium.asyncKill();
    userData.cleanup();
  }
})
.then(() => console.log("Closed"))
.catch((error) => console.error(error.stack));
