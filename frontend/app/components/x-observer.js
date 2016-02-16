import Ember from "ember";
import { VISUALIZATIONS } from 'stromx-web/visualizations';

export default Ember.Component.extend({
  model: null,
  isEditingColor: false,
  isEditingVisualization: false,

  visualizationMap: function() {
    var values = this.get('model.visualizations');
    return values.map(function(value) {
      var label = VISUALIZATIONS[value];
      return {
        value: value,
        label: label
      };
    });
  }.property('model.visualizations'),

  // FIXME: Model rollback does not work if the color selector is bound to
  // 'properties.color'. Instead we use proxy property below and copy the value
  // 'properties.color' in saveChanges().
  color: '#000000',

  visualizationLabel: function() {
    var visualization = this.get('model.visualization');
    var label = VISUALIZATIONS[visualization];
    return label ? label : '';
  }.property('model.visualization'),

  value: Ember.computed('model.value', {
    get: function() {
      var _this = this;
      var valuePromise = this.get('model.value');
      if (! valuePromise) {
        return null;
      }

      valuePromise.then(function(value) {
        _this.set('value', value);
      });

      return null;
    },
    set: function(key, value) {
      return value;
    }
  }),

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
      this.get('model').rollbackAttributes();
    }
  }
});
