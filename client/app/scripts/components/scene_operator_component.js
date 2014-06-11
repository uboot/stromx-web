/* global App, Snap */

App.SceneOperatorComponent = Ember.Component.extend({
  group: null,
  
  didInsertElement: function() {
    var paper = new Snap('#svg');
    var group = paper.group();
    this.set('group', group);
    
    var op = this.get('operator');
    var x = op.get('x');
    var y = op.get('y');
    var translation = new Snap.Matrix();
    translation.translate(x, y);
    group.transform(translation);
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
    var that = this;
    group.drag(function(dx, dy){
      that.move(dx, dy);
    }, function(){}, function(){});
  },
  
  willDestroyElement: function() {
    var group = this.get('group');
    if (group)
      group.remove();
    this.set('group', null);
  },
  
  move: function(dx, dy){
    var group = this.get('group');
    var op = this.get('operator');
    
    opX = op.get('x');
    opY = op.get('y');
    group.attr({
      transform: new Snap.Matrix().translate(opX + dx, opY + dy)
    });
  }
}); 
