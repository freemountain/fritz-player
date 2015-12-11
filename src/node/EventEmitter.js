'use strict';

const _EventEmitter = require('events');

function EventEmitter() {
  this._emiter = new _EventEmitter();
}

EventEmitter.prototype.on = function() {
  this._emiter.on.apply(this._emiter, arguments);
};

EventEmitter.prototype.emit = function(event, arg) {
  this._emiter.emit(event, arg);
  if(!this._onEmit) return;
  this._onEmit(event, arg);
};

EventEmitter.prototype.inject = function(event, arg) {
  this._emiter.emit(event, arg);
};

module.exports = EventEmitter;
