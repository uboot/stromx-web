import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'g',
  transform: function() {
    var cx = this.get('model')[0];
    var cy = this.get('model')[1];
    var angle = this.get('model')[4];

    return 'rotate(' + angle + ' ' + cx + ' ' + cy + ')';
  }.property(''),
  x: function() {
    return this.get('model')[0] - this.get('width')/2;
  }.property(),
  y: function() {
    return this.get('model')[1] - this.get('height')/2;
  }.property(),
  width: function() {
    return this.get('model')[2];
  }.property(),
  height: function() {
    return this.get('model')[3];
  }.property()
});
