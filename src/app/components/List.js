import React from 'react';
import Morearty from 'morearty';
import R from 'ramda';
import { List, Avatar, ListItem } from 'material-ui';

function stringCompare (a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function itemCompare (a, b) {
  return stringCompare(
    a.title.toLowerCase(),
    b.title.toLowerCase()
  );
}

function createAvatar (item) {
  if (item.icon) return <Avatar src={item.icon} />;

  const title = item.title
    .split(/[\s, -./\\]+/)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase());

  return (<Avatar>{title}</Avatar>);
}

function createListItem (clickHandler, item) {
  return <ListItem
    key={item.id}
    leftAvatar={createAvatar(item)}
    onClick={() => clickHandler(item.id)}
    primaryText={item.title}
    secondaryText={item.secondaryText}
  />;
}

function createSubList (source, nestedItems) {
  return <ListItem
    key={source.id}
    primaryText={source.name}
    initiallyOpen={false}
    leftAvatar={<Avatar>A</Avatar>}
    nestedItems={nestedItems}
  />;
}

const Bar = React.createClass({
  mixins: [Morearty.Mixin],
  propTypes: {
    onItemClick: React.PropTypes.func
  },
  render () {
    const binding = this.getDefaultBinding();
    const sourcesBinding = binding.sub('sources');

    const onClick = this.props.onItemClick;
    const _createListItem = R.curry(createListItem)(onClick);

    const sources = sourcesBinding.get().map(source => {
      const nested = source.items
        .slice() // copy, because source is immutable
        .sort(itemCompare)
        .map(_createListItem);

      return createSubList(source, nested);
    });

    const style = {
      height: '97%',
      overflow: 'scroll'
    };

    return (
      <List style={style}>
        { sources }
      </List>
    );
  }
});

export default Bar;
