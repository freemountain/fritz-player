var utils = require('./../utils');
var relatedUUID = require('related-uuid');

var uuid = 'bc22b9a1-28f9-b593-9979-daa39d4ccb7d';
var source = {
  uuid: uuid,
  name: 'OR Germany',
  list: [
    {
      "url": "http://daserste_live-lh.akamaihd.net/i/daserste_de@91204/master.m3u8",
      "length": "-1",
      "title": "Das Erste",
      "id": relatedUUID(uuid, 'Das Erste')
    },
    {
      "url": "http://zdf_hds_dach-f.akamaihd.net/i/dach10_v1@87031/master.m3u8",
      "length": "-1",
      "title": "ZDF",
      "id": relatedUUID(uuid, 'ZDF')
    },
    {
      "url": "rtmp://pssimn24livefs.fplive.net/pssimn24live-live/_definst_/stream1",
      "length": "-1",
      "title": "N24",
      "id": relatedUUID(uuid, 'N24')
    }
  ]
}
module.exports = function() {
  var defer = utils.defer();
  defer.resolve([source]);
  return defer.promise;
};
