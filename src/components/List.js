var React = require('react');
var Morearty = require('morearty');

const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');
const ListDivider = require('material-ui/lib/lists/list-divider');
var Paper = require('material-ui/lib/paper');
const FontIcon = require('material-ui/lib/font-icon');
const Avatar = require('material-ui/lib/avatar');
const IconButton = require('material-ui/lib/icon-button');
const Colors = require('material-ui/lib/styles/colors');


var Bar = React.createClass({
  mixins: [Morearty.Mixin],

  onItemClick: function(k) {
    if(this.props.onItemClick) this.props.onItemClick(k);
  },

  render: function() {
    var binding = this.getDefaultBinding();
    var stationsBinding = binding.sub('stations');
    var sourcesBinding = binding.sub('sources');

    var createAvatar = function(item) {
      if(item.icon)
        return <Avatar src={item.icon} backgroundColor="blue" color="red"/>;
      var title = item.title
        .split(/[\s, -./\\]+/)
        .slice(0,2)
        .map( (s) => s[0].toUpperCase());
      return <Avatar>{title}</Avatar>
    }

    var itemRenderer = function(item) {
      var love = <IconButton iconClassName="fa fa-heart-o" style={{color:Colors.red900}} />;
      return <ListItem
        key={item.id}
        rightIconButton= {love}
        leftAvatar= {createAvatar(item)}
        onClick={() => this.onItemClick(item.id)}
        primaryText={item.title}
        secondaryText={item.secondaryText}
        />;
    }.bind(this);

    var sources = sourcesBinding.get().map(function(source) {
      var nested = source.list
      .sort(function(a, b){
            if(a.title < b.title) return -1;
            if(a.title > b.title) return 1;
            return 0;
        })
        .map(itemRenderer);
        var icon = <Avatar>A</Avatar>;


      return <ListItem
        key={source.uuid}
        primaryText={source.name}
        initiallyOpen={true}
        leftAvatar={<Avatar>A</Avatar>}
        nestedItems={nested}
        />
    }.bind(this));

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
