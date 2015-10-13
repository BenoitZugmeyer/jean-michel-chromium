"use strict";
/*eslint no-console: 0*/

const jmc = require("../..");
const path = require("path");

// Spawn a chromium instance, post a message on the "foo.bar" channel, print the response then exit.

const messaging = new jmc.MessagingChannel("foo.bar");

messaging.on("connection", (port) => {
  port.on("message", (message) => {
    console.log(`Message from extension: ${message}`);
    chromium.kill();
  });
  port.post("coucou");
});

const chromium = new jmc.Chromium({
  extensions: [
    {
      path: path.join(__dirname, "extension"),
      location: 4,
    },
  ],
  messaging: [ messaging ],
});

chromium.spawn()
.catch((error) => console.error(error.stack));
