const React = require('react');

// From https://github.com/paramaggarwal/react-progressbar
var component = React.createClass({
  render: function() {
    var completed = +this.props.completed;
    if(completed < 0) completed = 0;
    if(completed > 100) completed = 100;

    var foreground = {
      backgroundColor: '#333333',
      width: completed + '%',
      transition: 'width 200ms',
      height: 10
    };

    var background = {
      backgroundColor: '#333333',
      width: (100 - completed) + '%',
      height: 4
    };

    var container = {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '100%'
    };

    return (
      <div style={container}>
        <div style={foreground}></div>
        <div style={background}></div>
      </div>
    );
  }
});

module.exports = component;
