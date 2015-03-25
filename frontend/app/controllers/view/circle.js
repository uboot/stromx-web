import Ember from "ember";

export default Ember.Controller.extend({
  cx: function() {
    return this.get('model')[0];
  }.property(),
  cy: function() {
    return this.get('model')[1];
  }.property()
});