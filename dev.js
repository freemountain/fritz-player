#!/usr/bin/env node
require('shelljs/global');

var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var watchify = require('watchify');

var Watcher = require('file-watch')

var b = browserify({
  entries: ['src/browser.js'],
  cache: {},
  packageCache: {},
  plugin: [watchify],
  standalone: 'app'
}).transform(babelify);

var bundle = () => b.bundle().pipe(fs.createWriteStream('out/dev/bundle.js'));

var runNW = () => exec('./node_modules/.bin/nw out/dev', function(code, output) {
  console.log('NW exit code:', code);
  exit(-1);
});

b.on('update', bundle)
  .once('log', () => runNW() )
  .on("log", (msg) => console.log(msg) )
  .on("error", (err) => console.log("Error: " + err.message) )
  .on('transform', function(tr, file) {
   tr.on('error', (e) => console.log(e.toString()))
 });


var watcher = new Watcher();

var onPackage = function () {
  rm('out/dev/package.json');
  cp('nw_package.json', 'out/dev/package.json');
};

var onIndex = function () {
  rm('out/dev/index.html');
  cp('src/index.html', 'out/dev/index.html');
};

watcher.watch('package', ['nw_package.json']);
watcher.watch('index', ['src/index.html']);
watcher.on('package', onPackage);
watcher.on('index', onIndex);

mkdir('-p', 'out/dev/');

onIndex();
onPackage();
ln('-sf', __dirname + '/src/node', 'out/dev/node');
exec('touch out/dev/bundle.js');
bundle(); // muss aufgerufen werden!!
