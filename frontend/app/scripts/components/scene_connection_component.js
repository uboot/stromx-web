/* global App, Snap */

require('scripts/controllers/scene_operator_component');

App.computeAngle = function (radius, height) {
  var c = Math.abs(height)/Math.abs(radius);
  var sin = Math.sqrt(c/2);
  return 2 * Math.asin(sin) * 180 / Math.PI;
};

App.computeWidth = function (height, angle) {
  var EPSILON = 0.1;
  if (Math.abs(height) < EPSILON)
    return 0.0;
  else
    return Math.abs(height) / Math.tan(angle / 2 / 180 * Math.PI);
};

App.drawArc = function (large, ccw, x, y) {
  var RADIUS = 1.5 * App.Constants.CONNECTOR_SIZE;
  var largeArcSweepFlag = large === 1 ? 1 : 0;
  var sweepFlag = ccw === 1 ? 0 : 1;
  return 'A' + RADIUS + ',' + RADIUS + ',0,' +
         largeArcSweepFlag + ',' + sweepFlag + ',' + x + ',' + y;
};

App.drawLine = function (x, y) {
  return 'L' + x + ',' + y;
};

App.computePath = function (x1, y1, x2, y2) {
  var RADIUS = 1.5 * App.Constants.CONNECTOR_SIZE;
  var ARC = 'A' + RADIUS + ',' + RADIUS + ',0,0,1';
  var EXTRA_HEIGHT = 20;

  var xDiff = x2 - x1;
  var yDiff = y2 - y1;
  var yOffset = 0;

  var angle = App.computeAngle(RADIUS, yDiff/2);
  var width = App.computeWidth(yDiff/2, angle);

  if (yDiff <= 0)
    yOffset = yDiff;

  // move to the starting point
  var path = 'M' + x1 + ',' + y1;

  if (xDiff > 0) {
    // the connections points forward
    if (xDiff > 2*RADIUS) {
      // start and end are so far from each other that the can
      // be directly connected (without loop)
      if (yDiff > 0) {
        // the connection points downwards
        if (Math.abs(yDiff) < 2*RADIUS) {
          // start and end point are so close too each other that
          // the arcs must be less than 90 degrees
          path += App.drawLine(x1 + xDiff/2 - width, y1);
          path += App.drawArc(0, 0, x1 + xDiff/2, y1 + yDiff / 2);
          path += App.drawArc(0, 1, x1 + xDiff/2 + width, y1 + yDiff);
        } else {
          // two 90 degree arcs are possible
          path += App.drawLine(x1 + xDiff/2 - RADIUS, y1);
          path += App.drawArc(0, 0, x1 + xDiff/2, y1 + RADIUS);
          path += App.drawLine(x1 + xDiff/2, y2 - RADIUS);
          path += App.drawArc(0, 1, x1 + xDiff/2 + RADIUS, y2);
        }
      } else {
        // the connection points upwards
        if(Math.abs(yDiff) < 2*RADIUS)
        {
          // start and end point are so close too each other that
          // the arcs must be less than 90 degrees
          path += App.drawLine(x1 + xDiff/2 - width, y1);
          path += App.drawArc(0, 1, x1 + xDiff/2, y1 + yDiff / 2);
          path += App.drawArc(0, 0, x1 + xDiff/2 + width, y1 + yDiff);
        }
        else
        {
          // two 90 degree arcs are possible
          path += App.drawLine(x1 + xDiff/2 - RADIUS, y1);
          path += App.drawArc(0, 1, x1 + xDiff/2, y1 - RADIUS);
          path += App.drawLine(x1 + xDiff/2, y2 + RADIUS);
          path += App.drawArc(0, 0, x1 + xDiff/2 + RADIUS, y2);
        }
      }
    } else {
      // start and end are so close to each other to each other
      // that the connections must have loop
      path += App.drawLine(x1 + xDiff/2, y1);
      path += App.drawArc(0, 1, x1 + xDiff/2 + RADIUS, y1 - RADIUS);
      path += App.drawLine(x1 + xDiff/2 + RADIUS, y1 + yOffset - RADIUS);
      path += App.drawArc(1, 1, x1 + xDiff/2 - RADIUS, y1 + yOffset - RADIUS);
      path += App.drawLine(x1 + xDiff/2 - RADIUS, y2 - RADIUS);
      path += App.drawArc(0, 1, x1 + xDiff/2, y2);
    }
  } else {
    // the connections points backward
    if (Math.abs(yDiff) > 4 * RADIUS) {
      // start and end are so far from each other that the can
      // be directly with a line between the two operators
      if (yDiff > 0) {
        // the connection points downwards
        path += App.drawArc(0, 0, x1 + RADIUS, y1 + RADIUS);
        path += App.drawLine(x1 + RADIUS, y1 + yDiff/2 - RADIUS);
        path += App.drawArc(0, 0, x1, y1 + yDiff/2);
        path += App.drawLine(x2, y1 + yDiff/2);
        path += App.drawArc(0, 1, x2 - RADIUS, y1 + yDiff/2 + RADIUS);
        path += App.drawLine(x2 - RADIUS, y2 - RADIUS);
        path += App.drawArc(0, 1, x2, y2);
      } else {
        // the connection points upwards
        path += App.drawArc(0, 1, x1 + RADIUS, y1 - RADIUS);
        path += App.drawLine(x1 + RADIUS, y1 + yDiff/2 + RADIUS);
        path += App.drawArc(0, 1, x1, y1 + yDiff/2);
        path += App.drawLine(x2, y1 + yDiff/2);
        path += App.drawArc(0, 0, x2 - RADIUS, y1 + yDiff/2 - RADIUS);
        path += App.drawLine(x2 - RADIUS, y2 + RADIUS);
        path += App.drawArc(0, 0, x2, y2);
      }
    } else {
      // start and end are so close to each other
      // that the connection must run around one of the operators
      path += App.drawArc(0, 1, x1 + RADIUS, y1 - RADIUS);
      path += App.drawLine(x1 + RADIUS, y1 - RADIUS + yOffset - EXTRA_HEIGHT);
      path += App.drawArc(0, 1, x1, y1 - 2*RADIUS + yOffset - EXTRA_HEIGHT);
      path += App.drawLine(x2, y1 - 2*RADIUS + yOffset - EXTRA_HEIGHT);
      path += App.drawArc(0, 1, x2 - RADIUS, y1 - RADIUS + yOffset - EXTRA_HEIGHT);
      path += App.drawLine(x2 - RADIUS, y2 - RADIUS);
      path += App.drawArc(0, 1, x2, y2);
    }
  }
  path += App.drawLine(x2, y2);

  return path;
};

App.SceneConnectionComponent = Ember.Component.extend({
  group: null,

  didInsertElement: function() {
    var paper = new Snap('#stream-svg');

    var connectionLine = paper.path();
    connectionLine.attr({
      class: 'stromx-svg-connection-path'
    });
    this.set('path', connectionLine);

    this.updateColor();
    this.updatePosition();
  },

  willDestroyElement: function() {
  },

  updatePosition: function() {
    var connection = this.get('connection');
    var path = this.get('path');

    var promises = {
      sourceConnector: connection.get('output'),
      targetConnector: connection.get('input'),
      sourceOpOutputs: connection.get('output.operator.outputs'),
      targetOpInputs: connection.get('input.operator.inputs'),
      sourcePos: connection.get('output.operator.position'),
      targetPos: connection.get('input.operator.position')
    };

    Ember.RSVP.hash(promises).then( function(values) {
      if (values.sourceOpOutputs === undefined || values.targetOpInputs === undefined)
        return;
      if (values.sourceOpOutputs === null || values.targetOpInputs === null)
        return;

      if (values.sourcePos === undefined || values.sourcePos === undefined)
        return;
      if (values.targetPos === null || values.targetPos === null)
        return;

      var outputs = values.sourceOpOutputs;
      var inputs = values.targetOpInputs;

      var numInputs = inputs.get('length');
      var numOutputs = outputs.get('length');

      var sourceIndex = outputs.indexOf(values.sourceConnector);
      var targetIndex = inputs.indexOf(values.targetConnector);

      if (sourceIndex === -1 || targetIndex === -1)
        return;

      var x1 = values.sourcePos.x;
      var y1 = values.sourcePos.y;

      var x2 = values.targetPos.x;
      var y2 = values.targetPos.y;

      var opCenter = (App.Constants.OPERATOR_SIZE +
                      App.Constants.CONNECTOR_SIZE) / 2;
      var targetOffset = opCenter - App.Constants.CONNECTOR_SIZE * numInputs;
      var sourceOffset = opCenter - App.Constants.CONNECTOR_SIZE * numOutputs;

      x1 += App.Constants.OPERATOR_SIZE + App.Constants.CONNECTOR_SIZE;
      y1 += sourceOffset + 2 * App.Constants.CONNECTOR_SIZE * sourceIndex + App.Constants.CONNECTOR_SIZE / 2;
      x2 += -App.Constants.CONNECTOR_SIZE;
      y2 += targetOffset + 2 * App.Constants.CONNECTOR_SIZE * targetIndex + App.Constants.CONNECTOR_SIZE / 2;

      path.attr({
        d: App.computePath(x1, y1, x2, y2)
      });
    });
  }.observes('connection.output.operator.position',
             'connection.input.operator.position'),

  updateColor: function() {
    var path = this.get('path');
    var thread = this.get('connection.thread');

    path.attr({
      stroke: '#cccccc'
    });
    if (thread === null)
      return;

    thread.then( function(thread) {
      if (thread === null)
        return;

      var color = thread.get('color');

      path.attr({
        stroke: color
      });
    });
  }.observes('connection.thread.color')
});
