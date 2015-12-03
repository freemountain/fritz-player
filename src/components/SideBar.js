const React = require('react');
const ToggleDisplay = require('react-toggle-display');
const Morearty = require('morearty');

var Bar = React.createClass({
  mixins: [Morearty.Mixin],

  render: function() {
    var binding = this.getDefaultBinding();

    return (
      <div>
        <ToggleDisplay
                 show={binding.get('sidebar.show')}>
          {this.props.children}
        </ToggleDisplay>
      </div>
    );
  }
});

module.exports = Bar;
