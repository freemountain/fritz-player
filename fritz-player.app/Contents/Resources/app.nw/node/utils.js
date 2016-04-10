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

module.exports = {
  defer
}
