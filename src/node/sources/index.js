var R = require("ramda");

var sources = {};

sources.fritz = require('./fritz');
sources.or = require('./or-germany');


function get() {
  var r = R.values(sources).map(function(f) {
    return f();
  });
  return Promise.all(r).then(function(result) {
    var concat = function(a, r) {
      return a.concat(r);
    };
    return R.reduce(concat, [], result);
  });
}

module.exports = {
  get: get
};


/*get().then(function(r) {
  console.log(JSON.stringify(r, null, ' '));
});*/
