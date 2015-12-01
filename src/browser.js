//material-ui needs this
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var React = require('react');
var ReactDOM = require('react-dom');
var Morearty = require('morearty');

var App = require('./components/App');

module.exports = function(_require) {
  window.__req = _require;

  var ctx = Morearty.createContext({
    initialState: {
      sources: [],
      stations: [],
      player: {
        play: false,
        url: '',
        id: ''
      },
      sidebar: {
        show: true
      },
      dimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      fullscreen: false,
    }
  });


  var Bootstrap = ctx.bootstrap(App);
  var element = document.getElementById('content');

  return ReactDOM.render(
    <Bootstrap />,
    element
  );
};
