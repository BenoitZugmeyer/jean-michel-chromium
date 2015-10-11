#!/usr/bin/env node
"use strict";

const net = require("net");
const path = require("path");

const printErr = (s) => process.stderr.write(s + "\n");

process.on("uncaughtException", (e) => {
  printErr(`Uncaught exception: ${e.stack}`);
  process.exit(1);
});

const basename = path.basename(process.argv[1], ".js")
const sockPath = path.join(path.dirname(process.argv[1]), `${basename}.sock`);

const client = net.connect(sockPath);

client.on("error", (error) => {
  printErr(`${error}`);
  process.exit(1);
});

client.pipe(process.stdout);
process.stdin.pipe(client);
