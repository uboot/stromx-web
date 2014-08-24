/* global App */

App.ApplicationController = Ember.ArrayController.extend({
  sortProperties: ['time'],
  sortAscending: false,

  actions: {
    clearErrors: function() {
      this.get('model').clear();
    }
  }
});
