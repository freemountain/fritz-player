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

var AddEvent = t.struct({
  type: t.subtype(t.String, (s) => s === 'ADD'),
  targets: t.list(Source)
});

var RemoveEvent = t.struct({
  type: t.subtype(t.String, (s) => s === 'REMOVE'),
  targets: t.list(t.String)
});

var _Type = t.irreducible('Type', t.isType);

var check = t.func([_Type, t.Any], t.Bool).of(function(type, x) {
  // if(type.meta.kin === 'irreducible') return type.is(x);
  var result;
  try{
    type(x);
    result = true;
  } catch(e) {
    result = false;
  }
  return result;
});

module.exports = {
  check,
  URL: URL,
  StringDict: StringDict,
  MediaItem: MediaItem,
  Source: Source,
  AddEvent,
  RemoveEvent
};
