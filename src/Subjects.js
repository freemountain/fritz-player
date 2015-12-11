const Rx = require('rx');

module.exports = function() {
  const subjects = {};

  return function(name) {
    if(!subjects[name]) subjects[name] = new Rx.Subject();
    return subjects[name];
  };
};
