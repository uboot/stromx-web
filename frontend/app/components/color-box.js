import Ember from "ember";

export default Ember.Component.extend({
  color: '#000000',
  colorStyle: function() {
    return 'background-color: ' + this.get('color');
  }.property('color')
});
