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

    var promises = {
      sourceConnector: connection.get('sourceConnector'),
      targetConnector: connection.get('targetConnector'),
      outputs: connection.get('sourceConnector.operator.outputs'),
      inputs: connection.get('targetConnector.operator.inputs'),
      x1: connection.get('sourceConnector.operator.x'),
      y1: connection.get('sourceConnector.operator.y'),
      x2: connection.get('targetConnector.operator.x'),
      y2: connection.get('targetConnector.operator.y')
    };

    Ember.RSVP.hash(promises).then( function(values) {
      if (values.inputs === undefined || values.outputs === undefined)
        return;
      if (values.inputs === null || values.outputs === null)
        return;

      if (values.x1 === undefined || values.y1 === undefined)
        return;
      if (values.x1 === null || values.y1 === null)
        return;

      var numInputs = values.inputs.get('length');
      var numOutputs = values.outputs.get('length');

      var sourcePos = values.outputs.indexOf(values.sourceConnector);
      var targetPos = values.inputs.indexOf(values.targetConnector);

      if (targetPos === -1 || sourcePos === -1)
        return;

      var x1 = values.x1;
      var y1 = values.y1;

      var x2 = values.x2;
      var y2 = values.y2;

      var targetOffset = 30 - 10 * numInputs;
      var sourceOffset = 30 - 10 * numOutputs;

      line.attr({
        x1: x1 + 60,
        y1: y1 + sourceOffset + 20 * sourcePos + 5,
        x2: x2 - 10,
        y2: y2 + targetOffset + 20 * targetPos + 5,
      });
    });
  }.observes('connection.sourceConnector.operator.x',
              'connection.sourceConnector.operator.y',
              'connection.targetConnector.operator.x',
              'connection.targetConnector.operator.y'),

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
