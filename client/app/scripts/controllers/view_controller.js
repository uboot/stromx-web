/* global App */

App.ViewController = Ember.ObjectController.extend({
  parameterObservers: Ember.computed.alias('observers'),

  connectorObservers: Ember.computed.filter('observers', function(observer) {
    return observer instanceof App.ConnectorObserver;
  }),

  observerSorting: ['zvalue:desc'],

  sortedObservers: Ember.computed.sort('observers', 'observerSorting')
});
