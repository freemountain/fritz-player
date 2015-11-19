var React = require('react');
var _player = null;
var Player = React.createClass({

  shouldComponentUpdate: function() {
    return false;
  },

  componentDidMount: function() {
    var node = this.getDOMNode();
    var canvas = document.createElement('canvas');
    canvas.id = 'rPlayer';
    window._no = node;
    node.appendChild(canvas);


    var wjs = require("./../raw/wcjs-renderer");
    if(!_player) _player = wjs.init(canvas, ["--network-caching=500 -vvv"]);
    window._p = _player;
  },

  componentWillReceiveProps: function(nextProps, o) {
    if(this.props.url !== nextProps.url) _player.play(nextProps.url);
    if(this.props.play === nextProps.play) return;
    if(!nextProps.play) _player.pause();
    if(nextProps.play) _player.play();

  },

  render: function() {
    console.log('renderP');
    return (
      <div/>
    );
  }
});

module.exports = Player;
