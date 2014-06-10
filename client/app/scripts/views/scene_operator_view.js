/* global App,  Snap */

App.SceneOperatorView = Ember.View.extend({
  group: null,
    
  templateName: "scene-operator",
  
  didInsertElement: function() {
    var paper = new Snap('#svg');
    var group = paper.group();
    this.set('group', group);
    
    var x = this.content.get('x');
    var y = this.content.get('y');
    var translation = new Snap.Matrix();
    translation.translate(x, y);
    group.transform(translation);
    var name = this.content.get('name');
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
    group = this.get('group');
    opX = this.content.get('x');
    opY = this.content.get('y');
    group.attr({
      transform: new Snap.Matrix().translate(opX + dx, opY + dy)
    });
  }
});