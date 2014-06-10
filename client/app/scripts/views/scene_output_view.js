/* global App, Snap */

App.SceneOutputView = Ember.View.extend({
  
  didInsertElement: function() {
    var paper = new Snap('#svg');
    
    var op = this.content.get('operator');
    var x = op.get('x');
    var y = op.get('y');
    var pos = this.content.get('position');
    var numConnectors = op.get('outputs').get('length');
    var offset = 30 - 10 * numConnectors;
    
    var inputRect = paper.rect(x + 50, y + offset + 20 * pos, 10, 10);
    inputRect.attr({
      class: 'stromx-svg-output-rect'
    });
  },
  
  willDestroyElement: function() {
    var rect = this.get('rect');
    if (rect)
      rect.remove();
    this.set('rect', null);
  }
});