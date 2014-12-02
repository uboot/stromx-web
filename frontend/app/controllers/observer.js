import Ember from "ember";

import ParameterObserver from 'stromx-web/models/parameter-observer';
import InputObserver from 'stromx-web/models/input-observer';

export default Ember.ObjectController.extend({
  visualizationLabel: function() {
    var visualization = this.get('visualization');

    switch (visualization) {
      case 'image_2d':
        return 'Image';
      case 'line_segments':
        return 'Line segments';
      case 'slider':
        return 'Slider';
      case 'default':
        return 'Default';
      default:
        return '';
    }
  }.property('visualization'),

  title: function() {
    if (this.get('model') instanceof ParameterObserver) {
      return this.get('parameterTitle');
    } else if (this.get('model') instanceof InputObserver) {
      return this.get('inputTitle');
    } else {
      return '';
    }
  }.property('parameterTitle', 'inputTitle'),

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

  svgType: function() {
    var visualization = this.get('visualization');
    var variant = this.get('value.variant');

    if (variant === undefined) {
      return;
    }

    if (visualization === 'default') {
      switch (variant) {
        case 'int':
        case 'float':
          return 'text';
        case 'image':
          return 'image';
        default:
          return '';
      }
    }

    switch (visualization) {
      case 'text':
        return 'text';
      case 'image_2d':
        return 'image';
      case 'line_segments':
        return 'lines';
      default:
        break;
    }
  }.property('visualization', 'value.variant'),

  svgImage: Ember.computed.equal('svgType', 'image'),
  svgText: Ember.computed.equal('svgType', 'text'),
  svgLines: Ember.computed.equal('svgType', 'lines'),

  imageData: function() {
    var value = this.get('value.value');

    if (value === undefined) {
      return;
    }

    return value.values;
  }.property('value.value'),

  imageWidth: function() {
    var value = this.get('value.value');

    if (value === undefined) {
      return;
    }

    return value.width;
  }.property('value.value'),

  imageHeight: function() {
    var value = this.get('value.value');

    if (value === undefined) {
      return;
    }

    return value.height;
  }.property('value.value'),

  textData: function() {
    var value = this.get('value.value');

    if (value === undefined) {
      return;
    }

    return value;
  }.property('value.value'),

  linesData: function() {
    var value = this.get('value.value');

    if (value === undefined) {
      return;
    }

    return value.values;
  }.property('value.value'),

  color: function() {
    var props = this.get('properties');
    return props.color || '#000000';
  }.property('properties'),

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
            if (thisZValue > zvalue) {
              observer.set('zvalue', thisZValue - 1);
            }
          });
        });
      });
    }
  }
});
