const util = require('util');
var R = require('ramda');
var Types = require('./node/types');
const Rx = require('rx');

function load(sources, out) {
  var r = R.values(sources).map(function(f) {
    return f()
      .catch(function(e) {
        console.log('GET Sources error: ', e);
        return [];
      });
  });

  Promise.all(r).then(function(result) {
    var concat = (a, r) => a.concat(r);
    var copy = (x) => R.mapObj( v => v, x);

    var getItems = (source) =>source.items.map(function(item) {
      var i = copy(item);
      i.source = source.id;
      return i;
    });

    var mapSource = function(source) {
      var s = copy(source);
      delete s.items;
      return ['sources', [s.id, s]];
    };

    var mapItem = (item) => ['items', [item.id, item]];

    var sources = R.reduce(concat, [], result);
    var items = R.reduce((a, source) => concat(a, getItems(source)), [], sources);

    sources.forEach((s) => out.onNext(mapSource(s)));
    items.forEach((i) => out.onNext(mapItem(i)));

  }).catch((e) => console.log(e.stack));
}

module.exports = function() {
  var backend = new Rx.Subject();
  var sources = {};
  sources.fritz = require('./node/sources/fritz');
  sources.or = require('./node/sources/or-germany');
  setTimeout(()=> load(sources, backend), 500);

  return backend;
};
