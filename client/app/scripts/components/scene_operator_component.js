/* global App, Snap */

App.SceneOperatorComponent = Ember.Component.extend({
  group: null,
  
  didInsertElement: function() {
    var paper = new Snap('#svg');
    var group = paper.group();
    this.set('group', group);
    
    var op = this.get('operator');
    var name = op.get('name');
    var opName = paper.text(25, 65, name);
    opName.attr({
      class: 'stromx-svg-operator-name'
    });
    var opRect = paper.rect(0, 0, 50, 50, 5, 5);
    opRect.attr({
      class: 'stromx-svg-operator-rect'
    });
    group.add(opName, opRect);
    var _this = this;
    group.drag(
      function(dx, dy) { _this.moveDrag(dx, dy); },
      function(x, y) { _this.startDrag(x, y); },
      function(){}
    );
    
    this.updatePosition();
  },
  
  willDestroyElement: function() {
    var group = this.get('group');
    if (group)
      group.remove();
    this.set('group', null);
  },
  
  updatePosition: function() {
    var op = this.get('operator');
    var x = op.get('x');
    var y = op.get('y');
    var translation = new Snap.Matrix();
    translation.translate(x, y);
    
    var group = this.get('group');
    group.transform(translation);
  }.observes('operator.x', 'operator.y'),
  
  startDrag: function(x, y) {
    var op = this.get('operator');
    
    this.set('startDragX', op.get('x'));
    this.set('startDragY', op.get('y'));
  },
  
  moveDrag: function(dx, dy){
    var group = this.get('group');
    var op = this.get('operator');
    
    x = this.get('startDragX');
    y = this.get('startDragY');
    op.set('x', x + dx);
    op.set('y', y + dy);
  }
}); 
