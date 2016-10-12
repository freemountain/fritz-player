import utils from './../utils';
import relatedUUID from 'related-uuid';
import xmltv from './../xmltv';
import Types from './../types';

const id = 'foo-bar-b593-9979-daa39s8jcb7d';
const name = 'OR Germany';

const items = [
  {
    'url': 'http://daserste_live-lh.akamaihd.net/i/daserste_de@91204/master.m3u8',
    'title': 'Das Erste',
    'id': relatedUUID(id, 'Das Erste')
  },
  {
    'url': 'http://zdf_hds_dach-f.akamaihd.net/i/dach10_v1@87031/master.m3u8',
    'title': 'ZDF',
    'id': relatedUUID(id, 'ZDF')
  },
  {
    'url': 'rtmp://pssimn24livefs.fplive.net/pssimn24live-live/_definst_/stream1',
    'title': 'N24',
    'id': relatedUUID(id, 'N24')
  }
];

export default () => {
  const defer = utils.defer();
  const source = {
    id,
    name,
    items: items.map(item => {
      const data = xmltv(item.title);
      const icon = (data[0]) ? data[0].icon : undefined;

      const result = Types.MediaItem({
        id: item.id,
        url: item.url,
        title: item.title,
        vlc: item.vlc,
        icon
      });

      return result;
    })
  };
  defer.resolve([source]);
  return defer.promise;
};
