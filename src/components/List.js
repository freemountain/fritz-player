const React = require('react');
const Morearty = require('morearty');
const R = require('ramda');

const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');
const Avatar = require('material-ui/lib/avatar');
// const Colors = require('material-ui/lib/styles/colors');

function stringCompare(a, b) {
  if(a < b) return -1;
  if(a > b) return 1;
  return 0;
}

function itemCompare(a, b) {
  return stringCompare(
    a.title.toLowerCase(),
    b.title.toLowerCase()
  );
}

function createAvatar(item) {
  if(item.icon) return <Avatar src={item.icon} />;

  var title = item.title
    .split(/[\s, -./\\]+/)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase());

  return (<Avatar>{title}</Avatar>);
}

function createListItem(clickHandler, item) {
  return <ListItem
    key={item.id}
    leftAvatar= {createAvatar(item)}
    onClick={() => clickHandler(item.id)}
    primaryText={item.title}
    secondaryText={item.secondaryText}
  />;
}

function createSubList(source, nestedItems) {
  return <ListItem
    key={source.id}
    primaryText={source.name}
    initiallyOpen={false}
    leftAvatar={<Avatar>A</Avatar>}
    nestedItems={nestedItems}
  />;
}

var Bar = React.createClass({
  mixins: [Morearty.Mixin],

  render: function() {
    var binding = this.getDefaultBinding();
    var sourcesBinding = binding.sub('sources');

    var onClick = this.props.onItemClick;
    // var clickHandler = onClick ? (i) => onClick(i) : () => true;
    var _createListItem = R.curry(createListItem)(onClick);

    var sources = sourcesBinding.get().map(function(source) {
      var nested = source.items
        .slice() // copy, because source is immutable
        .sort(itemCompare)
        .map(_createListItem);

      return createSubList(source, nested);
    });

    var style = {
      height: '100%',
      overflow: 'scroll'
      // paddingBottom: '60px',
    };

    return (
      <List style={style}>
        { sources }
      </List>
    );
  }
});

module.exports = Bar;
