import Ember from "ember";

export default Ember.Component.extend({
  value: null,
  observer: null,
  tagName: 'g',

  color: function() {
    var props = this.get('observer.properties');
    return props.color || '#000000';
  }.property('observer.properties'),

  visualization: Ember.computed.alias('observer.visualization'),
  variant: Ember.computed.alias('value.variant.ident'),
  data: Ember.computed.alias('value.value'),

  isList: Ember.computed.equal('variant', 'list'),

  svgType: function() {
    var visualization = this.get('visualization');
    var variant = this.get('variant');

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
      case 'image':
        return 'image';
      case 'line_segments':
        return 'lines';
      case 'polygon':
        return 'polygon';
      case 'polyline':
        return 'polyline';
      case 'points':
        return 'points';
      default:
        return '';
    }
  }.property('visualization', 'variant'),

  svgImage: Ember.computed.equal('svgType', 'image'),
  svgText: Ember.computed.equal('svgType', 'text'),
  svgLines: Ember.computed.equal('svgType', 'lines'),
  svgPolygon: Ember.computed.equal('svgType', 'polygon'),
  svgPolyline: Ember.computed.equal('svgType', 'polyline'),
  svgPoints: Ember.computed.equal('svgType', 'points'),

  imageData: function() {
    var variant = this.get('variant');
    if (! variant || variant !== 'image') {
      return;
    }
    var data = this.get('data');
    if (data === undefined) {
      return;
    }

    return data.values;
  }.property('variant', 'data'),

  imageWidth: function() {
    var variant = this.get('variant');
    if (! variant || variant !== 'image') {
      return;
    }

    var data = this.get('data');
    if (!data) {
      return;
    }

    return data.width;
  }.property('variant', 'data'),

  imageHeight: function() {
    var variant = this.get('variant');
    if (! variant || variant !== 'image') {
      return;
    }

    var data = this.get('data');
    if (!data) {
      return;
    }

    return data.height;
  }.property('variant', 'data'),

  textData: function() {
    var data = this.get('data');
    if (! data) {
      return;
    }

    return data;
  }.property('data'),

  matrixData4xN: function() {
    var variant = this.get('variant');
    if (! variant || variant !== 'matrix') {
      return;
    }

    var data = this.get('data');
    if (!data || data.cols !== 4) {
      return;
    }

    return data.values;
  }.property('variant', 'data'),

  matrixData2xN: function() {
    var variant = this.get('variant');
    if (! variant || variant !== 'matrix') {
      return;
    }

    var data = this.get('data');
    if (!data || data.cols !== 2) {
      return;
    }

    return data.values;
  }.property('variant', 'data'),

  listData: function() {
    var variant = this.get('variant');
    if (! variant || variant !== 'list') {
      return;
    }

    return this.get('data.values');
  }.property('variant', 'data'),

  pointsData: function() {
    var pts = '';

    if (this.get('variant') !== 'matrix') {
      return;
    }

    var data = this.get('data');
    if (! data || data.cols !== 2) {
      return;
    }

    var values = data.values;
    var length = values.length;
    for (var i = 0; i < length; i++) {
        pts += values[i][0] + ',' + values[i][1] + ' ';
    }

    return pts;
  }.property('variant', 'data'),
});
