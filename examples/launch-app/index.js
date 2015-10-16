"use strict";
/*eslint no-console: 0*/

const Chromium = require("../..").Chromium;
const path = require("path");

new Chromium({
  flags: {
    loadAndLaunchApp: path.join(__dirname, "app"),
    silentLaunch: true,
  },
})
.spawn()
.then(() => console.log("Spawned!"))
.catch((error) => console.error(error.stack));
