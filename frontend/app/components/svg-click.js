import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'g',

  click: function(event) {
    this.sendAction('mouseClick', event.pageX, event.pageY);
    return false;
  }
});
