import Ember from "ember";

export default Ember.Controller.extend({
  x: function() {
    return this.get('model')[0];
  }.property(),
  y: function() {
    return this.get('model')[1];
  }.property(),
  width: function() {
    return this.get('model')[2];
  }.property(),
  height: function() {
    return this.get('model')[3];
  }.property()
});
