import Ember from "ember";

import ParameterObserverModel from 'stromx-web/models/parameter-observer';
import InputObserverModel from 'stromx-web/models/input-observer';

export default Ember.Controller.extend({
  needs: ['stream'],
  isEditingColor: false,
  isEditingVisualization: false,

  visualizations: [
    {label: 'Default', value: 'default'},
    {label: 'Image', value: 'image'},
    {label: 'Line segments', value: 'line_segments'},
    {label: 'Slider', value: 'slider'},
    {label: 'Points', value: 'points'},
    {label: 'Polygon', value: 'polygon'},
    {label: 'Polyline', value: 'polyline'}
  ],

  // FIXME: For some reason it is not possible to directly bind to the property
  // 'view' in templates. As a workaround the renamed property below is used.
  observerView: Ember.computed.alias('model.view'),

  // FIXME: Model rollback does not work if the color selector is bound to
  // 'properties.color'. Instead we use proxy property below and copy the value
  // 'properties.color' in saveChanges().
  color: '#000000',

  visualizationLabel: function() {
    var visualization = this.get('model.visualization');

    var array = Ember.ArrayProxy.create({content: this.visualizations});
    var record = array.findBy('value', visualization);
    return record ? record['label'] : '';
  }.property('model.visualization'),

  title: function() {
    if (this.get('isParameterObserver')) {
      return this.get('parameterTitle');
    } else if (this.get('isInputObserver')) {
      return this.get('inputTitle');
    } else {
      return '';
    }
  }.property('parameterTitle', 'inputTitle'),


  value: function(key, value) {
    if (value === undefined) {
      var _this = this;
      var valuePromise = this.get('model.value');
      if (! valuePromise) {
        return null;
      }

      valuePromise.then(function(value) {
        _this.set('value', value);
      });

      return null;
    } else {
      return value;
    }
  }.property('model.value'),

  isParameterObserver: function() {
    return this.get('model') instanceof ParameterObserverModel;
  }.property(),

  isInputObserver: function() {
    return this.get('model') instanceof InputObserverModel;
  }.property(),

  parameterTitle: function() {
    var parameter = this.get('model.parameter');
    var name = parameter.get('operator.name');
    var title = parameter.get('title');
    if (name) {
      title += " at " + name;
    }

    return title;
  }.property('model.parameter.title', 'model.parameter.operator.name'),

  inputTitle: function() {
    var input = this.get('model.input');
    var name = input.get('operator.name');
    var title = input.get('title');
    if (name) {
      title += " at " + name;
    }

    return title;
  }.property('model.input.title', 'model.input.operator.name'),

  actions: {
    editColor: function() {
      this.set('color', this.get('model.properties.color'));
      this.set('isEditingColor', true);
    },
    setColor: function(color) {
      this.set('color', color);
    },
    editVisualization: function() {
      this.set('color', this.get('model.properties.color'));
      this.set('isEditingVisualization', true);
    },
    saveChanges: function() {
      this.set('isEditingColor', false);
      this.set('isEditingVisualization', false);

      this.set('model.properties.color', this.get('color'));
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditingColor', false);
      this.set('isEditingVisualization', false);
      this.get('model').rollback();
    },
    moveUp: function() {
      var model = this.get('model');
      var zvalue = model.get('zvalue');
      model.get('view').then(function(view) {
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
      var model = this.get('model');
      var zvalue = model.get('zvalue');
      model.get('view').then(function(view) {
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
      var model = this.get('model');
      var zvalue = model.get('zvalue');
      var view = model.get('view');
      model.deleteRecord();
      model.save();

      view.then(function(view) {
        var observers = view.get('observers');
        observers.removeObject(model);

        observers.then(function(observers) {
          observers.forEach(function(observer) {
            var thisZValue = observer.get('zvalue');
            if (thisZValue > zvalue) {
              observer.set('zvalue', thisZValue - 1);
            }
          });
        });
      });
    }
  }
});
