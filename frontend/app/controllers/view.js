import Ember from "ember";

import InputObserver from 'stromx-web/models/input-observer';

export default Ember.ObjectController.extend({
  isEditing: false,

  actions: {
    saveChanges: function() {
      this.set('isEditing', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditing', false);
      this.get('model').rollback();
    },
    edit: function() {
      this.set('isEditing', true);
    },
  },

  parameterObservers: Ember.computed.alias('observers'),

  inputObservers: Ember.computed.filter('observers', function(observer) {
    return observer instanceof InputObserver;
  }),

  svgSorting: ['zvalue:incr'],
  svgObservers: Ember.computed.sort('observers', 'svgSorting'),
});
