import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'g',
  x1: function() {
    return this.get('model')[0];
  }.property('model'),
  y1: function() {
    return this.get('model')[1];
  }.property('model'),
  x2: function() {
    return this.get('model')[2];
  }.property('model'),
  y2: function() {
    return this.get('model')[3];
  }.property('model')
});
