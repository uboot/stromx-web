import Ember from "ember";

import InputObserver from 'stromx-web/models/input-observer';

export default Ember.ObjectController.extend({
  isVisible: function() {
    return this.get('parentController.view') === this.get('model');
  }.property('parentController.view'),

  parameterObservers: Ember.computed.alias('observers'),

  inputObservers: Ember.computed.filter('observers', function(observer) {
    return observer instanceof InputObserver;
  }),

  svgSorting: ['zvalue:incr'],
  svgObservers: Ember.computed.sort('observers', 'svgSorting'),

  addInputObserver: function(input) {
    var numObservers = this.get('observers.length');
    var observer = this.store.createRecord('input-observer', {
      view: this.get('model'),
      input: input,
      zvalue: numObservers + 1,
      properties: {
        color: '#000000'
      },
      visualization: 'default'
    });
    return observer.save();
  },

  actions: {
    display: function() {
      this.set('parentController.view', this.get('model'));
      this.send('renderDetails', this);
    }
  }
});
