const Rx = require('rx');

function defer() {
  var reject, resolve;
  var promise = new Promise(function(res, rej) {
    reject = rej;
    resolve = res;
  });

  return {
    promise: promise,
    reject: reject,
    resolve: resolve
  };
}

function getIpcSubject(channel, ipc) {
  var ipcOut = Rx.Observer.create(x => ipc.send(channel, x));
  var ipcIn = Rx.Observable.create(function(observer) {
    ipc.on(channel, (event, arg) => observer.onNext(arg));
  });
  return Rx.Subject.create(ipcOut, ipcIn);
}

module.exports = {
  defer,
  getIpcSubject
};
