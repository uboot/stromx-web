import Ember from "ember";

import { Constant } from 'stromx-web/controllers/operator-svg';

export default Ember.ObjectController.extend({
  x: -Constant.CONNECTOR_SIZE,
  y: function() {
    var inputs = this.get('operator.inputs');
    var numConnectors = inputs.get('length');
    var index = inputs.indexOf(this.get('model'));

    var opCenter = (Constant.OPERATOR_SIZE +
                    Constant.CONNECTOR_SIZE) / 2;
    var offset = opCenter - Constant.CONNECTOR_SIZE * numConnectors;

    return offset + 2 * Constant.CONNECTOR_SIZE * index;
  }.property('operator', 'operator.inputs'),

  isDraggingConnection: false,
  strokeWidth: function() {
    var stream = this.get('parentController.parentController');
    var output = stream.get('activeOutput');
    return output === null ? 2 : 4;
  }.property('parentController.parentController.activeOutput'),

  x1: -Constant.CONNECTOR_SIZE / 2,
  y1: function() {
    return this.get('y') + 5;
  }.property('y'),

  x2: 0,
  y2: 0,

  actions: {
    dragStart: function() {
      var _this = this;
      this.get('connection').then(function(connection) {
        if (connection !== null) {
          return;
        }

        _this.setProperties({
          'x2': _this.get('x1'),
          'y2': _this.get('y1')
        });
        _this.set('isDraggingConnection', true);
      });
    },
    dragMove: function(dx, dy, x, y) {
      if (! this.isDraggingConnection) {
        return;
      }

      var opPos = this.get('parentController.position');
      this.setProperties({
        'x2': x - opPos.x,
        'y2': y - opPos.y
      });
    },
    dragEnd: function() {
      if (! this.isDraggingConnection) {
        return;
      }

      this.set('isDraggingConnection', false);

      var streamController = this.get('parentController.parentController');
      var output = streamController.get('activeOutput');
      if (output === null) {
        return;
      }

      var input = this.get('model');
      var store = this.get('store');
      var connection = store.createRecord('connection', {
        output: output,
        input: input,
        thread: null,
        stream: streamController.get('model')
      });
      
      var _this = this;
      connection.save().then(function(connection) {
        _this.transitionToRoute('connection', connection);
      });
    },
    enter: function() {
      var _this = this;
      this.get('connection').then(function(connection) {
        if (connection !== null) {
          return;
        }

        var stream = _this.get('parentController.parentController');
        stream.set('activeInput', _this.get('model'));
      });
    },
    leave: function() {
      var stream = this.get('parentController.parentController');
      stream.set('activeInput', null);
    }
  }
});
