import Ember from "ember";

export default Ember.ObjectController.extend({
  svgType: function() {
    var visualization = this.get('visualization');
    var variant = this.get('value.variant.ident');

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
        return '';
    }
  }.property('visualization', 'value.variant'),

  svgImage: Ember.computed.equal('svgType', 'image'),
  svgText: Ember.computed.equal('svgType', 'text'),
  svgLines: Ember.computed.equal('svgType', 'lines'),

  imageData: function() {
    var variant = this.get('value.variant.ident');
    if (!variant || variant !== 'image') {
      return;
    }
    var value = this.get('value.value');
    if (value === undefined) {
      return;
    }

    return value.values;
  }.property('value.variant', 'value.value'),

  imageWidth: function() {
    var variant = this.get('value.variant.ident');
    if (!variant || variant !== 'image') {
      return;
    }

    var value = this.get('value.value');
    if (!value) {
      return;
    }

    return value.width;
  }.property('value.variant', 'value.value'),

  imageHeight: function() {
    var variant = this.get('value.variant.ident');
    if (!variant || variant !== 'image') {
      return;
    }

    var value = this.get('value.value');
    if (!value) {
      return;
    }

    return value.height;
  }.property('value.variant', 'value.value'),

  textData: function() {
    var value = this.get('value.value');
    if (!value) {
      return;
    }

    return value;
  }.property('value.value'),

  linesData: function() {
    var variant = this.get('value.variant.ident');
    if (!variant || variant !== 'matrix') {
      return;
    }

    var value = this.get('value.value');
    if (!value || value.cols !== 4) {
      return;
    }

    return value.values;
  }.property('value.variant', 'value.value'),

  color: function() {
    var props = this.get('properties');
    return props.color || '#000000';
  }.property('properties'),
});
