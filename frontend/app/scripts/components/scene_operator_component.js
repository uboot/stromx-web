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

    var opRect = paper.rect(0, 0,
                            App.Constants.OPERATOR_SIZE, 
                            App.Constants.OPERATOR_SIZE,
                            App.Constants.OPERATOR_RADIUS,
                            App.Constants.OPERATOR_RADIUS);
    opRect.attr({
      class: 'stromx-svg-operator-rect'
    });

    opRect.drag(
      this.moveOperatorDrag,
      this.startOperatorDrag,
      this.endOperatorDrag,
      this, this, this
    );
    opRect.click(this.onClick, this);
    
    group.add(opRect);
    
    this.updateName();
    this.updateConnectors();
    this.updatePosition();
  },

  willDestroyElement: function() {
    var group = this.get('group');
    if (group)
      group.remove();
    this.set('group', null);
  },
  
  updateName: function() {
    var paper = new Snap('#stream-svg');
    var group = this.get('group');
    var op = this.get('operator');
    var name = op.get('name');
    var opName = paper.text(25, 65, name);
    opName.attr({
      class: 'stromx-svg-operator-name'
    });
    group.add(opName);
  }.observes('operator.name'),
  
  updateConnectors: function() {
    var group = this.get('group');
    var op = this.get('operator');
    var _this = this;
    
    op.get('inputs').then(function(inputs) {
      var numConnectors = inputs.get('length');
      var opCenter = (App.Constants.OPERATOR_SIZE +
                      App.Constants.CONNECTOR_SIZE) / 2;
      var offset = opCenter - App.Constants.CONNECTOR_SIZE * numConnectors;

      inputs.map( function(input, index) {
        var paper = new Snap('#stream-svg');
        var x = - App.Constants.CONNECTOR_SIZE;
        var y = offset + 2 * App.Constants.CONNECTOR_SIZE * index;

        var inputRect = paper.rect(x, y,
                                   App.Constants.CONNECTOR_SIZE,
                                   App.Constants.CONNECTOR_SIZE);
        inputRect.attr({
          class: 'stromx-svg-input-rect'
        });
        inputRect.drag(
          _this.moveConnectorDrag,
          _this.startConnectorDrag,
          _this.endConnectorDrag,
          _this, _this, _this
        );
        group.add(inputRect);
      });
    });

    op.get('outputs').then(function(outputs) {
      var numConnectors = outputs.get('length');
      var opCenter = (App.Constants.OPERATOR_SIZE +
                      App.Constants.CONNECTOR_SIZE) / 2;
      var offset = opCenter - App.Constants.CONNECTOR_SIZE * numConnectors;

      outputs.map( function(output, index) {
        var paper = new Snap('#stream-svg');
        var x = App.Constants.OPERATOR_SIZE;
        var y = offset + 2 * App.Constants.CONNECTOR_SIZE * index;

        var outputRect = paper.rect(x, y, App.Constants.CONNECTOR_SIZE,
                                    App.Constants.CONNECTOR_SIZE);
        outputRect.attr({
          class: 'stromx-svg-output-rect'
        });
        outputRect.drag(
          _this.moveConnectorDrag,
          _this.startConnectorDrag,
          _this.endConnectorDrag,
          _this, _this, _this
        );
        group.add(outputRect);
      });
    });
  }.observes('operator.inputs', 'operator.outputs'),

  updatePosition: function() {
    var op = this.get('operator');
    var pos = op.get('position');
    
    if (pos === undefined)
      return;
      
    var translation = new Snap.Matrix();
    translation.translate(pos.x, pos.y);

    var group = this.get('group');
    group.transform(translation);
  }.observes('operator.position'),

  startOperatorDrag: function(x, y) {
    var paper = new Snap('#stream-svg');
    var transform = paper.node.getScreenCTM().inverse();
    var point = paper.node.createSVGPoint()
    point.x = x;
    point.y = y;
    point = point.matrixTransform(transform);
    
    var opPos = this.get('operator.position');
    this.set('dragOffset', {
      x: point.x - opPos.x,
      y: point.y - opPos.y
    });
  },

  moveOperatorDrag: function(dx, dy, x, y) {
    var paper = new Snap('#stream-svg');
    var transform = paper.node.getScreenCTM().inverse();
    var point = paper.node.createSVGPoint()
    point.x = x;
    point.y = y;
    point = point.matrixTransform(transform);
    
    var dragOffset = this.get('dragOffset');
    var pos = {
      x: point.x - dragOffset.x,
      y: point.y - dragOffset.y
    };
    
    var op = this.get('operator');
    op.set('position', pos);
  },

  endOperatorDrag: function(dx, dy){
    var op = this.get('operator');
    op.send('save');
  },

  startConnectorDrag: function(x, y) {
    var paper = new Snap('#stream-svg');
    var connection = paper.line();
    var transform = connection.node.getScreenCTM().inverse();
    var point = paper.node.createSVGPoint()
    point.x = x;
    point.y = y;
    point = point.matrixTransform(transform);
    connection.attr({
      stroke: '#cccccc',
      x1: point.x,
      y1: point.y,
      x2: point.x,
      y2: point.y
    });
    
    this.set('connection', connection);
  },

  moveConnectorDrag: function(dx, dy, x, y) {
    var paper = new Snap('#stream-svg');
    var connection = this.get('connection');
    var transform = connection.node.getScreenCTM().inverse();
    var point = paper.node.createSVGPoint(x, y).matrixTransform(transform);
    point.x = x;
    point.y = y;
    point = point.matrixTransform(transform);
    connection.attr({
      x2: point.x,
      y2: point.y
    });
  },

  endConnectorDrag: function(dx, dy){
    var connection = this.get('connection');
    connection.remove();
  },
  
  onClick: function(event) {
    var op = this.get('operator');
    op.send('showContextMenu', 'operatorMenu', event, op);
    return false;
  }
});
