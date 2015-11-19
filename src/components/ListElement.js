var React = require('react');
var Radium = require('radium');

var ListElement = React.createClass({
  render: function() {
    var style = {
      marginTop: '10px',
      marginBottom: '10px',
      marginLeft: '10px',
      marginRight: '10px',
      cursor: 'default',
      ':hover': {
        color: '#555'
      }
    }
    return (
      <div style={style} onClick={() => this.props.handler(this.props.data)}>{this.props.data.title}</div>
    );
  }
});

module.exports = Radium(ListElement);
