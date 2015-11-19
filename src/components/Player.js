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
    node.appendChild(canvas);

    var wjs = window.__req("./node/wcjs-renderer");
    if(!_player) _player = wjs.init(canvas, ["--network-caching=500 -vvv"]);
  },

  componentWillReceiveProps: function(nextProps, o) {
    if(this.props.url !== nextProps.url) _player.play(nextProps.url);
    if(this.props.play === nextProps.play) return;
    if(!nextProps.play) _player.pause();
    if(nextProps.play) _player.play();
  },

  render: function() {
    console.log('renderPlayer');
    return (
      <div/>
    );
  }
});

module.exports = Player;
