"use strict";

const privateInstances = new WeakMap();

const makePrivate = (Class) => {

  const PublicClass = function () {
    const args = Array.from(arguments);
    args.unshift(null);
    const privateInstance = new (Class.bind.apply(Class, args))();
    Object.defineProperty(privateInstance, "public", { value: this });
    privateInstances.set(this, privateInstance);
  };

  const wrapMethod = (fn) => {
    return function () {
      return fn.apply(privateInstances.get(this), arguments);
    };
  };

  Object.setPrototypeOf(PublicClass.prototype, Object.getPrototypeOf(Class.prototype));

  for (const name of Object.getOwnPropertyNames(Class.prototype)) {
    if (!name.startsWith("_")) {
      const descriptor = Object.getOwnPropertyDescriptor(Class.prototype, name);
      if (descriptor.value) descriptor.value = wrapMethod(descriptor.value);
      if (descriptor.get) descriptor.get = wrapMethod(descriptor.get)
      if (descriptor.set) descriptor.set = wrapMethod(descriptor.set)
      Object.defineProperty(PublicClass.prototype, name, descriptor);
    }
  }

  return PublicClass;
};

module.exports = makePrivate;

if (process.env.NODE_ENV === "test") {

  const assert = require("assert");

  class Base {
    baseFn() {
      return 42;
    }
  }

  class Foo extends Base {

    constructor(value) {
      super();
      this.value = value;
    }

    _increment() {
      this.value += 1;
    }

    getIncrementedValue() {
      this._increment();
      return this.value;
    }

    getPublic() {
      return this.public;
    }

    get v() {
      return this.value;
    }

    set v(v) {
      this.value = v;
    }

  }

  Foo = makePrivate(Foo);

  const foo = new Foo(10);

  assert(foo._increment === undefined);
  assert(foo.value === undefined);
  assert(foo.public === undefined);
  assert(foo.getIncrementedValue() === 11);
  assert(foo.getPublic() === foo);
  assert(foo.v === 11);
  foo.v = 12;
  assert(foo.getIncrementedValue() === 13);
  assert(foo instanceof Foo);
  assert(foo instanceof Base);
  assert(foo.baseFn() === 42);

  console.log("test passed"); // eslint-disable-line no-console

}
