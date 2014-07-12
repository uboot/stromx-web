/* global App, Snap */

App.SceneOperatorComponent = Ember.Component.extend({
  group: null,

  didInsertElement: function() {
    var paper = new Snap('#stream-svg');
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

    op.get('inputs').then( function(inputs) {
      var numConnectors = inputs.get('length');
      var offset = 30 - 10 * numConnectors;

      inputs.map( function(input, index) {
        var x = -10;
        var y = offset + 20 * index;

        var inputRect = paper.rect(x, y, 10, 10);
        inputRect.attr({
          class: 'stromx-svg-input-rect'
        });
        group.add(inputRect);
      });
    });

    op.get('outputs').then( function(outputs) {
      var numConnectors = outputs.get('length');
      var offset = 30 - 10 * numConnectors;

      outputs.map( function(output, index) {
        var x = 50;
        var y = offset + 20 * index;

        var outputRect = paper.rect(x, y, 10, 10);
        outputRect.attr({
          class: 'stromx-svg-input-rect'
        });
        group.add(outputRect);
      });
    });

    var _this = this;
    group.drag(
      function(dx, dy) { _this.moveDrag(dx, dy); },
      function(x, y) { _this.startDrag(x, y); },
      function(){ _this.endDrag(); }
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

    var x = this.get('startDragX');
    var y = this.get('startDragY');
    op.set('x', x + dx);
    op.set('y', y + dy);
  },

  endDrag: function(dx, dy){
    var op = this.get('operator');
    op.send('save');
  }
});
