import fuzzy from 'fuzzy';
import R from 'ramda';
import germany from './channels/germany.js';

function search (q) {
  if (q.length === 0) return [];
  const extract = (e) => e.displayName;
  const result = fuzzy
    .filter(q.join(' '), channels, {extract})
    .map(R.prop('original'));

  if (result.length > 0) return result;

  return search(q.slice(0, -1));
}

function normalize (s) {
  return s
    .toLowerCase()
    .split(/[_\s, -./\\]+/);
}

function parse (channel, key) {
  return {
    id: key,
    displayName: channel.displayName.sv,
    icon: channel.icon
  };
}

const getChannels = R.compose(
    R.values,
    R.mapObjIndexed(parse),
    R.prop('channels'),
    R.prop('jsontv')
);

var channels = getChannels(germany);

function searchChannel (q) {
  q = normalize(q);
  const result = search(q);

  return result;
}

export default searchChannel;
