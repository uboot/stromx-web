/* global App, Snap */

App.SceneConnectionComponent = Ember.Component.extend({
  group: null,

  didInsertElement: function() {
    var paper = new Snap('#stream-svg');

    var connectionLine = paper.line(0, 0, 0, 0);
    connectionLine.attr({
      class: 'stromx-svg-connection-line'
    });
    this.set('line', connectionLine);

    this.updateColor();
    this.updatePosition();
  },

  willDestroyElement: function() {
  },

  updatePosition: function() {
    var connection = this.get('connection');
    var line = this.get('line');
    var sourcePosition = connection.get('sourcePosition');
    var targetPosition = connection.get('targetPosition');
    var operatorPromises = {
      sourceOperator: connection.get('sourceOperator'),
      targetOperator: connection.get('targetOperator')
    };
    Ember.RSVP.hash(operatorPromises).then( function(hash){
      var sourceOperator = hash.sourceOperator;
      var targetOperator = hash.targetOperator;
      var x1 = sourceOperator.get('x');
      var y1 = sourceOperator.get('y');
      var x2 = targetOperator.get('x');
      var y2 = targetOperator.get('y');

      var connectorPromises = {
        inputs: targetOperator.get('inputs'),
        outputs: sourceOperator.get('outputs')
      };

      Ember.RSVP.hash(connectorPromises).then( function(hash){
        var inputs = hash.inputs;
        var outputs = hash.outputs;
        var numInputs = inputs.get('length');
        var numOutputs = outputs.get('length');

        var targetOffset = 30 - 10 * numInputs;
        var sourceOffset = 30 - 10 * numOutputs;

        if(sourceOffset === undefined || targetOffset === undefined ||
           sourcePosition === undefined || targetPosition === undefined)
        {
          return;
        }

        line.attr({
          x1: x1 + 60,
          y1: y1 + sourceOffset + 20 * sourcePosition + 5,
          x2: x2 - 10,
          y2: y2 + targetOffset + 20 * targetPosition + 5,
        });
      });

    });
  }.observes('connection.sourceOperator.x', 'connection.sourceOperator.y',
              'connection.targetOperator.x', 'connection.targetOperator.y'),

  updateColor: function() {
    var line = this.get('line');
    var thread = this.get('connection.thread');

    line.attr({
      stroke: '#cccccc'
    });
    if (thread === null)
      return;

    thread.then( function(thread) {
      var color = thread.get('color');

      line.attr({
        stroke: color
      });
    });
  }.observes('connection.thread.color')
});
