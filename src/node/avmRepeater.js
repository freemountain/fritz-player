var Client = require('node-ssdp').Client;
var utils = require('./utils');
var url = require('url');
var parse = require('./m3uParser.js');
var request = require('request-promise');

function find(t) {
  var client = new Client();
  var defered = utils.defer();

  var timer = setTimeout(function() {
    defered.reject();
  }, t);

  client.on('response', function (headers, statusCode, rinfo) {
    client._stop();
    clearTimeout(timer);
    var host = url.parse(headers.LOCATION).hostname;
    defered.resolve(host);
  });

  client.search('urn:ses-com:service:satip:1');

  return defered.promise;
};

function getPlaylist(t) {
  return find(t)
    .then(function(h) {
      var url = 'http://' + h + '/dvb/m3u/';
      return Promise.all([
        request(url + 'tvhd.m3u'),
        request(url + 'tvsd.m3u')
      ]);
    })
    .then(function(res) {
      return []
        .concat(parse(res[0]))
        .concat(parse(res[1]));
    });
}

module.exports = {
  find,
  getPlaylist
};
