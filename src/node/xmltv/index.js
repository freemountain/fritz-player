var fuzzy = require('fuzzy');
var R = require("ramda");

var germany = require('./channels/germany.json');

function search(q) {
  if (q.length === 0) return [];
  var extract = (e) => e.displayName;
  var result = fuzzy
    .filter(q.join(' '), channels, {extract})
    .map(R.prop('original'));

  if(result.length > 0) return result;

  return search(q.slice(0, -1));
}

function normalize(s) {
  return s
    .toLowerCase()
    .split(/[_\s, -./\\]+/);
}

function parse(channel, key) {
  return {
    id: key,
    displayName: channel.displayName.sv,
    icon: channel.icon
  }
}

var getChannels = R.compose(
    R.values,
    R.mapObjIndexed(parse),
    R.prop('channels'),
    R.prop('jsontv')
);

var channels = getChannels(germany);

function searchChannel(q) {
  q = normalize(q);
  var result =  search(q);

  return result;
}


module.exports = searchChannel;
