const React = require('react');
const Morearty = require('morearty');

const FontIcon = require('material-ui/lib/font-icon');
const FlatButton = require('material-ui/lib/flat-button');

const PlayButton = require('./PlayButton');
const ProgressBar = require('./ProgressBar');

var ControlBar = React.createClass({
  mixins: [Morearty.Mixin],

  render: function() {
    var binding = this.getDefaultBinding();

    var buttonContainer = {
      float: 'left',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexGrow: '0',
    };

    var sliderContainer = {
      float: 'right',
      height: '100%',
      display: 'flex',
      flexGrow: '1',
    };

    var container = {
      display: 'flex'
    };

    var spacer = {
      display: 'flex',
      flexBasis: '10px',
      marginRight: '3%',
      flexGrow: '0',
    };

    var toggle = () => binding.set('player.play', !binding.get('player.play'));

    return (
      <div style={container}>
        <div style={buttonContainer}>
            <FlatButton>
              <FontIcon className='fa fa-plus'/>
            </FlatButton>
            <PlayButton
              pressed={binding.get('player.play')}
              handler={toggle}
              true-icon='fa fa-pause'
              false-icon='fa fa-play'
            />
        </div>
        <div style={sliderContainer}>
          <div style={spacer}></div>
          <ProgressBar completed={30} />
          <div style={spacer}></div>
        </div>
      </div>
    );
  }
});

module.exports = ControlBar;
