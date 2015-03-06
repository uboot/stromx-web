import Ember from "ember";

export default Ember.Controller.extend({
  svgType: function() {
    var visualization = this.get('model.visualization');
    var variant = this.get('model.value.variant.ident');

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
      case 'polygons':
        return 'polygons';
      default:
        return '';
    }
  }.property('model.visualization', 'model.value.variant'),

  svgImage: Ember.computed.equal('svgType', 'image'),
  svgText: Ember.computed.equal('svgType', 'text'),
  svgLines: Ember.computed.equal('svgType', 'lines'),
  svgPolygons: Ember.computed.equal('svgType', 'polygons'),

  imageData: function() {
    var variant = this.get('model.value.variant.ident');
    if (!variant || variant !== 'image') {
      return;
    }
    var value = this.get('model.value.value');
    if (value === undefined) {
      return;
    }

    return value.values;
  }.property('model.value.variant', 'model.value.value'),

  imageWidth: function() {
    var variant = this.get('model.value.variant.ident');
    if (!variant || variant !== 'image') {
      return;
    }

    var value = this.get('model.value.value');
    if (!value) {
      return;
    }

    return value.width;
  }.property('model.value.variant', 'model.value.value'),

  imageHeight: function() {
    var variant = this.get('model.value.variant.ident');
    if (!variant || variant !== 'image') {
      return;
    }

    var value = this.get('model.value.value');
    if (!value) {
      return;
    }

    return value.height;
  }.property('model.value.variant', 'model.value.value'),

  textData: function() {
    var value = this.get('model.value.value');
    if (!value) {
      return;
    }

    return value;
  }.property('model.value.value'),

  linesData: function() {
    var variant = this.get('model.value.variant.ident');
    if (!variant || variant !== 'matrix') {
      return;
    }

    var value = this.get('model.value.value');
    if (!value || value.cols !== 4) {
      return;
    }

    return value.values;
  }.property('model.value.variant', 'model.value.value'),

  polygonsData: function() {
    var variant = this.get('model.value.variant.ident');
    if (!variant || variant !== 'list') {
      return;
    }

    return this.get('model.value.value.values');
  }.property('model.value.variant', 'model.value.value'),

  color: function() {
    var props = this.get('model.properties');
    return props.color || '#000000';
  }.property('model.properties'),
});
