#!/usr/bin/env node

require('shelljs/global');
config.verbose = true;
const spawn = require('child-process-promise').spawn;
const path = require('path');
const packager = require('electron-packager');

function run (cmd, arg) {
  let _arg = arg || [];

  if (typeof arg === 'string') _arg = [arg];

  const promise = spawn(cmd, _arg);
  const child = promise.childProcess;

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  return promise;
}

function runBackground (cmd, arg) {
  run(cmd, arg);

  return new Promise(resolve => resolve());
}

function npmInstall (dir) {
  pushd(dir);

  return run('npm', 'install').then(() => popd());
}

function setUp (dir) {
  mkdir(dir);

  cp('src/index.html', path.join(dir, 'index.html'));
  cp('src/package.json', path.join(dir, 'package.json'));

  return new Promise(resolve => resolve());
}

function transpileSrc (input, output, watch) {
  const cmd = 'node_modules/.bin/babel';
  const arg = ['--plugins', 'transform-react-jsx',
  '--presets', 'es2015-node6',
  '--ignore', 'node_modules',
  '--source-maps', 'true',
  '--out-dir', output];

  return run(cmd, arg.concat(input))
    .then(() => {
      if (watch === true) return runBackground(cmd, arg.concat(['--watch', input]));
    });
}

function runElectron (dir) {
  return run('node_modules/.bin/electron', dir)
    .then(() => process.exit(0));
}

function copyDir (src, dest, force) {
  if (test('-d', dest) && !force) return new Promise(resolve => resolve());

  rm('-rf', dest);

  cp('-R', src, dest);

  return new Promise(resolve => resolve());
}

function packApp () {
  const options = {
    dir: './build',
    name: 'fritz',
    platform: 'darwin',
    arch: 'x64',
    out: './releases/',
    overwrite: true,
    prune: false,
    asar: false,
    version: '1.4.0'
  };

  return new Promise((resolve, reject) => {
    packager(options, function (err, appPaths) {
      if (err) return reject(err);

      resolve(appPaths);
    });
  });
}

if (process.argv[2] === 'dev') {
  setUp('build')
    .then(() => copyDir('node_modules/wcjs-prebuilt/bin/', 'build/wcjs'))
    .then(() => npmInstall('build'))
    .then(() => transpileSrc('src', 'build', true))
    .then(() => runElectron('build'))
    .catch(e => console.error(e));
}

if (process.argv[2] === 'build') {
  setUp('build')
    .then(() => npmInstall('build'))
    .then(() => transpileSrc('src', 'build'))
    .then(() => packApp())
    .then((out) => {
      if (process.platform !== 'darwin') return;

      const dest = path.join(__dirname, out[0], 'fritz.app/Contents/Resources/app/wcjs/');
      return copyDir('node_modules/wcjs-prebuilt/bin/', dest, true);
    })
    .catch(e => console.error(e));
}
