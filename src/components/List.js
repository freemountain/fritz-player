var React = require('react');
var Morearty = require('morearty');

const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');
var Paper = require('material-ui/lib/paper');

var Bar = React.createClass({
  mixins: [Morearty.Mixin],

  onItemClick: function(k) {
    console.log('klicked', k);
    if(this.props.onItemClick) this.props.onItemClick(k);
  },

  itemRenderer: function(item, index) {
    return <ListItem
      onClick={() => this.onItemClick(index)}
      primaryText={item.title}
      secondaryText={item.secondaryText}
      />;
  },

  render: function() {
    var binding = this.getDefaultBinding();
    var stationsBinding = binding.sub('stations');
    var stations = stationsBinding.get();

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
          { stations.map(this.itemRenderer).toArray() }
        </List>
      </Paper>
    );
  }
});

module.exports = Bar;
