'use strict';

const EventEmitter = require('./node/EventEmitter');
const util = require('util');
var R = require("ramda");

function Backend() {
  EventEmitter.call(this);
  this.sources = {};
  this.sources.fritz = require('./node/sources/fritz');
  this.sources.or = require('./node/sources/or-germany');
  //this._promiseLoad();
}
util.inherits(Backend, EventEmitter);

Backend.prototype._promiseLoad = function() {
  var r = R.values(this.sources).map(function(f) {
    return f()
      .catch(function(e) {
        console.log('GET Sources error: ', e);
        return [];
      })
  });

  Promise.all(r).then(function(result) {
    var concat = (a, r) => a.concat(r);
    var r =  R.reduce(concat, [], result);

    this.emit('sources', {
      type: 'add',
      sources: r
    });
  }.bind(this));
};

//var b = new Backend();

module.exports = Backend;
