import Ember from "ember";

export default Ember.ArrayController.extend({
  sortProperties: ['time'],
  sortAscending: false,

  actions: {
    clearErrors: function() {
      this.get('model').clear();
    }
  }
});
