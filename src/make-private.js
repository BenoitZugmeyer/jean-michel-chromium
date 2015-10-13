"use strict";

const DefaultWeakMap = require("./default-map").DefaultWeakMap;

module.exports = () => {
  const storage = new DefaultWeakMap(() => ({}));
  return (v) => storage.get(v);
};
