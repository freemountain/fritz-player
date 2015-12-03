const React = require('react');
const Morearty = require('morearty');
const R = require('ramda');

const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');
const Paper = require('material-ui/lib/paper');
const Avatar = require('material-ui/lib/avatar');
const Colors = require('material-ui/lib/styles/colors');

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
    .slice(0,2)
    .map( (s) => s[0].toUpperCase() );

  return <Avatar>{title}</Avatar>
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
    initiallyOpen={true}
    leftAvatar={<Avatar>A</Avatar>}
    nestedItems={nestedItems}
  />;
}

var Bar = React.createClass({
  mixins: [Morearty.Mixin],

  render: function() {
    var binding = this.getDefaultBinding();
    var stationsBinding = binding.sub('stations');
    var sourcesBinding = binding.sub('sources');

    var onClick = this.props.onItemClick;
    var clickHandler = onClick ? (i) => onClick(i) : () => true;
    var _createListItem = R.curry(createListItem)(onClick);

    var sources = sourcesBinding.get().map(function(source) {
      var nested = source.items
        .sort(itemCompare)
        .map(_createListItem);

      return createSubList(source, nested);
    });

    //https://css-tricks.com/centering-percentage-widthheight-elements/
    var style = {
      position:'absolute',
      transform: 'translate(0, -50%)',
      width: 300,
      height: '94%',
      left: '2%',
      top: '50%',
      overflow:'scroll'
    };


    return (
      <Paper zDepth={3} style={style}>
        <List>
          { sources }
        </List>
      </Paper>
    );
  }
});

module.exports = Bar;
