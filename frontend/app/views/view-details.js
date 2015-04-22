import Ember from "ember";

export default Ember.View.extend({
  didInsertElement: function() {
    this.get('controller').send('connect');
  },
  
  willDestroyElement: function() {
    this.get('controller').send('disconnect');
  }
});