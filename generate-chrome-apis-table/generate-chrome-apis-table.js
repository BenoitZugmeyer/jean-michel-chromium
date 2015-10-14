#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const request = require("./request");
const url = require("url");
const cheerio = require("cheerio");

cheerio.prototype[Symbol.iterator] = function () {
  let index = 0;
  const next = () => {
    const result = index < this.length ?
      { done: false, value: this[index] } :
      { done: true };
    index += 1;
    return result;
  };
  return { next, [Symbol.iterator]() { return this; } };
};


const makeAbsoluteLinks = ($node, base) => {
  for (const a of $node.find("a[href]")) {
    const $a = cheerio(a);
    $a.attr("href", url.resolve(base, $a.attr("href")));
  }
};

const getEntries = (url) => {
  return request(url)
  .then(request.readAsBuffer)
  .then(cheerio.load)
  .then(function* ($) {
    for (const entry of $('#stable_apis + p table tr + tr')) {
      const $children = $(entry).children("td");
      makeAbsoluteLinks($children, url);
      yield {
        href: $children.eq(0).find("a").attr("href"),
        title: $children.eq(0).text(),
        description: $children.eq(1).html().trim(),
        version: Number($children.eq(2).text()),
      };
    }
  });
};

const apis = [
  {
    url: "https://developer.chrome.com/apps/api_index",
    title: "Apps",
  },
  {
    url: "https://developer.chrome.com/extensions/api_index",
    title: "Extensions",
  },
];


const stream = fs.createWriteStream(path.join(__dirname, "..", "chrome-apis-table.md"));

Promise.all(apis.map((api) => getEntries(api.url)))
.then((entries) => {
  stream.write("# Chromium API table");

  const items = entries.map((e) => e.next().value);

  stream.write("| Name |");
  for (const api of apis) stream.write(` ${api.title} |`);
  stream.write(" Description |\n");

  stream.write("| ---- |");
  for (const _ of apis) stream.write(` :---: |`); // eslint-disable-line no-unused-vars
  stream.write("---- |\n");

  while (items.some((i) => i)) {
    let min;
    for (const item of items) if (item && (!min || item.title < min.title)) min = item;

    stream.write(`| [${min.title}](${min.href}) |`);
    items.forEach((item, i) => {
      if (item && item.title === min.title) {
        stream.write(` ${item.version} |`);
        items[i] = entries[i].next().value;
      }
      else {
        stream.write("  |");
      }
    });

    stream.write(` ${min.description} |`);
    stream.write("\n");
  }
})
.catch((error) => process.stderr.write(error.stack));
