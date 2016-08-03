const fso = require("fso");
const webpack = require('webpack');
const webpack_config = require('./webpack.config');

const node_dir = ".";

const node_root = fso.new("./node");
const src = fso.new("./src");
src.mkpathSync();

const bootstrap_node = node_root.new("lib/internal/bootstrap_node.js").readFileSync({encoding: "utf8"});
const native_module = bootstrap_node
  .match(/(function NativeModule[\s\S]+)(?=startup\(\))/)[1]
  .replace(/(NativeModule\._source) = process\.binding.*;/, "$1 = {};")
  .replace(/(NativeModule\.exists = function\(id\) {)[^}]*(};)/, "$1return require('browserfs').BFSRequire(id) != null;$2")
  .replace(/(NativeModule\.prototype\.compile = function\(\) {)[^]*?(};)/, "$1this.exports = require('browserfs').BFSRequire(this.id);$2")
  .replace(/process\.moduleLoadList/m, "[]")
  .replace(/process\.execArgv/m, "[]")
  .replace(/\bprocess\b/g, "require('browserfs').BFSRequire('process')")
  .replace(/(NativeModule\.wrapper\[0\])/, "'var process = ' + function(){return require('browserfs').BFSRequire('process')}.toString() + '();\\n' + $1")
  + "module.exports = NativeModule;";

src.new("native_module.js").writeFileSync(native_module);

const module_js = "const BrowserFS = require('browserfs');\n"
  + "require('core-js/fn/string/starts-with');\n"
  + node_root.new("lib/module.js").readFileSync({encoding: "utf8"})
  .replace(/'native_module'/, "'./native_module'")
  .replace(/'util'/, "'./util'")
  .replace(/'internal\/util'/, "'./util'")
  .replace(/'internal\/module'/, "'./internal/module'")
  .replace(/process.binding\('fs'\)/g, "require('./binding_fs')")
  .replace(/require\('(fs|path)'\)/g, "BrowserFS.BFSRequire('$1')")
  .replace(/\[path.resolve\(process.execPath.*\]/m, "['.']")
  .replace(/\bprocess\b/g, "require('browserfs').BFSRequire('process')")
  .replace(/const preserveSymlinks.*/, "const preserveSymlinks = true;");
src.new("module.js").writeFileSync(module_js);

const internal_module = node_root.new("lib/internal/module.js").readFileSync({encoding: "utf8"})
  .replace(/^.*mainModule.*$/m, "// $&");
src.new("internal").mkpathSync();
src.new("internal/module.js").writeFileSync(internal_module);

const util = `
module.exports.deprecate = function() {};
module.exports.printDeprecationMessage = function() {};
module.exports.debuglog = function() {
  return function() {};
};
`;
src.new("util.js").writeFileSync(util);

const binding_fs = `
var BrowserFS = require('browserfs');
var fs = BrowserFS.BFSRequire('fs');
module.exports.internalModuleReadFile = function(...args) {
  return fs.readFileSync(...args);
};
module.exports.internalModuleStat = function(file) {
  try {
    var stats = fs.statSync(file);
    return stats.isFile() ? 0 : 1;
  } catch (error) {
    return -1;
  }
};
`;
src.new("binding_fs.js").writeFileSync(binding_fs);

webpack(webpack_config, (error, stats) => {
  if (error) console.error(error);
  console.log(stats.toString());
});
