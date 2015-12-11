const React = require('react');

const ToggleDisplay = require('react-toggle-display');
const Paper = require('material-ui/lib/paper');

var Panel = React.createClass({
  render: function() {
    // https://css-tricks.com/centering-percentage-widthheight-elements/
    var style = {
      position: 'absolute',
      // transform: 'translate(0, -50%)',
      width: '37%',
      height: '97%',
      left: '0%',
      top: '0%',
      margin: '1%'
    };

    return (
      <div >
        <ToggleDisplay show={this.props.show}>
          <Paper zDepth={3} style={this.props.style || style}>
            {this.props.children}
          </Paper>
        </ToggleDisplay>
      </div>
    );
  }
});

module.exports = Panel;
