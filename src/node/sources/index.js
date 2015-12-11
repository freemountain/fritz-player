var R = require('ramda');

var sources = {};

sources.fritz = require('./fritz');
sources.or = require('./or-germany');

function get() {
  var r = R.values(sources).map(function(f) {
    return f()
      .catch(function(e) {
        console.log('GET Sources error: ', e);
        return [];
      });
  });

  return Promise.all(r).then(function(result) {
    var concat = function(a, r) {
      return a.concat(r);
    };
    var r = R.reduce(concat, [], result);
    return r;
  }).catch(function(e) {

  });
}

module.exports = {
  get: get
};
