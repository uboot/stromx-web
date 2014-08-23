/* global App */

App.ObserverController = Ember.ObjectController.extend({
  visualizationLabel: function() {
    var visualization = this.get('visualization');

    if (visualization === 'image')
      return 'Image';
    else if (visualization === 'lines')
      return 'Lines';
    else if (visualization === 'slider')
      return 'Slider';
    else
      return '';
  }.property('visualization'),

  title: function() {
    if (this.get('model') instanceof App.ParameterObserver)
      return this.get('parameterTitle');
    else if (this.get('model') instanceof App.ConnectorObserver)
      return this.get('connectorTitle');
    else
      return '';
  }.property('parameterTitle', 'connectorTitle'),

  parameterTitle: function() {
    var parameter = this.get('parameter');
    var operator = parameter.get('operator');
    if (operator)
      return parameter.get('title') + " at " + operator.get('name');
    else
      return '';
  }.property('parameter.title', 'parameter.operator.name'),

  connectorTitle: function() {
    var connector = this.get('connector');
    var operator = connector.get('operator');
    if (operator)
      return connector.get('title') + " at " + operator.get('name');
    else
      return '';
  }.property('connector.title', 'connector.operator.name'),

  actions: {
    moveUp: function() {
      var zvalue = this.get('zvalue');
      var model = this.get('model');
      this.get('view').then(function(view) {
        var observers = view.get('observers');
        var modelAbove = observers.findBy('zvalue', zvalue + 1);
        if (modelAbove) {
          model.set('zvalue', zvalue + 1);
          modelAbove.set('zvalue', zvalue);
          model.save();
          modelAbove.save();
        }
      });
    },

    moveDown: function() {
      var zvalue = this.get('zvalue');
      var model = this.get('model');
      this.get('view').then(function(view) {
        var observers = view.get('observers');
        var modelBelow = observers.findBy('zvalue', zvalue - 1);
        if (modelBelow) {
          modelBelow.set('zvalue', zvalue);
          model.set('zvalue', zvalue - 1);
          modelBelow.save();
          model.save();
        }
      });
    },

    remove: function () {
      var observer = this.get('model');
      var zvalue = this.get('model.zvalue');
      var view = this.get('model.view');
      observer.deleteRecord();
      observer.save();

      view.then(function(view) {
        var observers = view.get('observers');
        observers.removeObject(observer);

        observers.then(function(observers) {
          observers.forEach(function(observer) {
            var thisZValue = observer.get('zvalue');
            if (thisZValue > zvalue)
              observer.set('zvalue', thisZValue - 1);
          });
        });
      });
    }
  }
});
