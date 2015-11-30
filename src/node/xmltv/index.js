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
    (o) => R.zip(R.keys(o), R.values(o)),
    R.prop('channels'),
    R.prop('jsontv')
);

var extract = (e) => e.displayName;

var germany = require('./channels/germany.json');
var channels = getChannels(germany);

function searchChannel(q) {
  return fuzzy.filter(q, channels, {extract});
}


module.exports = {
  searchChannel
}
