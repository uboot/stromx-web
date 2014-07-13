/* global App */

App.ConnectorObserverController = Ember.ObjectController.extend({
  visualizationLabel: function() {
    var visualization = this.get('visualization');

    if (visualization === 'image')
      return 'Image';
    else if (visualization === 'lines')
      return 'Lines';
    else
      return '';
  }.property('visualization'),

  title: function() {
    var connector = this.get('connector');
    var operator = connector.get('operator');
    if (operator)
      return connector.get('title') + " at " + operator.get('name');
    else
      return '';
  }.property('connector.title', 'connector.operator.name'),

  position: function() {
    var view = this.get('view');
    var observers = view.get('connectorObservers');
    var model = this.get('model');

    return observers.indexOf(model);
  }.property('view.connectorObservers'),

  actions: {
    moveUp: function() {
      var view = this.get('view');
      var observers = view.get('connectorObservers');
      var model = this.get('model');
      var index = observers.indexOf(model);

      if (index == 0)
        return;

      observers.removeAt(index);
      observers.insertAt(index - 1, model);
    }
  }
});
