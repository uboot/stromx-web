import Ember from "ember";

export default Ember.Component.extend({
  color: '#000000',
  colorStyle: function() {
    var color = this.get('color');
    return ('background-color: ' + color).htmlSafe();
  }.property('color')
});
