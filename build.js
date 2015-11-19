#!/usr/bin/env node
require('shelljs/global');
var program = require('commander');

var legalPlatforms = ['osx', 'linux'];
var envVar = {
  osx: {
    'NW_VERSION': '0.12.3',
    'NW_PLATFORM': 'osx64',
    'WCJS_PLATFORM':'osx',
    'WCJS_ARCH':'x64'
  },
  linux: {
    'NW_VERSION': '0.12.3',
    'NW_PLATFORM': 'linux64',
    'WCJS_PLATFORM':'linux',
    'WCJS_ARCH':'x64'
  }
}

var getVar = (v) => envVar[platform][v];
var getEnv = (v) => v + '=' + getVar(v);

function die(msg) {
  console.log('PANIC: ', msg);
  exit(-1);
}

function sync(target, destination, exclude) {
  exclude = exclude || ['node_modules'];
  var toClean = ls(destination).filter((f) => exclude.indexOf(f) === -1 );
  toClean.forEach((f) => rm('-r', destination + f));
  cp('-R', target, destination);
}

program
  .version('0.0.1')
  .option('-P, --pack', 'pack step')
  .option('-p, --platform [p]', 'dd')
  .option('-f, --force', 'false')
  .parse(process.argv);

var platform = process.platform;
var force = program.force || false;
var packStep = program.pack || false;

if(program.platform) platform = program.platform;
if(platform === 'darwin') platform = 'osx';

if(legalPlatforms.indexOf(platform) === -1)
  die('platform "' + platform + '" not supported');

console.log('Platform: ', platform);
console.log('Force: ', force);

mkdir('-p', 'out/work/node');

sync('src/node/*', 'out/work/node');
cd('out/work/node');

if (force) rm('-rf', 'node_modules');
exec(getEnv('WCJS_ARCH') + ' ' + getEnv('WCJS_PLATFORM') + ' npm install');
cd('../../../');

console.log('build browser bundle...');
exec('./node_modules/.bin/browserify src/browser.js -t babelify --s app --outfile out/work/bundle.js');

if(!packStep) exit();
console.log('build app bundle...');
exec('./node_modules/.bin/nwbuild -v ' + getVar('NW_VERSION') + ' -p ' + getVar('NW_PLATFORM') + ' -o out out/work');
