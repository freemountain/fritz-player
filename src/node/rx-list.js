var Immutable = require('immutable');
var t = require('tcomb');
const Rx = require('rx');

var Type = t.irreducible('Type', t.isType);

function getSubType(type, prop) {
  if(prop.length === 0) return type;
  if(type.meta.kind !== 'struct') return null;
  var nextType = type.meta.props[prop[0]];
  if(t.Nil.is(nextType)) return null;
  return getSubType(nextType, prop.slice(1));
}

function createInitialState(stateType) {
  if(stateType.meta.kind === 'list') return Immutable.List();
  if(stateType.meta.kind === 'irreducible') return null;
  if(stateType.meta.kind === 'enums') return null;

  var result = {};
  var props = Object.keys(stateType.meta.props);

  props.forEach(function(prop) {
    var t = stateType.meta.props[prop];
    result[prop] = createInitialState(t);
  });

  return Immutable.Map(result);
}

function _set(state, target, value) {
  if(target.length === 1) return state.set(target[0], value);
  var nextState = state.get(target[0]);
  var nextTarget = target.slice(1)
  var val = _set(nextState, nextTarget, value);
  return state.set(target[0], val);
}

function _get(state, target) {
  var nextState = state.get(target[0]);
  if(target.length === 1) return nextState;
  return _get(nextState, target.slice(1));
}

var operators = {
  '$set': function(state, target, value) {
    return _set(state, target, value);
  },
  '$push': function(state, target, value) {
    var list = _get(state, target);
    return _set(state, target, list.push(value))
  },
  '$filter': function(state, target, value) {
    console.log('$filter not implemented');
    return state;
  }
};

var guards = {
  '$set': function(stateType, target, value) {
    var targetType = getSubType(stateType, target);
    if(targetType === null) return false;
    return check(targetType, value);
  },
  '$push': function(stateType, target, value) {
    var targetType = getSubType(stateType, target);
    if(targetType === null) return false;
    if(targetType.meta.kind !== 'list') return false;
    return check(targetType.meta.type, value);
  },
  '$filter': function(stateType, target, value) {
    var targetType = getSubType(stateType, target);
    if(targetType === null) return false;
    return targetType.meta.kind === 'list';
  }
};

var check = t.func([Type, t.Any], t.Bool).of(function(type, x) {
  var result;
  try{
    type(x);
    result = true;
  } catch(e) {
    result = false;
  }
  return result;
});

function rxState(stateType, observable) {
  if(stateType.meta.kind !== 'struct')
    throw new Error('stateType needs to be struct');

  var error = function(e) {
    console.log('rx-list error: ', e.stack || e);
  };

  var state = createInitialState(stateType);

  observable
    .subscribe(function(item) {
      var target = item[0].split('.');
      var operator = item[1];
      var value = item[2];

      if(!operators[operator])
        return error('invalid operator '+operator);

      if(!guards[operator](stateType, target, value))
        return error('guard failed');

      state = operators[operator](state, target, value)
    });

  return () => state;
}

function rxActions(actions, observable) {
  var dispatcher = new Rx.Subject();

  dispatcher.subscribe(function(item) {
    actions.forEach((action) => action(observable, item));
  });

  return dispatcher;
};

function rxFlux(actions, State) {
  var bus = new Rx.Subject();
  var state = rxState(State, bus);
  var dispatcher = rxActions(actions, bus);

  return {
    dispatcher,
    state
  }
}

function createAction(name, handler) {
  return function(observable, item) {
    if(item[0] !== name) return false;
    handler(observable, item[1]);
  };
}

module.exports = rxFlux;
module.exports.createAction = createAction;
