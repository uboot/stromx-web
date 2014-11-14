import Ember from "ember";

export default Ember.ObjectController.extend({
  x1: function() {
    return this.get('model')[0];
  }.property(),
  y1: function() {
    return this.get('model')[1];
  }.property(),
  x2: function() {
    return this.get('model')[2];
  }.property(),
  y2: function() {
    return this.get('model')[3];
  }.property()
});