var Client = require('node-ssdp').Client;
var utils = require('./../utils');
var url = require('url');
var parse = require('./../m3uParser');
var request = require('request-promise');
var xmltv = require('./../xmltv');
var R = require('ramda');

const Types = require('./../types');

var relatedUUID = require('related-uuid');

// BSP: uuid:663d5d6c-f9f8-4bb4-84d4-3431C48B3AB3::urn:ses-com:service:satip:1
var parseUSN = function(s) {
  return s
    .split('::')[0]
    .split(':')[1];
};

function findBox(t) {
  var client = new Client();
  var defered = utils.defer();

  var timer = setTimeout(function() {
    defered.reject('No box found!');
  }, t);

  client.on('response', function(headers, statusCode, rinfo) {
    client._stop();
    clearTimeout(timer);

    var uuid = parseUSN(headers.USN);
    var _url = url.parse(headers.LOCATION);

    defered.resolve({
      uuid,
      name: headers.SERVER.slice(0, 20),
      url: _url
    });
  });

  client.search('urn:ses-com:service:satip:1');

  return defered.promise;
}

function getSources(t) {
  var box;
  return findBox(t)
    .then(function(b) {
      box = b;
      var url = 'http://' + box.url.hostname + '/dvb/m3u/';
      return Promise.all([
        request(url + 'tvhd.m3u'),
        request(url + 'tvsd.m3u')
      ]);
    })
    .then(function(res) {
      var list = []
        .concat(parse(res[0]))
        .concat(parse(res[1]));
      return [{
        items: list,
        id: box.uuid,
        name: box.name,
        info: {
          url: box.url.href
        }
      }];
    });
}

function parseSource(source) {
  source.items = source.items.map(parseItem(source.uuid));
  return Types.Source(source);
}

var parseItem = R.curry(function(sourceId, item) {
  var data = xmltv(item.title);

  var result = Types.MediaItem({
    id: relatedUUID(sourceId, item.title),
    url: item.url,
    title: item.title,
    vlc: item.vlc,
    icon: (data[0] && data[0].icon) ? data[0].icon : undefined
  });

  return result;
});

module.exports = function() {
  return getSources(2000)
    .then((result) => result.map(parseSource));
};
