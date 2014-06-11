/* global App, Snap */

App.SceneOutputComponent = Ember.Component.extend({
  rect: null,
  didInsertElement: function() {
    var paper = new Snap('#svg');
    
    var outputRect = paper.rect(0, 0, 10, 10);
    outputRect.attr({
      class: 'stromx-svg-output-rect'
    });
    this.set('rect', outputRect);
    
    this.updatePosition();
  },
  
  willDestroyElement: function() {
    var rect = this.get('rect');
    if (rect)
      rect.remove();
    this.set('rect', null);
  },
  
  updatePosition: function() {
    var output = this.get('output');
    var op = output.get('operator');
    var x = op.get('x');
    var y = op.get('y');
    var pos = output.get('position');
    var numConnectors = op.get('outputs').get('length');
    var offset = 30 - 10 * numConnectors;
    
    var rect = this.get('rect');
    rect.attr({
      x: x + 50,
      y: y + offset + 20 * pos
    });
  }.observes('output.operator.x', 'output.operator.y')
});