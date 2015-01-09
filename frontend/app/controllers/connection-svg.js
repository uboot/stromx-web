import Ember from "ember";

import { Constant } from 'stromx-web/controllers/operator-svg';
import OutputController from 'stromx-web/controllers/output-svg';
import InputController from 'stromx-web/controllers/input-svg';

export default Ember.ObjectController.extend({
  x1: function() {
    var pos = this.get('output.operator.position');

    if (pos === undefined) {
      return;
    }

    return pos.x + Constant.OPERATOR_SIZE + Constant.CONNECTOR_SIZE;
  }.property('output.operator.position'),

  y1: function(key, value) {
    if (value !== undefined) {
      return value;
    }

    var _this = this;
    this.get('output').then(function(connector) {
      if (connector === null) {
        return;
      }

      var connectorController = OutputController.create({
        model: connector
      });

      var pos = connector.get('operator.position');
      if (pos === undefined) {
        return;
      }
      var y = pos.y + connectorController.get('y') + Constant.CONNECTOR_SIZE / 2;
      _this.set('y1', y);
    });
  }.property('output.operator.position'),

  x2: function() {
    var pos = this.get('input.operator.position');

    if (pos === undefined) {
      return;
    }

    return pos.x - Constant.CONNECTOR_SIZE;
  }.property('input.operator.position'),

  y2: function(key, value) {
    if (value !== undefined) {
      return value;
    }

    var _this = this;
    this.get('input').then(function(connector) {
      if (connector === null) {
        return;
      }

      var connectorController = InputController.create({
        model: connector
      });

      var pos = connector.get('operator.position');
      var y = pos.y + connectorController.get('y') + Constant.CONNECTOR_SIZE / 2;
      _this.set('y2', y);
    });
  }.property('input.operator.position'),

  path: function() {
    return computePath(this.get('x1'), this.get('y1'), this.get('x2'), this.get('y2'));
  }.property('x1', 'x2', 'y1', 'y2'),

  color: function(key, value) {
    if (value !== undefined) {
      return value;
    }

    var _this = this;
    this.get('thread').then(function(thread) {
      if (thread === null) {
        _this.set('color', '#808080');
      }
      else {
        _this.set('color', thread.get('color'));
      }
    });
  }.property('thread.color'),

  displayStartArrow: false,
  displayCenterArrow: false,
  displayEndArrow: false,

  startArrowTransform: '',
  centerArrowTransform: '',
  endArrowTransform: '',

  updateArrows: function() {
    var x1 = this.get('x1');
    var y1 = this.get('y1');
    var x2 = this.get('x2');
    var y2 = this.get('y2');

    if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
      return;
    }

    var ARROW_LENGTH = 2 * Constant.CONNECTOR_SIZE;
    var RADIUS = 1.5 * Constant.CONNECTOR_SIZE;
    var ARC_RECT_SIZE = 2*RADIUS;
    var EXTRA_HEIGHT = 20;

    var xDiff = x2 - x1;
    var yDiff = y2 - y1;
    var yOffset = 0;

    if (yDiff <= 0) {
      yOffset = yDiff;
    }

    // hide all arrows
    this.set('displayStartArrow', false);
    this.set('displayCenterArrow', false);
    this.set('displayEndArrow', false);

    var transform = '';
    if (xDiff > 0) {
      // the connections points forward

      if (xDiff > 2*RADIUS) {
        // start and end are so far from each other that the can
        // be directly connected (without loop)

        if (xDiff > 2*RADIUS + 2*ARROW_LENGTH) {
          this.set('displayStartArrow', true);
          transform = translate(x1 + (xDiff - 2*RADIUS)/4, y1);
          this.set('startArrowTransform', transform);

          this.set('displayEndArrow', true);
          transform = translate(x2 - (xDiff - 2*RADIUS)/4, y2);
          this.set('endArrowTransform', transform);
        }

        if(Math.abs(yDiff) > 2*RADIUS + ARROW_LENGTH)
        {
          // start and end point are so far from each other that a
          // center arrow can be drawn
          this.set('displayCenterArrow', true);
          transform = translate(x1 + xDiff/2, y1 + yDiff/2);

          if(yDiff > 0) { // the connection points downwards
            transform += rotate(90);
          } else { // the connection points upwards
            transform += rotate(-90);
          }
          this.set('centerArrowTransform', transform);
        }
      } else {
        // start and end are so close to each other to each other
        // that the connections must have loop
        if(Math.abs(yDiff) > ARROW_LENGTH)
        {
          if(yOffset < 0)
          {
            this.set('displayStartArrow', true);
            transform = translate(x1 + xDiff/2 + RADIUS, y1 - RADIUS + yDiff/2);
            transform += rotate(-90);
            this.set('startArrowTransform', transform);
          } else {
            this.set('displayEndArrow', true);
            transform = translate(x1 + xDiff/2 - RADIUS, y1 - RADIUS + yDiff/2);
            transform += rotate(90);
            this.set('endArrowTransform', transform);
          }
        }
      }
    } else { // the connections points backward
      // the backward section is long enough to display an arrow
      if(Math.abs(xDiff) > ARROW_LENGTH) {
        this.set('displayCenterArrow', true);
      }

      if(Math.abs(yDiff) > 4*RADIUS)
      {
        // start and end are so far from each other that the can
        // be directly with a line between the to operators
        if(Math.abs(yDiff) > 4*RADIUS + 2*ARROW_LENGTH)
        {
          this.set('displayStartArrow', true);

          transform = translate(x1 + RADIUS, y1 + yDiff/4);
          if(yDiff > 0) {
            transform += rotate(90);
          } else {
            transform += rotate(-90);
          }
          this.set('startArrowTransform', transform);

          this.set('displayEndArrow', true);
          transform = translate(x2 - RADIUS, y2 - yDiff/4);
          if(yDiff > 0) {
            transform += rotate(90);
          } else {
            transform += rotate(-90);
          }
          this.set('endArrowTransform', transform);
        }

        transform = translate(x1 + xDiff/2, y1 + yDiff/2);
        transform += rotate(180);
        this.set('centerArrowTransform', transform);
      }
      else
      {
        // start and end are so close to each other to each other
        // that the connection must run around one of the operators

        this.set('displayStartArrow', true);
        transform = translate(x1 + RADIUS, y1 + (yOffset - EXTRA_HEIGHT)/2 - RADIUS);
        transform += rotate(-90);
        this.set('startArrowTransform', transform);

        this.set('displayEndArrow', true);
        transform = translate(x2 - RADIUS, y2 - RADIUS - ((yDiff - yOffset) + EXTRA_HEIGHT)/2);
        transform += rotate(90);
        this.set('endArrowTransform', transform);

        this.set('displayCenterArrow', true);
        transform = translate(x1 + xDiff/2, y1 + yOffset - EXTRA_HEIGHT - ARC_RECT_SIZE);
        transform += rotate(180);
        this.set('centerArrowTransform', transform);
      }
    }
  }.observes('x1', 'x2', 'y1', 'y2'),

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

var computeAngle = function(radius, height) {
  var c = Math.abs(height)/Math.abs(radius);
  var sin = Math.sqrt(c/2);
  return 2 * Math.asin(sin) * 180 / Math.PI;
};

var computeWidth = function(height, angle) {
  var EPSILON = 0.1;
  if (Math.abs(height) < EPSILON) {
    return 0.0;
  }
  else {
    return Math.abs(height) / Math.tan(angle / 2 / 180 * Math.PI);
  }
};

var drawArc = function(large, ccw, x, y) {
  var RADIUS = 1.5 * Constant.CONNECTOR_SIZE;
  var largeArcSweepFlag = large === 1 ? 1 : 0;
  var sweepFlag = ccw === 1 ? 0 : 1;
  return 'A' + RADIUS + ',' + RADIUS + ',0,' +
         largeArcSweepFlag + ',' + sweepFlag + ',' + x + ',' + y;
};

var drawLine = function(x, y) {
  return 'L' + x + ',' + y;
};

var translate = function(x, y) {
  return 'translate(' + x + ',' + y + ')';
};

var rotate = function(angle) {
  return 'rotate(' + angle + ')';
};

var computePath = function(x1, y1, x2, y2) {
  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
    return 'M0,0';
  }

  var RADIUS = 1.5 * Constant.CONNECTOR_SIZE;
  var EXTRA_HEIGHT = 20;

  var xDiff = x2 - x1;
  var yDiff = y2 - y1;
  var yOffset = 0;

  var angle = computeAngle(RADIUS, yDiff/2);
  var width = computeWidth(yDiff/2, angle);

  if (yDiff <= 0) {
    yOffset = yDiff;
  }

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
          path += drawLine(x1 + xDiff/2 - width, y1);
          path += drawArc(0, 0, x1 + xDiff/2, y1 + yDiff / 2);
          path += drawArc(0, 1, x1 + xDiff/2 + width, y1 + yDiff);
        } else {
          // two 90 degree arcs are possible
          path += drawLine(x1 + xDiff/2 - RADIUS, y1);
          path += drawArc(0, 0, x1 + xDiff/2, y1 + RADIUS);
          path += drawLine(x1 + xDiff/2, y2 - RADIUS);
          path += drawArc(0, 1, x1 + xDiff/2 + RADIUS, y2);
        }
      } else {
        // the connection points upwards
        if(Math.abs(yDiff) < 2*RADIUS)
        {
          // start and end point are so close too each other that
          // the arcs must be less than 90 degrees
          path += drawLine(x1 + xDiff/2 - width, y1);
          path += drawArc(0, 1, x1 + xDiff/2, y1 + yDiff / 2);
          path += drawArc(0, 0, x1 + xDiff/2 + width, y1 + yDiff);
        }
        else
        {
          // two 90 degree arcs are possible
          path += drawLine(x1 + xDiff/2 - RADIUS, y1);
          path += drawArc(0, 1, x1 + xDiff/2, y1 - RADIUS);
          path += drawLine(x1 + xDiff/2, y2 + RADIUS);
          path += drawArc(0, 0, x1 + xDiff/2 + RADIUS, y2);
        }
      }
    } else {
      // start and end are so close to each other to each other
      // that the connections must have loop
      path += drawLine(x1 + xDiff/2, y1);
      path += drawArc(0, 1, x1 + xDiff/2 + RADIUS, y1 - RADIUS);
      path += drawLine(x1 + xDiff/2 + RADIUS, y1 + yOffset - RADIUS);
      path += drawArc(1, 1, x1 + xDiff/2 - RADIUS, y1 + yOffset - RADIUS);
      path += drawLine(x1 + xDiff/2 - RADIUS, y2 - RADIUS);
      path += drawArc(0, 1, x1 + xDiff/2, y2);
    }
  } else {
    // the connections points backward
    if (Math.abs(yDiff) > 4 * RADIUS) {
      // start and end are so far from each other that the can
      // be directly with a line between the two operators
      if (yDiff > 0) {
        // the connection points downwards
        path += drawArc(0, 0, x1 + RADIUS, y1 + RADIUS);
        path += drawLine(x1 + RADIUS, y1 + yDiff/2 - RADIUS);
        path += drawArc(0, 0, x1, y1 + yDiff/2);
        path += drawLine(x2, y1 + yDiff/2);
        path += drawArc(0, 1, x2 - RADIUS, y1 + yDiff/2 + RADIUS);
        path += drawLine(x2 - RADIUS, y2 - RADIUS);
        path += drawArc(0, 1, x2, y2);
      } else {
        // the connection points upwards
        path += drawArc(0, 1, x1 + RADIUS, y1 - RADIUS);
        path += drawLine(x1 + RADIUS, y1 + yDiff/2 + RADIUS);
        path += drawArc(0, 1, x1, y1 + yDiff/2);
        path += drawLine(x2, y1 + yDiff/2);
        path += drawArc(0, 0, x2 - RADIUS, y1 + yDiff/2 - RADIUS);
        path += drawLine(x2 - RADIUS, y2 + RADIUS);
        path += drawArc(0, 0, x2, y2);
      }
    } else {
      // start and end are so close to each other
      // that the connection must run around one of the operators
      path += drawArc(0, 1, x1 + RADIUS, y1 - RADIUS);
      path += drawLine(x1 + RADIUS, y1 - RADIUS + yOffset - EXTRA_HEIGHT);
      path += drawArc(0, 1, x1, y1 - 2*RADIUS + yOffset - EXTRA_HEIGHT);
      path += drawLine(x2, y1 - 2*RADIUS + yOffset - EXTRA_HEIGHT);
      path += drawArc(0, 1, x2 - RADIUS, y1 - RADIUS + yOffset - EXTRA_HEIGHT);
      path += drawLine(x2 - RADIUS, y2 - RADIUS);
      path += drawArc(0, 1, x2, y2);
    }
  }
  path += drawLine(x2, y2);

  return path;
};

