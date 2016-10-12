import React from 'react';
import ToggleDisplay from 'react-toggle-display';
import { Paper } from 'material-ui';

const Panel = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    style: React.PropTypes.object,
    children: React.PropTypes.element.isRequired
  },
  render () {
    // https://css-tricks.com/centering-percentage-widthheight-elements/
    const style = {
      position: 'absolute',
      // transform: 'translate(0, -50%)',
      width: '37%',
      height: '97%',
      left: '0%',
      top: '0%',
      margin: '1%'
    };

    return (
      <div style={{zIndex: 10}}>
        <ToggleDisplay show={this.props.show}>
          <Paper zDepth={3} style={this.props.style || style}>
            {this.props.children}
          </Paper>
        </ToggleDisplay>
      </div>
    );
  }
});

export default Panel;
