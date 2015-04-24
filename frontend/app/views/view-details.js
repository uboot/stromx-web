import Ember from "ember";

export default Ember.View.extend({
  templateName: 'view-details',
  didInsertElement: function() {
    this.get('controller').send('connect');
  },
  
  willDestroyElement: function() {
    this.get('controller').send('disconnect');
  }
});