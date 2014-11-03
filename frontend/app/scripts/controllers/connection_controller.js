/* global App */

require('scripts/controllers/operator_controller');

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
  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined)
    return 'M0,0';

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

App.ConnectionController = Ember.ObjectController.extend({
  x1: function(key, value) {
    var pos = this.get('output.operator.position');

    if (pos === undefined)
      return;

    return pos.x + App.Constants.OPERATOR_SIZE + App.Constants.CONNECTOR_SIZE;
  }.property('output.operator.position'),

  y1: function(key, value) {
    if (value !== undefined)
      return value;

    var _this = this;
    var promise = this.get('output').then(function(connector) {
      if (connector === null)
        return;

      var connectorController = App.OutputController.create({
        model: connector
      });

      var pos = connector.get('operator.position');
      var y = pos.y + connectorController.get('y') + App.Constants.CONNECTOR_SIZE / 2;
      _this.set('y1', y);
    });
  }.property('output.operator.position'),

  x2: function(key, value) {
    var pos = this.get('input.operator.position');

    if (pos === undefined)
      return;

    return pos.x - App.Constants.CONNECTOR_SIZE;
  }.property('input.operator.position'),

  y2: function(key, value) {
    if (value !== undefined)
      return value;

    var _this = this;
    var promise = this.get('input').then(function(connector) {
      if (connector === null)
        return;

      var connectorController = App.InputController.create({
        model: connector
      });

      var pos = connector.get('operator.position');
      var y = pos.y + connectorController.get('y') + App.Constants.CONNECTOR_SIZE / 2;
      _this.set('y2', y);
    });
  }.property('input.operator.position'),

  path: function() {
    return App.computePath(this.get('x1'), this.get('y1'), this.get('x2'), this.get('y2'));
  }.property('x1', 'x2', 'y1', 'y2'),

  color: Ember.computed.alias('thread.color'),
  noColor: Ember.computed.empty('thread.color'),
  
  actions: {
    showMenu: function(x, y) {
      this.send('showContextMenu', 'connectionMenu', x, y, this);
    },
    remove: function() {
      var model = this.get('model');
      model.deleteRecord();
      model.save();
    },
    setThread: function(thread) {
      this.set('thread', thread);
      var model = this.get('model');
      model.save();
    }
  }
});
