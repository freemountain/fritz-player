var React = require('react');
var Morearty = require('morearty');

var Player = require('./Player');
var Sidebar = require('./SideBar');
var List = require('./List');

var App = React.createClass({
  mixins: [Morearty.Mixin],

  play: function(data) {
    var binding = this.getDefaultBinding()
    binding.set('player.url', data.url);
  },

  componentDidMount: function() {
    var binding = this.getDefaultBinding();

    this.addBindingListener(binding, 'fullscreen', function (changes) {
      // TODO: trigger nw fullscreen
      //ipc.send('set-fullscreen', changes.getCurrentValue());
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

    window.__req('./node/avmRepeater').getPlaylist(2000).then(function(playlist) {
      console.log(3223, playlist);
      binding.update('stations', (val) => val.merge(playlist));
      binding.set('player.url', playlist[0].url);
      binding.set('player.play', true);
    });
  },
  render: function() {
    var binding = this.getDefaultBinding();
    var stationsBinding = binding.sub('stations');

    var play = (i) => binding.set('player.url', stationsBinding.get(i).url);

    return (
      <div>
      <Sidebar binding={binding} >
        <List binding={ binding } onItemClick= { play }/>
      </Sidebar>
      <Player url={binding.get('player.url')} play={binding.get('player.play')}/>
      </div>
    );
  }
});

module.exports = App;
