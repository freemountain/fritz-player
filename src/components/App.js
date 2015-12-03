const React = require('react');
const Morearty = require('morearty');
const R = require('ramda');

const Player = require('./Player');
const Sidebar = require('./SideBar');
const List = require('./List');
const utils = require('./../node/utils');

var App = React.createClass({
  mixins: [Morearty.Mixin],

  componentDidMount: function() {
    var binding = this.getDefaultBinding();

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

    this.props.modules.sources.get().then(function(sources) {
      binding.set('sources', sources);
      if(!sources[0]) return;
      binding.set('player.url', sources[0].items[0].url);
      binding.set('player.play', true);
    });
  },

  render: function() {
    var binding = this.getDefaultBinding();
    var sourcesBinding = binding.sub('sources');
    var sources = sourcesBinding.get();

    var getSourceItem = (id) => R.compose(
        R.filter( (item) => item.id === id),
        R.reduce( (a, b) => a.concat(b), []),
        R.map(R.prop('items'))
    )(sources)[0];

    var play = function(i) {
      var item = getSourceItem(i);
      binding.set('player.url', item.url);
    };

    return (
      <div>
      <Sidebar binding={binding} >
        <List binding={ binding } onItemClick= { play }/>
      </Sidebar>
      <Player
        url={binding.get('player.url')}
        play={binding.get('player.play')}
        modules={this.props.modules}
      />
      </div>
    );
  }
});

module.exports = App;
