const React = require('react');

const FlatButton = require('material-ui/lib/flat-button');
const FontIcon = require('material-ui/lib/font-icon');


var PlayButton = React.createClass({
  render: function() {
    var pressed = this.props.pressed;
    var iconName = pressed ? 'true' : 'false';
    var icon = this.props[iconName + '-icon'];
    var _handler = this.props.handler;

    var handler = function() {
      if(!_handler) return;
      _handler(!pressed);
    };

    return (
      <FlatButton onTouchTap={handler}>
        <FontIcon className={icon}/>
      </FlatButton>);
  }
});

module.exports = PlayButton;
