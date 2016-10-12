import { Client } from 'node-ssdp';
import utils from './../utils';
import url from 'url';
import parse from './../m3uParser';
import request from 'request-promise';

import xmltv from './../xmltv';

import R from 'ramda';

import Types from './../types';
import relatedUUID from 'related-uuid';

// BSP: uuid:663d5d6c-f9f8-4bb4-84d4-3431C48B3AB3::urn:ses-com:service:satip:1
const parseUSN = s => s
  .split('::')[0]
  .split(':')[1];

function findBox (t) {
  const client = new Client();
  const defered = utils.defer();

  const timer = setTimeout(() => {
    defered.reject('No box found!');
  }, t);

  client.on('response', (headers, statusCode, rinfo) => {
    client._stop();
    clearTimeout(timer);

    const uuid = parseUSN(headers.USN);
    const _url = url.parse(headers.LOCATION);

    defered.resolve({
      uuid,
      name: headers.SERVER.slice(0, 20),
      url: _url
    });
  });

  client.search('urn:ses-com:service:satip:1');

  return defered.promise;
}

function getSources (t) {
  let box;
  return findBox(t)
    .then(b => {
      box = b;
      const url = `http://${box.url.hostname}/dvb/m3u/`;
      return Promise.all([
        request(`${url}tvhd.m3u`),
        request(`${url}tvsd.m3u`)
      ]);
    })
    .then(res => {
      const list = []
        .concat(parse(res[0]))
        .concat(parse(res[1]))
        .filter(i => i.title !== '.');
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

function parseSource (source) {
  source.items = source.items.map(parseItem(source.uuid));
  return Types.Source(source);
}

var parseItem = R.curry((sourceId, item) => {
  const data = xmltv(item.title);
  const result = Types.MediaItem({
    id: relatedUUID(sourceId, item.title),
    url: item.url,
    title: item.title,
    vlc: item.vlc,
    icon: (data[0] && data[0].icon) ? data[0].icon : undefined
  });

  return result;
});

export default () => getSources(2000)
  .then((result) => result.map(parseSource));
