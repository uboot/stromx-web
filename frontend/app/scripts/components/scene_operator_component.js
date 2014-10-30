/* global App, Snap */

App.Constants = {
  OPERATOR_SIZE: 50,
  OPERATOR_RADIUS: 5,
  CONNECTOR_SIZE: 10
};

App.SceneOperatorComponent = Ember.Component.extend({
  group: null,

  didInsertElement: function() {
    var paper = new Snap('#stream-svg');
    var group = paper.group();
    this.set('group', group);

    this.updateOperator();
  },

  updateOperator: function() {
    var group = this.get('group');
    if (group)
      group.remove();

    var paper = new Snap('#stream-svg');
    group = paper.group();
    this.set('group', group);

    var op = this.get('operator');
    var name = op.get('name');
    var opName = paper.text(25, 65, name);
    opName.attr({
      class: 'stromx-svg-operator-name'
    });
    var opRect = paper.rect(0, 0,
                            App.Constants.OPERATOR_SIZE, 
                            App.Constants.OPERATOR_SIZE,
                            App.Constants.OPERATOR_RADIUS,
                            App.Constants.OPERATOR_RADIUS);
    opRect.attr({
      class: 'stromx-svg-operator-rect'
    });
    group.add(opName, opRect);

    op.get('inputs').then(function(inputs) {
      var numConnectors = inputs.get('length');
      var opCenter = (App.Constants.OPERATOR_SIZE +
                      App.Constants.CONNECTOR_SIZE) / 2;
      var offset = opCenter - App.Constants.CONNECTOR_SIZE * numConnectors;

      inputs.map( function(input, index) {
        var x = - App.Constants.CONNECTOR_SIZE;
        var y = offset + 2 * App.Constants.CONNECTOR_SIZE * index;

        var inputRect = paper.rect(x, y,
                                   App.Constants.CONNECTOR_SIZE,
                                   App.Constants.CONNECTOR_SIZE);
        inputRect.attr({
          class: 'stromx-svg-input-rect'
        });
        group.add(inputRect);
      });
    });

    op.get('outputs').then(function(outputs) {
      var numConnectors = outputs.get('length');
      var opCenter = (App.Constants.OPERATOR_SIZE +
                      App.Constants.CONNECTOR_SIZE) / 2;
      var offset = opCenter - App.Constants.CONNECTOR_SIZE * numConnectors;

      outputs.map( function(output, index) {
        var x = App.Constants.OPERATOR_SIZE;
        var y = offset + 2 * App.Constants.CONNECTOR_SIZE * index;

        var outputRect = paper.rect(x, y,
                                   App.Constants.CONNECTOR_SIZE,
                                   App.Constants.CONNECTOR_SIZE);
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
    group.click( function(event) {
      _this.onClick(event);
    });

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
    var pos = op.get('position');
    var translation = new Snap.Matrix();
    translation.translate(pos.x, pos.y);

    var group = this.get('group');
    group.transform(translation);
  }.observes('operator.position'),

  startDrag: function(x, y) {
    var op = this.get('operator');

    this.set('startDragPos', op.get('position'));
  },

  moveDrag: function(dx, dy){
    var group = this.get('group');
    var op = this.get('operator');

    var startDragPos = this.get('startDragPos');
    var pos = {
      x: startDragPos.x + dx,
      y: startDragPos.y + dy
    };
    op.set('position', pos);
  },

  endDrag: function(dx, dy){
    var op = this.get('operator');
    op.send('save');
  },
  
  onClick: function(event) {
    var op = this.get('operator');
    op.send('showContextMenu', 'operatorMenu', event, op);
    return false;
  }
});
