"use strict";
/*eslint no-console: 0*/

const jmc = require("../..");
const path = require("path");

const wait = (delay) =>
  new Promise((resolve) => setTimeout(() => resolve(), delay))

// Spawn a chromium instance with a custom extension installed, wait 10 seconds then quit.

const messaging = new jmc.MessagingChannel("foo.bar");
messaging.on("connection", (port) => {
  port.on("message", (message) => {
    console.log(`Message from extension: ${message}`);
  });
  port.post("coucou");
});

new jmc.Chromium({
  extensions: [
    {
      path: path.join(__dirname, "extension"),
      location: 4,
    },
  ],
  messaging: [ messaging ],
})
.spawnWith(() => {
  return wait(1000)
})
.then(() => console.log("Success!"))
.catch((error) => console.error(error.stack));
