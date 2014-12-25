import Ember from "ember";

export default Ember.TextField.extend({
  becomeFocused: function() {
    this.$().focus();
  }.on('didInsertElement'),
  keyUp: function(event) {
    if (event.keyCode === 27) { // escape key
      this.sendAction('escape-up', event);
    } else {
      this._super(event);
    }
  }
});
