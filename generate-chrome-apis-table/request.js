"use strict";

const url = require("url");
const http = require("http");
const https = require("https");
const zlib = require("zlib");

const prepareOptions = (rawOptions) => {
  let options;
  if (typeof rawOptions === "string") {
    options = url.parse(rawOptions);
  }
  else if (rawOptions && typeof rawOptions === "object") {
    if (typeof rawOptions.url === "string") {
      options = Object.assign(url.parse(rawOptions.url), rawOptions);
      delete options.url;
    }
    else {
      options = rawOptions;
    }
  }
  else {
    throw new Error("Invalid options argument");
  }

  return options;
};

const request = (rawOptions) => {
  return new Promise((resolve, reject) => {
    const options = prepareOptions(rawOptions);
    const module = options.protocol === "https:" || options.protocol === "https" ? https : http;

    const requestInstance = module.request(options);
    requestInstance.options = options;
    requestInstance.on("error", reject);
    requestInstance.on("response", (response) => {
      // Not sure response.url = url.format(options);
      resolve(response);
    });

    if (options.withClientRequest) {
      Promise.resolve(options.withClientRequest(requestInstance)).then(
        () => requestInstance.end(),
        (error) => {
          requestInstance.abort();
          reject(error);
        });
    }
    else {
      requestInstance.end();
    }

  });
};

const incomingMessageProperties = [
  "httpVersion",
  "headers",
  "rawHeaders",
  "trailers",
  "rawTrailers",
  "setTimeout",
  "method",
  "url",
  "statusCode",
  "statusMessage",
  "socket",
  "req",
];

const pipeIncomingMessage = (message, writable) => {
  if (!writable) return message;

  const readable = message.pipe(writable);

  incomingMessageProperties.forEach((prop) => {
    const value = message[prop];
    readable[prop] = typeof value === "function" ? value.bind(message) : value;
  });

  return readable;
};

const uncompressors = new Map([
  ["deflate", zlib.createInflate],
  ["gzip", zlib.createGunzip],
  ["zip", zlib.createUnzip],
]);

const uncompress = (response) => {
  const createUncompressor = uncompressors.get(response.headers["content-encoding"]);
  return createUncompressor ? pipeIncomingMessage(response, createUncompressor()) : response;
};

const followRedirections = (max) => {
  if (max instanceof http.IncomingMessage) return followRedirections()(max);

  if (max === undefined) max = 10;

  return (response) => {
    if (response.headers.location &&
        response.statusCode >= 300 &&
        response.statusCode < 400) {

      if (max <= 0) throw new Error("Followed max redirections");

      return request({
        url: url.resolve(response.req.options, response.headers.location),
        headers: response.req.headers,
        method: response.req.method,
      })
      .then(followRedirections(max - 1));
    }
    return response;
  };
};

const StreamUtil = require("../src/stream-util");

module.exports = Object.assign(request, {
  request,
  uncompress,
  followRedirections,
  readAsBuffer: StreamUtil.readAsBuffer,
});

// request({
//   url: "http://httpbin.org/post",
//   method: "POST",
//   withClientRequest(request) {
//     process.stdin.pipe(request);
//     return StreamUtil.withStream(process.stdin);
//   },
// })
// .then(followRedirections)
// .then(uncompress)
// .then(StreamUtil.readAsBuffer)
// .then(JSON.parse)
// .then((body) => console.log(body))
// .catch((error) => console.log(error.stack));
