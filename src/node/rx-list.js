var Immutable = require('immutable');
function stateFactory(type) {
  if(type === 'list') return Immutable.List();
  if(type === 'map') return Immutable.Map();

  throw new Error('rx-list: unkonwn type: ', type);
}

function handlerFactory(state, type) {
  if(type === 'list') return (state, item) => state.push(item);
  if(type === 'map') return (state, item) => state.set(item[0], item[1]);

  throw new Error('rx-list: unkonwn type: ', type);
}


module.exports = function(observable, name, type) {
  var state = stateFactory(type);
  var handler = handlerFactory(state, type);

  observable
    .filter(item => item[0] === name)
    .map(item => item[1])
    .subscribe(function(item) {
      state = handler(state, item);
    });

  return function value() {
    return state;
  }
}
