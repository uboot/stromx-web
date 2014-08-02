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
      var controller = this;
      this.get('view').then(function(view) {
        var observers = view.get('observers');
        var modelAbove = observers.findBy('zvalue', zvalue + 1);
        if (modelAbove) {
          controller.set('zvalue', zvalue + 1);
          modelAbove.set('zvalue', zvalue);
        }
      });
    },

    moveDown: function() {
      var zvalue = this.get('zvalue');
      var controller = this;
      this.get('view').then(function(view) {
        var observers = view.get('observers');
        var modelBelow = observers.findBy('zvalue', zvalue - 1);
        if (modelBelow) {
          modelBelow.set('zvalue', zvalue);
          controller.set('zvalue', zvalue - 1);
        }
      });
    },

    remove: function () {
      var observer = this.get('model');
      var zvalue = this.get('zvalue');
      var view = this.get('view');
      observer.deleteRecord();
      observer.save();

      // update the z-value of the remainig controllers
      view.then(function(view) {
        var observers = view.get('observers');
        observers.forEach(function(observer) {
          var thisZValue = observer.get('zvalue');
          if (thisZValue > zvalue)
            observer.set('zvalue', thisZValue - 1);
        });
      });
    }
  }
});
