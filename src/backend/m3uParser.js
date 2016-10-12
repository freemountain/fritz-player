function parseItem (i) {
  const result = {};

  function parseEXT (l) {
    const token = l.slice(8).split(',');
    result.length = token[0];
    result.title = token[1];
  }

  function parseVLC (l) {
    if (!result.vlc) result.vlc = {};
    const token = l.slice(11).split('=');
    result.vlc[token[0]] = token[1];
  }

  result.url = i.pop(); // last line is source;

  i.forEach(l => {
    if (l.startsWith('#EXTINF:')) parseEXT(l);
    if (l.startsWith('#EXTVLCOPT:')) parseVLC(l);
  });

  return result;
}

function parse (f) {
  const items = [];
  let current = [];
  const lines = f.split('\n');
  let l;
  const extended = lines[0] === '#EXTM3U';

  lines.pop(); // last line is empty

  if (!extended) {
    return lines.map(l => ({url: l}));
  }

  lines.shift(); // remove header line

  while (lines.length > 0) {
    l = lines.shift();
    current.push(l);
    if (l.startsWith('#')) continue;
    items.push(current);
    current = [];
  }

  return items.map(parseItem);
}
export default parse;
