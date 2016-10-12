import React from 'react';
import Morearty from 'morearty';
import R from 'ramda';
import { MuiThemeProvider } from 'material-ui';
import { getMuiTheme } from 'material-ui/styles';

import Player from './Player';
import Panel from './Panel';

import List from './List';
import sources from './../../backend/sources';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
const App = React.createClass({
  mixins: [Morearty.Mixin],
  propTypes: {
    modules: React.PropTypes.object
  },
  componentDidMount () {
    const binding = this.getDefaultBinding();

    document.onmousemove = e => {
      if (e.pageX < 20 && !binding.get('sidebar.show')) {
        return binding.set('sidebar.show', true);
      }

      if (window.innerWidth - e.pageX < 30 && binding.get('sidebar.show')) {
        binding.set('sidebar.show', false);
      }
    };

    sources.get().then(sources => {
      binding.set('sources', sources);
      if (!sources[0]) return;

      binding.set('player.url', sources[0].items[0].url);
      binding.set('player.play', true);
    });
  },

  render () {
    const binding = this.getDefaultBinding();
    const sourcesBinding = binding.sub('sources');
    const sources = sourcesBinding.get();

    const getSourceItem = (id) => R.compose(
        R.filter((item) => item.id === id),
        R.reduce((a, b) => a.concat(b), []),
        R.map(R.prop('items'))
    )(sources)[0];

    const play = i => {
      const item = getSourceItem(i);
      binding.set('player.url', item.url);
    };

    return (

      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <Panel show={binding.get('sidebar.show')}>
            <List binding={binding} onItemClick={play} />
          </Panel>

          <Player
            wcjs={this.props.modules.wcjs}
            url={binding.get('player.url')}
            play={binding.get('player.play')}
          />
        </div>
      </MuiThemeProvider>
    );
  }
});

export default App;
