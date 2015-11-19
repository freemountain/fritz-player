var Morearty = require('morearty');

var React = require('react');
var Radium = require('radium');
var FontAwesome = require('react-fontawesome');

var Control = React.createClass({
  mixins: [Morearty.Mixin],

  tooglePlay: function() {
    var binding = this.getDefaultBinding();
    binding.set('player.play', !binding.get('player.play'));
  },

  toogleFullscreen: function() {
    var binding = this.getDefaultBinding();
    binding.set('fullscreen', !binding.get('fullscreen'));
  },

  render: function() {
    var binding = this.getDefaultBinding();

    var style = {
      height: 50,
      fontSize: '2em',
      borderTop: '3px solid black',
      padding: 8,
    };

    var pauseStyle = {
      marginRight:8,
      color: binding.get('player.play') ? 'white' : '#555'
    }

    var fullscreenStyle = {
      color: !binding.get('fullscreen') ? 'white' : '#555'
    }

    return (
      <div style={style}>
        <FontAwesome name='pause' style={pauseStyle} onClick={this.tooglePlay}/>
        <FontAwesome name='expand' style={fullscreenStyle} onClick={this.toogleFullscreen}/>
      </div>
    );
  }
});

module.exports = Radium(Control);
