/* global App */

App.ViewNewObserverController = Ember.Controller.extend({
  stream: function() {
    var model = this.get('model');
    return model.get('stream');
  }.property(),

  operator: null,

  target: null,

  targetTypes: [
    {id: 0, label: 'Input'},
    {id: 1, label: 'Output'},
    {id: 2, label: 'Parameter'},
  ],

  targetType: null,

  targets: function() {
    var operator = this.get('operator');
    if (! operator)
      return;

    var targetType = this.get('targetType');
    switch(targetType)
    {
    case 0:
      return operator.get('inputs');
    case 1:
      return operator.get('outputs');
    case 2:
      return operator.get('parameters');
    }
  }.property('operator', 'targetType'),

  actions: {
    saveObserver: function () {
      var target = this.get('target');
      var model = this.get('model');
      var store = this.get('store');
      if (target) {
        model.get('observers').then(function(observers) {
          var numObservers = observers.get('length');
          var observer = null;

          if (target instanceof App.Connector)
          {
            observer = store.createRecord('connector_observer', {
              connector: target,
              view: model,
              zvalue: numObservers + 1
            });
          }
          else if (target instanceof App.Parameter)
          {
            observer = store.createRecord('parameter_observer', {
              parameter: target,
              view: model,
              zvalue: numObservers + 1
            });
          }

          if (observer)
          {
            observer.save().then(function(observer) {
              observers.pushObject(observer);
            });
          }
        })
      }
      this.transitionToRoute('view');
    }
  }
});
