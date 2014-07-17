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
      sourcePos: connection.get('sourceConnector.operator.position'),
      targetPos: connection.get('targetConnector.operator.position')
    };

    Ember.RSVP.hash(promises).then( function(values) {
      if (values.inputs === undefined || values.outputs === undefined)
        return;
      if (values.inputs === null || values.outputs === null)
        return;

      if (values.sourcePos === undefined || values.sourcePos === undefined)
        return;
      if (values.targetPos === null || values.targetPos === null)
        return;

      var numInputs = values.inputs.get('length');
      var numOutputs = values.outputs.get('length');

      var sourceIndex = values.outputs.indexOf(values.sourceConnector);
      var targetIndex = values.inputs.indexOf(values.targetConnector);

      if (sourceIndex === -1 || targetIndex === -1)
        return;

      var x1 = values.sourcePos.x;
      var y1 = values.sourcePos.y;

      var x2 = values.targetPos.x;
      var y2 = values.targetPos.y;

      var targetOffset = 30 - 10 * numInputs;
      var sourceOffset = 30 - 10 * numOutputs;

      line.attr({
        x1: x1 + 60,
        y1: y1 + sourceOffset + 20 * sourceIndex + 5,
        x2: x2 - 10,
        y2: y2 + targetOffset + 20 * targetIndex + 5,
      });
    });
  }.observes('connection.sourceConnector.operator.position',
              'connection.targetConnector.operator.position'),

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
