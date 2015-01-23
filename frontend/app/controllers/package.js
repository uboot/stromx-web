import Ember from "ember";

export default Ember.ObjectController.extend({
  active: function() {
    return this.get('parentController.activePackage') === this.get('model');
  }.property('parentController.activePackage'),
  
  actions: {
    activate: function() {
      this.set('parentController.activePackage', this.get('model'));
    }
  }
});
