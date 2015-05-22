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
        case 'image':
          return 'image';
        default:
          return '';
      }
    }

    switch (visualization) {
      case 'image':
      case 'polygon':
      case 'polyline':
      case 'points':
      case 'rectangle':
      case 'rotated_rectangle':
        return visualization;
      case 'line_segments':
        return 'lines';
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
  svgRectangle: Ember.computed.equal('svgType', 'rectangle'),
  svgRotatedRectangle: Ember.computed.equal('svgType', 'rotated_rectangle'),

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

  matrixDataNx4: function() {
    return this.getMatrixData(4);
  }.property('variant', 'data'),

  matrixDataNx2: function() {
    return this.getMatrixData(2);
  }.property('variant', 'data'),

  matrixDataNx5: function() {
    return this.getMatrixData(5);
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

  getMatrixData: function(numCols) {
    var variant = this.get('variant');
    if (! variant || variant !== 'matrix') {
      return;
    }

    var data = this.get('data');
    if (!data || data.cols !== numCols) {
      return;
    }

    return data.values;
  }
});
