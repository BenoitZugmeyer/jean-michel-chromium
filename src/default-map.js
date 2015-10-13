"use strict";

const make = (base) => {
  return class extends base {

    constructor(factory, iterable) {
      if (typeof factory !== "function") throw new Error("Factory is not a function");
      super(iterable);
      Object.defineProperty(this, "factory", { value: factory })
    }

    get(key) {
      if (!this.has(key)) this.set(key, this.factory(key));
      return super.get(key);
    }

  };
};

module.exports = {
  DefaultMap: make(Map),
  DefaultWeakMap: make(WeakMap),
};
