import Ember from "ember";

export default Ember.Component.extend({
  value: null,
  observer: null,
  tagName: 'span',

  visualization: Ember.computed.alias('observer.visualization'),
  variant: Ember.computed.alias('value.variant.ident'),
  data: Ember.computed.alias('value.value'),
  isList: Ember.computed.equal('variant', 'list'),

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
      case 'string':
        return data;
      case 'matrix':
        return data.rows + ' x ' + data.cols + ' [' + data.values + ']';
      default:
        return null;
    }
  }.property('data'),

  listData: function() {
    var variant = this.get('variant');
    if (! variant || variant !== 'list') {
      return;
    }

    return this.get('data.values');
  }.property('variant', 'data')
});
