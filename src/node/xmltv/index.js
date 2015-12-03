var fuzzy = require('fuzzy');
var R = require("ramda");

var germany = require('./channels/germany.json');

var parse = function(channel, key) {
  return {
    id: key,
    displayName: channel.displayName.sv,
    icon: channel.icon
  }
};

var getChannels = R.compose(
    R.values,
    R.mapObjIndexed(parse),
    R.prop('channels'),
    R.prop('jsontv')
);

var extract = function(e) {
  return e.displayName;
};

function search(q) {
  if (q.length === 0) return [];

  var result = fuzzy
    .filter(q.join(' '), channels, {extract})
    .map(R.prop('original'));

  if(result.length > 0) return result;

  return search(q.slice(0, -1));
}


var channels = getChannels(germany);

function searchChannel(q) {
  q = q.split(' ');
  return search(q);
}


module.exports = {
  searchChannel
}
