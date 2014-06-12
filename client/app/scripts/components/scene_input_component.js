/* global App, Snap */

App.SceneInputComponent = Ember.Component.extend({
  rect: null,
  line: null,
  
  didInsertElement: function() {
    var paper = new Snap('#svg');
    
    var inputRect = paper.rect(0, 0, 10, 10);
    inputRect.attr({
      class: 'stromx-svg-input-rect'
    });
    this.set('rect', inputRect);
    
    var connectionLine = paper.line(0, 0, 0, 0);
    connectionLine.attr({
      class: 'stromx-svg-connection-line'
    });
    this.set('line', connectionLine);
          
    this.updatePosition();
  },
  
  willDestroyElement: function() {
    var rect = this.get('rect');
    if (rect)
      rect.remove();
    this.set('rect', null);
    
    var line = this.get('line');
    if (line)
      line.remove();
    this.set('line', null);
  },
  
  updatePosition: function() {
    var input = this.get('input');
    var op = input.get('operator');
    var pos = input.get('position');
    var numConnectors = op.get('inputs').get('length');
    var offset = 30 - 10 * numConnectors;
    var x1 = op.get('x') - 10;
    var y1 = op.get('y') + offset + 20 * pos;
    
    var rect = this.get('rect');
    rect.attr({
      x: x1,
      y: y1
    });
    
    var sourcePos = input.get('sourcePosition');
    var that = this;
    input.get('sourceOperator').then(function(ops){
      ops.map(function(op){
      var x = op.get('x');
      var y = op.get('y');
        op.get('outputs').then(function(outputs){
          var numConnectors = outputs.get('length');
          var offset = 30 - 10 * numConnectors;
          var x2 = x + 50;
          var y2 = y + offset + 20 * sourcePos;
          
          var line = that.get('line');
          line.attr({
            x1: x1 + 5,
            y1: y1 + 5,
            x2: x2 + 5,
            y2: y2 + 5
          });
        });
      });
    });
    
  }.observes('input.operator.x', 'input.operator.y',
             'input.sourceOperator.@each.x', 'input.sourceOperator.@each.y')
});