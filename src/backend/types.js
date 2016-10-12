import t from 'tcomb';

const URL = t.String;
const ID = t.String;

const StringDict = t.dict(t.String, t.String);

const MediaItem = t.struct({
  url: URL,
  id: ID,
  title: t.String,
  icon: t.maybe(t.String),
  vlc: t.maybe(StringDict)
});

const Source = t.struct({
  name: t.String,
  id: ID,
  items: t.list(MediaItem),
  info: t.maybe(StringDict)
});

const AddEvent = t.struct({
  type: t.subtype(t.String, (s) => s === 'ADD'),
  targets: t.list(Source)
});

const RemoveEvent = t.struct({
  type: t.subtype(t.String, (s) => s === 'REMOVE'),
  targets: t.list(t.String)
});

const _Type = t.irreducible('Type', t.isType);

const check = t.func([_Type, t.Any], t.Bool).of((type, x) => {
  // if(type.meta.kin === 'irreducible') return type.is(x);
  let result;
  try {
    type(x);
    result = true;
  } catch (e) {
    result = false;
  }
  return result;
});

export default {
  check,
  URL,
  StringDict,
  MediaItem,
  Source,
  AddEvent,
  RemoveEvent
};
