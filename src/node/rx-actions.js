var Immutable = require('immutable');
var t = require('tcomb');
const Rx = require('rx');

function createAction(name, handler) {
  return function(observable, item) {
    if(item[0] !== name) return false;
    handler(observable, item[1]);
  };
}

var rxActions = function(actions, observable) {
  var result = new Rx.Subject();

  result.subscribe(function(item) {
    actions.forEach((action) => action(observable, item));
  });

  return result;
};

rxActions.createAction = createAction;

module.exports = rxActions
