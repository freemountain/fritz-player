var React = require('react');
var Morearty = require('morearty');
var R = require('ramda');

var Player = require('./Player');
var Sidebar = require('./SideBar');
var List = require('./List');
var utils = require('./../node/utils');

function getSources() {
  if(__ENV === 'nw') return window.__req('./node/sources').get();
  var defer = utils.defer();
  defer.resolve(require('./../../sources.json'));
  return defer.promise;
};

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

    this.addBindingListener(binding, 'player', function (changes) {
      // TODO: trigger nw fullscreen
      console.log('pp', changes.getCurrentValue());
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

    getSources().then(function(sources) {
      console.log('sss');
      binding.set('sources', sources);
      console.log('oo', sources[0].list[0]);
      binding.set('player.url', sources[0].list[0].url);
      binding.set('player.play', true);
    });
  },
  render: function() {
    var binding = this.getDefaultBinding();
    var stationsBinding = binding.sub('stations');
    var sourcesBinding = binding.sub('sources');
    var sources = sourcesBinding.get();

    var getSourceItem = (id) => R.compose(
        R.filter( (item) => item.id === id),
        R.reduce( (a, b) => a.concat(b), []),
        R.map(R.prop('list'))
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
      <Player url={binding.get('player.url')} play={binding.get('player.play')}/>
      </div>
    );
  }
});

module.exports = App;
