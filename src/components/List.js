var Morearty = require('morearty');

var React = require('react');
var ReactList = require('react-list');
var ListElement = require('./ListElement.js');
var Control = require('./Control.js');
var List = React.createClass({
  mixins: [Morearty.Mixin],



  render: function() {
    var binding = this.getDefaultBinding();
    var stations = binding.get('stations').toJS();

    var r = function(i, k) {
      return <ListElement
        key={k}
        data={stations[k]}
        handler={ (d) => this.props.handler(d)}/>;
    }.bind(this);

    var listStyle = {
      overflow: 'auto',
      height: binding.get('dimensions.height') - 50,

    };

    var containerStyle = {
      color: 'white',
      height: binding.get('dimensions.height'),
      backgroundColor: 'rgba(5, 5, 5, 0.8)',
      borderRight: '3px solid black',
    };



    return (
      <div style={containerStyle}>
        <div style={listStyle}>
          <ReactList
            length = {binding.get('stations').count()}
            itemRenderer = {r}
          />
        </div>
        <Control binding={binding} />
      </div>
    );
  }
});

module.exports = List;
