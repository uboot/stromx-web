import Ember from "ember";

export default Ember.Component.extend({
  value: null,
  observer: null,
  tagName: 'tr',

  visualization: Ember.computed.alias('observer.visualization'),
  variant: Ember.computed.alias('value.variant.ident'),
  data: Ember.computed.alias('value.value'),

  isText: function() {
    var visualization = this.get('visualization');

    return visualization === 'value';
  }.property('visualization'),

  textData: function() {
    var data = this.get('data');
    var variant = this.get('variant');

    switch (variant) {
      case 'int':
      case 'float':
      case 'bool':
        return data;
      case 'matrix':
        return data.rows + ' x ' + data.cols + ' [' + data.values + ']';
      default:
        return null;
    }

    return data;
  }.property('data')
});
