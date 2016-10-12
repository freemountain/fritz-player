// Import React, ReactDOM and the DummyComponent.
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
import Morearty from 'morearty';

export default modules => {
  const root = document.querySelector('main');

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
      fullscreen: false
    }
  });

  const Bootstrap = ctx.bootstrap(App);
  // Append the DummyComponent instance to the root element.
  ReactDOM.render(<Bootstrap modules={modules} />, root);
};
