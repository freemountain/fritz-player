#!/usr/bin/env node
require('shelljs/global');

var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var watchify = require('watchify');
var Watcher = require('file-watch');

var bundle = () => b.bundle().pipe(fs.createWriteStream('out/dev/bundle.js'));

var runApp = () => exec('./node_modules/.bin/electron out/dev/electron.js', function(code, output) {
  console.log('App exit code:', code);
  exit(-1);
});

function registerWatcher(watcher, file, handler) {
  watcher.watch(file, [file]);
  watcher.on(file, handler);
}

function createSyncHandler(src, dest) {
  return function() {
    rm(dest);
    cp(src, dest);
  }
}

function sync(src, dest, init) {
  var handler =  createSyncHandler(src, dest);
  registerWatcher(watcher, src, handler);
  if(init === false) return;
  handler();
}

var watcher = new Watcher();
var start = false;

var b = browserify({
  debug: true,
  entries: ['src/browser.js'],
  cache: {},
  packageCache: {},
  plugin: [watchify],
  standalone: 'app'
}).transform('babelify', {sourceMaps: true});

if(start) b.once('log', () => runApp() );

b.on('update', bundle)
  .on("log", (msg) => console.log(msg) )
  .on("error", (err) => console.log("Error: " + err.message) )
  .on('transform', function(tr, file) {
   tr.on('error', (e) => console.log(e.toString()))
});

mkdir('-p', 'out/dev/');

sync('nw_package.json', 'out/dev/package.json');
sync('src/index.html', 'out/dev/index.html');
sync('src/electron.js', 'out/dev/electron.js');
sync('src/backend.js', 'out/dev/backend.js');

ln('-sf', __dirname + '/src/node', 'out/dev/node');

exec('touch out/dev/bundle.js');

bundle(); // start
