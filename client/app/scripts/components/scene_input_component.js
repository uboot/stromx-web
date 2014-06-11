/* global App, Snap */

App.SceneInputComponent = Ember.Component.extend({
  rect: null,
  line: null,
  
  didInsertElement: function() {
    var paper = new Snap('#svg');
    
    var input = this.get('input');
    var op = input.get('operator');
    var x = op.get('x');
    var y = op.get('y');
    var pos = input.get('position');
    var numConnectors = op.get('inputs').get('length');
    var offset = 30 - 10 * numConnectors;
    var x1 = x - 10;
    var y1 = y + offset + 20 * pos
    
    var inputRect = paper.rect(x1, y1, 10, 10);
    inputRect.attr({
      class: 'stromx-svg-input-rect'
    });
    this.set('rect', inputRect);
    
    var pos = input.get('sourcePosition');
    var that = this;
    input.get('sourceOperator').then(function(ops){
      ops.map(function(op){
      var x = op.get('x');
      var y = op.get('y');
        op.get('outputs').then(function(outputs){
          var numConnectors = outputs.get('length');
          var offset = 30 - 10 * numConnectors;
          var x2 = x + 50;
          var y2 = y + offset + 20 * pos;
          
          var connectionLine = paper.line(x1 + 5, y1 + 5, x2 + 5, y2 + 5);
          connectionLine.attr({
            class: 'stromx-svg-connection-line'
          });
          that.set('line', connectionLine);
        })
      });
    });
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
  }
});