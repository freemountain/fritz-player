var t = require('tcomb');

var URL = t.String;
var ID = t.String;

var StringDict = t.dict(t.String, t.String);

var MediaItem = t.struct({
  url: URL,
  id: ID,
  title: t.String,
  icon: t.maybe(t.String),
  vlc: t.maybe(StringDict)
});

var Source = t.struct({
  name: t.String,
  id: ID,
  items: t.list(MediaItem),
  info: t.maybe(StringDict)
});

module.exports = {
  URL: URL,
  StringDict: StringDict,
  MediaItem: MediaItem,
  Source: Source
};
