/* global App */

App.ViewNewObserverController = Ember.Controller.extend({
  stream: function() {
    var model = this.get('model');
    return model.get('stream');
  }.property(),

  operator: null,

  connector: null,

  connectors: function() {
    var operator = this.get('operator');
    if (operator)
      return operator.get('inputs');
  }.property('operator'),

  actions: {
    saveObserver: function () {
      var connector = this.get('connector');
      var model = this.get('model');
      var store = this.get('store');
      if (connector) {
        model.get('observers').then(function(observers) {
          var numObservers = observers.get('length');
          var observer = store.createRecord('connector_observer', {
            connector: connector,
            view: model,
            zvalue: numObservers + 1
          });
          observer.save();

          observers.pushObject(observer);
        })
      }
      this.transitionToRoute('view');
    }
  }
});
