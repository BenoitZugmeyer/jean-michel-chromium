const fs = require("fs");
const tmp = require("tmp");
tmp.setGracefulCleanup();
const PromiseUtil= require("./promise-util");
const pkg = require("../package.json");

const _createTemporaryDirectory = PromiseUtil.wrapCPS(tmp.dir, { multi: ["path", "cleanup"] });
const fileExists = PromiseUtil.wrapCPS(fs.exists, { noError: true });
const readFile = PromiseUtil.wrapCPS(fs.readFile);
const writeFile = PromiseUtil.wrapCPS(fs.writeFile);
const symlink = PromiseUtil.wrapCPS(fs.symlink);
const mkdir = PromiseUtil.wrapCPS(fs.mkdir);

const temporaryDirectoryPrefix = `${pkg.name}-${process.pid}-`;

const createTemporaryDirectory = (options) => {
  if (!options) options = {};
  options.unsafeCleanup = true;
  options.prefix = temporaryDirectoryPrefix + (options.prefix || "");
  return _createTemporaryDirectory(options);
};

module.exports = {
  createTemporaryDirectory,
  fileExists,
  readFile,
  writeFile,
  symlink,
  mkdir,
};
