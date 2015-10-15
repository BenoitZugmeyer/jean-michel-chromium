#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const request = require("./request");
const url = require("url");
const cheerio = require("cheerio");

const apis = [
  {
    url: "https://developer.chrome.com/apps/api_index",
    title: "Apps",
    permissions: "https://developer.chrome.com/apps/declare_permissions",
  },
  {
    url: "https://developer.chrome.com/extensions/api_index",
    title: "Extensions",
    permissions: "https://developer.chrome.com/extensions/declare_permissions",
  },
];

const printErr = (s) => process.stderr.write(`${s}\n`);
const print = (s) => process.stdout.write(`${s}\n`);


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


const getPage = (url) => {
  print(`Download start ${url}`);
  return request(url)
  .then(request.followRedirections)
  .then((response) => {
    if (response.statusCode !== 200) throw Error(`Download failed with status ${response.statusCode}`);
    return response;
  })
  .then(request.readAsBuffer)
  .then((buffer) => {
    print(`Download done  ${url}`);
    return buffer;
  })
  .then((buffer) => {
    const $ = cheerio.load(buffer, {
      normalizeWhitespace: true,
    });
    makeAbsoluteLinks($("body"), url);
    $("span.code").each((i, span) => {
      span.name = "code";
      span.attribs = {};
    });
    $.url = url;
    return $;
  })
};


const parseAPIEntries = ($) => {
  return Promise.all($('#stable_apis + p table tr + tr').toArray().map((entry) => {
    return getPage($(entry).find("a").first().attr("href")).then(parseAPIEntry);
  }));
};

const parseAPIEntry = ($) => {
  const $intro = $("#intro");
  const getIntro = (name) => {
    return ($intro.find(`.title:contains('${name}')`).next().html() || "").trim();
  };

  return {
    href: $.url,
    title: $("h1").first().text(),
    description: getIntro("Description"),
    availability: getIntro("Availability").replace(/Since Chrome (\d+)\./, '$1'),
    permissions: getIntro("Permissions"),
    manifest: getIntro("Manifest"),
    caution: $(".api .caution").text().trim(),
  };
};

const writeTableHeader = (stream) => {
  stream.write("# Chromium APIs table\n\n");

  stream.write("| Name |");
  for (const api of apis) stream.write(` ${api.title} |`);
  stream.write(" Permission | Description |\n");

  stream.write("| ---- |");
  for (const _ of apis) stream.write(` :---: |`); // eslint-disable-line no-unused-vars
  stream.write(" ----- | ---- |\n");
};

const iterateItems = function* (entries) {
  entries = entries.map((e) => e[Symbol.iterator]());

  const items = entries.map((e) => e.next().value);

  while (items.some((i) => i)) {
    let min;
    for (const item of items) if (item && (!min || item.title < min.title)) min = item;

    yield {
      min,
      items: items.map((item, i) => {
        if (item && item.title === min.title) {
          items[i] = entries[i].next().value;
          return item;
        }
      }),
    };
  }
};

const getAPIEntries = (url) => getPage(url).then(parseAPIEntries);


const stream = fs.createWriteStream(path.join(__dirname, "..", "chrome-apis-table.md"));

Promise.all(apis.map((api) => getAPIEntries(api.url)))
.then((entries) => {
  writeTableHeader(stream);

  for (const i of iterateItems(entries)) {
    const min = i.min;
    stream.write(`| [${min.title}](${min.href}) |`);

    i.items.forEach((item) => {
      if (item) {
        stream.write(` ${item.availability} |`);
      }
      else {
        stream.write("  |");
      }
    });

    if (min.permissions && min.manifest) throw new Error(`API ${min.title} have both manifest and permission`);

    if (min.permissions) {
      stream.write(` ${min.permissions} |`);
    }
    else if (min.manifest) {
      stream.write(` ${min.manifest} (manifest) |`);
    }
    else {
      stream.write("  |");
    }

    stream.write(` ${min.description} `);

    if (min.caution) {
      stream.write(` **${min.caution}** `);
    }

    stream.write("|\n");
  }
})
.catch((error) => printErr(error.stack));
