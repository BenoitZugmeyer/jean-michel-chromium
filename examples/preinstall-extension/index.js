"use strict";
/*eslint no-console: 0*/

const Chromium = require("../..").Chromium;
const path = require("path");

const wait = (delay) =>
  new Promise((resolve) => setTimeout(() => resolve(), delay))

// Spawn a chromium instance with a custom extension installed, wait 10 seconds then quit.

new Chromium({
  extensions: [
    {
      path: path.join(__dirname, "extension"),
      location: 4,
    },
  ],
})
.spawnWith(() => wait(10000))
.then(() => console.log("Success!"))
.catch((error) => console.error(error.stack));
