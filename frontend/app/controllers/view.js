import Ember from "ember";

import InputObserver from 'stromx-web/models/input-observer';

export default Ember.ObjectController.extend({
  parameterObservers: Ember.computed.alias('observers'),

  inputObservers: Ember.computed.filter('observers', function(observer) {
    return observer instanceof InputObserver;
  }),

  svgSorting: ['zvalue:incr'],
  svgObservers: Ember.computed.sort('observers', 'svgSorting'),
});
