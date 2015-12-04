var utils = require('./../utils');
var relatedUUID = require('related-uuid');
var xmltv = require('./../xmltv');

const Types = require('./../types/Source');

var id = 'foo-bar-b593-9979-daa39s8jcb7d';
var name = 'OR Germany';

var items = [
  {
    "url": "http://daserste_live-lh.akamaihd.net/i/daserste_de@91204/master.m3u8",
    "title": "Das Erste",
    "id": relatedUUID(id, 'Das Erste')
  },
  {
    "url": "http://zdf_hds_dach-f.akamaihd.net/i/dach10_v1@87031/master.m3u8",
    "title": "ZDF",
    "id": relatedUUID(id, 'ZDF')
  },
  {
    "url": "rtmp://pssimn24livefs.fplive.net/pssimn24live-live/_definst_/stream1",
    "title": "N24",
    "id": relatedUUID(id, 'N24')
  }
];



module.exports = function() {
  var defer = utils.defer();
  var source = {
    id,
    name,
    items: items.map(function(item) {
      var data = xmltv(item.title);
      var icon = (data[0]) ? data[0].icon : undefined;

      var result =  Types.MediaItem({
        id: item.id,
        url: item.url,
        title: item.title,
        vlc: item.vlc,
        icon: icon
      });

      return result;
    })
  };
  defer.resolve([source]);
  return defer.promise;
};
