var Client = require('node-ssdp').Client;
var utils = require('./../utils');
var url = require('url');
var parse = require('./../m3uParser');
var request = require('request-promise');
var xmltv = require('./../xmltv');
var R = require("ramda");
var relatedUUID = require('related-uuid');

//BSP: uuid:663d5d6c-f9f8-4bb4-84d4-3431C48B3AB3::urn:ses-com:service:satip:1
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

  client.on('response', function (headers, statusCode, rinfo) {
    client._stop();
    clearTimeout(timer);

    var uuid = parseUSN(headers.USN);
    var _url = url.parse(headers.LOCATION);

    defered.resolve({
      uuid,
      name: headers.SERVER.slice(0,20),
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
      var list =  []
        .concat(parse(res[0]))
        .concat(parse(res[1]));
      return [{
        items: list,
        id : box.uuid,
        name : box.name,
        info: {
          url: box.url.href
        }
      }];
    });
}

var f = function() {
  return getSources(2000).then(function(result) {
    return result.map(function(source) {
      source.items =  source.items.map(map(source.uuid));
      return source;
    });
  });
};

module.exports = f;

var filter = function(s) {
  return /\w|\s/g.test(s);
};

var normalize = function(s) {
  return s
    .toLowerCase()
    .split(/[_\s, -./\\]+/)
    //.filter(filter)
    .join(' ');
};

var map = R.curry(function(sourceId, item) {
  var q = normalize(item.title);
  var data = xmltv.searchChannel(q);
  item.id = relatedUUID(sourceId, item.title);
  if(data.length === 0) return item;
  if(data[0].icon) item.icon = data[0].icon;
  return item;
});
