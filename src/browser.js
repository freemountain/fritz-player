var ipc = require('electron').ipcRenderer;

var React = require('react');
var Immutable = require('immutable');
var ReactDOM = require('react-dom');
var Morearty = require('morearty');

var Player = require('./components/Player');
var List = require('./components/List');
var Sidebar = require('./components/SideBar');
var avm = require('./avmRepeater');

var ctx = Morearty.createContext({
  initialState: {
    stations: [],
    player: {
      play: false,
      url: '',
    },
    sidebar: {
      show: false
    },
    dimensions: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    fullscreen: false,
  }
});

var App = React.createClass({
  mixins: [Morearty.Mixin],

  play: function(data) {
    var binding = this.getDefaultBinding()
    binding.set('player.url', data.url);
  },

  componentDidMount: function() {
    var binding = this.getDefaultBinding();

    this.addBindingListener(binding, 'fullscreen', function (changes) {
      ipc.send('set-fullscreen', changes.getCurrentValue());
    });

    document.onmousemove = function(e) {
      if (e.pageX < 20 && !binding.get('sidebar.show'))
        return binding.set('sidebar.show', true);
      if (window.innerWidth - e.pageX < 30 && binding.get('sidebar.show'))
        binding.set('sidebar.show', false);
    };

    window.onresize = function(e) {
      binding.set('dimensions.width', window.innerWidth);
      binding.set('dimensions.height', window.innerHeight);
    }

    avm.getPlaylist(2000).then(function(playlist) {
      binding.update('stations', (val) => val.merge(playlist));
      binding.set('player.url', playlist[0].url);
      binding.set('player.play', true);
    });
  },
  render: function() {
    var binding = this.getDefaultBinding();

    return (
      <div>
      <Sidebar binding={binding} >
        <List binding={binding} handler={this.play}/>
      </Sidebar>
      <Player url={binding.get('player.url')} play={binding.get('player.play')}/>
      </div>
    );
  }
});

var Bootstrap = ctx.bootstrap(App);
ReactDOM.render(
  <Bootstrap />,
  document.getElementById('content')
);
