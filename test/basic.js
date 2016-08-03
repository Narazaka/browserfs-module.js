import * as BrowserFS from 'browserfs';
const fsBase = new BrowserFS.FileSystem.InMemory();
BrowserFS.initialize(fsBase);
const Module = require('../browserfs-module.js');

import assert from 'power-assert';

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
  context('_load', function() {
    it('basic', function() { assert(this.subject() === "bb") });
  });
});

describe('require("fs")', function() {
  before(function() {
    // BrowserFS.initialize(this.fs);
    const fs = BrowserFS.BFSRequire('fs');
    fs.writeFileSync('/c.js' ,'var fs = require("fs"); module.exports = function() {return fs.readFileSync("./file", {encoding: "utf8"})};');
    fs.writeFileSync('/file' ,'file content');
  });
  lazy('fs', function() { return new BrowserFS.FileSystem.InMemory() });
  subject(function() { return Module._load("/c") });
  context('_load', function() {
    it('basic', function() { assert(this.subject() === "file content") });
  });
});
