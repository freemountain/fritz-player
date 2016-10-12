// import Rx from 'rx';

function defer () {
  let _reject;
  let _resolve;
  const promise = new Promise((resolve, reject) => {
    _reject = reject;
    _resolve = resolve;
  });

  return {
    promise,
    reject: _reject,
    resolve: _resolve
  };
}
/*
function getIpcSubject(channel, ipc) {
  const ipcOut = Rx.Observer.create(x => ipc.send(channel, x));
  const ipcIn = Rx.Observable.create(observer => {
    ipc.on(channel, (event, arg) => observer.onNext(arg));
  });
  return Rx.Subject.create(ipcOut, ipcIn);
}
*/
export default {
  defer
  // getIpcSubject
};
