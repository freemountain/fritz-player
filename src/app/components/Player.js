import React from 'react';
import renderer from 'wcjs-renderer';

function resize (container, gl) {
  const containerWidth = Math.floor(container.clientWidth);
  const containerHeight = Math.floor(container.clientHeight);
  const scaleX = containerWidth / gl.canvas.width;
  const scaleY = containerHeight / gl.canvas.height;
  const scale = scaleX < scaleY ? scaleX : scaleY;
  const resizedWidth = gl.canvas.width * scale;
  const resizedHeight = gl.canvas.height * scale;

  if (gl.canvas.width === resizedWidth && gl.canvas.height === resizedHeight) return;

  gl.canvas.width = resizedWidth;
  gl.canvas.height = resizedHeight;
  gl.viewport(0, 0, resizedWidth, resizedHeight);
}

class Player extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.url !== nextProps.url) {
      this.vlc.play(nextProps.url);
    }

    if (this.props.play !== nextProps.play) {
      if (!nextProps.play) this.vlc.pause();
      if (nextProps.play) this.vlc.play();
    }

    return false;
  }

  componentDidMount () {
    this.vlc = this.props.wcjs.createPlayer();
    const context = this.canvas.getContext('webgl');
    const container = this.container;

    this.vlc.onLogMessage = (level, message, format) => {
      if (level < 3) return;
      console.log('Webchimera:', level, message);
    };

    this.r = renderer.bind(this.canvas, this.vlc, {
      onFrameReady: () => resize(container, context)
    });

    window.that = this;
  }

  render () {
    return (
      <div id='player' ref={(c) => { this.container = c; }}
        style={{
          backgroundColor: 'black',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <canvas ref={(c) => { this.canvas = c; }} />
      </div>
    );
  }
}

Player.propTypes = {
  play: React.PropTypes.bool,
  url: React.PropTypes.string,
  wcjs: React.PropTypes.object,
  vlc: React.PropTypes.object,
  children: React.PropTypes.element
};

export default Player;
