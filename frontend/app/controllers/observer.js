import Ember from "ember";

import ParameterObserverModel from 'stromx-web/models/parameter-observer';
import InputObserverModel from 'stromx-web/models/input-observer';

export default Ember.ObjectController.extend({
  isEditingColor: false,
  isEditingVisualization: false,
  
  visualizations: [
    {label: 'Default', value: 'default'},
    {label: 'Image', value: 'image_2d'}, 
    {label: 'Line segments', value: 'line_segments'},
    {label: 'Slider', value: 'slider'}
  ],
  
  // FIXME: For some reason it is not possible to directly bind to the property
  // 'view' in templates. As a workaround the renamed property below is used.
  observerView: Ember.computed.alias('view'),
  
  visualizationLabel: function() {
    var visualization = this.get('visualization');
    
    var array = Ember.ArrayProxy.create({content: this.visualizations});
    var record = array.findBy('value', visualization);
    return record ? record['label'] : '';
  }.property('visualization'),

  title: function() {
    if (this.get('isParameterObserver')) {
      return this.get('parameterTitle');
    } else if (this.get('isInputObserver')) {
      return this.get('inputTitle');
    } else {
      return '';
    }
  }.property('parameterTitle', 'inputTitle'),
  
  isParameterObserver: function() {
    return this.get('model') instanceof ParameterObserverModel;
  }.property(),
  
  isInputObserver: function() {
    return this.get('model') instanceof InputObserverModel;
  }.property(),

  parameterTitle: function() {
    var parameter = this.get('parameter');
    var name = parameter.get('operator.name');
    var title = parameter.get('title');
    if (name) {
      title += " at " + name;
    }

    return title;
  }.property('parameter.title', 'parameter.operator.name'),

  inputTitle: function() {
    var input = this.get('input');
    var name = input.get('operator.name');
    var title = input.get('title');
    if (name) {
      title += " at " + name;
    }

    return title;
  }.property('input.title', 'input.operator.name'),

  actions: {
    editColor: function() {
      this.set('isEditingColor', true);
    },
    setColor: function(color) {
      this.set('color', color);
    },
    editVisualization: function() {
      this.set('isEditingVisualization', true);
    },
    saveChanges: function() {
      this.set('isEditingColor', false);
      this.set('isEditingVisualization', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditingColor', false);
      this.set('isEditingVisualization', false);
      this.get('model').rollback();
    },
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
            if (thisZValue > zvalue) {
              observer.set('zvalue', thisZValue - 1);
            }
          });
        });
      });
    }
  }
});
