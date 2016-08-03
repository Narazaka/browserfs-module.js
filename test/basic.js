import * as BrowserFS from 'browserfs';
const fsBase = new BrowserFS.FileSystem.InMemory();
BrowserFS.initialize(fsBase);
const Module = require('../browserfs-module.js');

const fs = BrowserFS.BFSRequire('fs');
// for browserfsModule.Module
fs.writeFileSync('/a.js' ,'module.exports = function() {return require("b")()};');
fs.mkdirSync('/node_modules');
fs.writeFileSync('/node_modules/b.js' ,'module.exports = function() {return "bb"};');
// for require("fs")
fs.writeFileSync('/fs_test.js' ,'var fs = require("fs"); module.exports = function() {return fs.readFileSync("./file", {encoding: "utf8"})};');
fs.writeFileSync('/file' ,'file content');
// for process
fs.writeFileSync('/process_test.js' ,'module.exports = function() {return process};');

import assert from 'power-assert';

describe('browserfsModule.Module', function() {
  subject(function() { return Module._load("/a") });
  it('works', function() { assert(this.subject() === "bb") });
});

describe('require("fs")', function() {
  subject(function() { return Module._load("/fs_test") });
  it('works', function() { assert(this.subject() === "file content") });
});

describe('process', function() {
  subject(function() { return Module._load("/process_test") });
  it('works', function() { assert(this.subject().platform === 'browser') });
});
