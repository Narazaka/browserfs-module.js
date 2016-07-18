import * as BrowserFS from 'browserfs';
const fsBase = new BrowserFS.FileSystem.InMemory();
BrowserFS.initialize(fsBase);
const Module = require('../browserfs-module.js');

import assert from 'power-assert';

/** @test {GhostKernel} */
describe('browserfsModule.Module', function() {
  before(function() {
    // BrowserFS.initialize(this.fs);
    const fs = BrowserFS.BFSRequire('fs');
    fs.writeFileSync('/a.js' ,'module.exports = function() {return require("b")()};');
    fs.mkdirSync('/node_modules');
    fs.writeFileSync('/node_modules/b.js' ,'module.exports = function() {return "bb"};');
  });
  lazy('fs', function() { return new BrowserFS.FileSystem.InMemory() });
  subject(function() { return Module._load("/a") });
  /** @test {GhostKernel#constructor} */
  context('_load', function() {
    it('basic', function() { assert(this.subject() === "bb") });
  });
});
