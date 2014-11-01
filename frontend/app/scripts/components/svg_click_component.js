/* global App, Snap */

App.SvgClickComponent = Ember.Component.extend({
  tagName: 'g',
  
  click: function(event) {
    this.sendAction('mouseClick', event.pageX, event.pageY);
    return false;
  }
});
