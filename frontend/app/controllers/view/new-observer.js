import Ember from "ember";

export default Ember.Controller.extend({
  stream: function() {
    var model = this.get('model');
    return model.get('stream');
  }.property(),

  operator: null,
  targetType: null,
  observerTarget: null,

  targetTypes: [
    {id: 0, label: 'Connector'},
    {id: 1, label: 'Parameter'}
  ],

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
      return operator.get('parameters');
    }
  }.property('operator', 'targetType'),

  actions: {
    saveObserver: function () {
      var target = this.get('observerTarget');
      var model = this.get('model');
      var store = this.get('store');

      if (target) {
        model.get('observers').then(function(observers) {
          var numObservers = observers.get('length');
          var observer = null;

          if (target instanceof App.Input) {
            observer = store.createRecord('input_observer', {
              input: target,
              view: model,
              zvalue: numObservers + 1,
              color: '#000000',
              visualization: 'default'
            });
          } else if (target instanceof App.Parameter) {
            observer = store.createRecord('parameter_observer', {
              parameter: target,
              view: model,
              zvalue: numObservers + 1,
              color: '#000000',
              visualization: 'default'
            });
          }

          if (observer !== null)
            observers.save();
        });
      }
      this.transitionToRoute('view');
    }
  }
});
