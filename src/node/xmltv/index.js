var fuzzy = require('fuzzy');
var R = require("ramda");

var m = function(o) {
  return {
    id: o[0],
    displayName: o[1].displayName.sv,
    icon: o[1].icon
  }
}
var getChannels = R.compose(
    R.map(m),
    function(o) { return R.zip(R.keys(o), R.values(o)); },
    R.prop('channels'),
    R.prop('jsontv')
);

var extract = function(e) {
  return e.displayName;
};

var search = function(q) {
  return fuzzy
    .filter(q, channels, {extract})
    .map(R.prop('original'));
};

function searchR(q) {
  if (q.length === 0) return [];
  var result = search(q.join(' '));
  if(result.length > 0) return result;
  return searchR(q.slice(0, -1));
}

var germany = require('./channels/germany.json');
var channels = getChannels(germany);

function searchChannel(q) {
  q = q.split(' ');
  return searchR(q);
}


module.exports = {
  searchChannel
}
