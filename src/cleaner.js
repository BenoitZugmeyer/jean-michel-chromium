"use strict";

const DefaultWeakMap = require("./default-map").DefaultWeakMap;
const makePrivate = require("./make-private");

const privateCleaner = makePrivate();

module.exports = class Cleaner {

  constructor() {
    privateCleaner(this).map = new DefaultWeakMap(() => []);
  }

  add(instance, fn) {
    privateCleaner(this).map.get(instance).unshift(fn);
  }

  clean(instance) {
    const list = privateCleaner(this).map.get(instance);
    for (const fn of list) {
      if (typeof fn === "function") fn();
      else if (typeof fn.cleanup === "function") fn.cleanup();
    }
    list.length = 0;
  }

}
