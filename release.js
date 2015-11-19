require('shelljs/global');

var envVar = {
  'osx': {}
};
mkdir('-p', 'out/s/');
cp('-R', 'build/*', 'out/s/build');
cp('./package.json', 'out/s/package.json');
