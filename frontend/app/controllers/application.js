import Ember from "ember";

export default Ember.Controller.extend({
  sortProperties: ['time'],
  sortAscending: false,
  model: [],

  actions: {
    clearErrors: function() {
      this.get('model').clear();
    }
  }
});
