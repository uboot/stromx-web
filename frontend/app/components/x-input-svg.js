import Ember from "ember";

import { Constant } from 'stromx-web/controllers/operator-svg';

export default Ember.Component.extend({
  tagName: 'g',
  classNames: ['stromx-svg-input'],
  x: -Constant.CONNECTOR_SIZE,
  y: function() {
    var numConnectors = this.get('numConnectors');
    var index = this.get('index');

    var opCenter = (Constant.OPERATOR_SIZE +
                    Constant.CONNECTOR_SIZE) / 2;
    var offset = opCenter - Constant.CONNECTOR_SIZE * numConnectors;

    return offset + 2 * Constant.CONNECTOR_SIZE * index;
  }.property('numConnectors', 'index'),

  isDraggingConnection: false,
  strokeWidth: function() {
    var stream = this.get('operator.stream');
    var output = stream.get('activeOutput');
    return output === null ? 2 : 4;
  }.property('operator.stream.activeOutput'),

  x1: -Constant.CONNECTOR_SIZE / 2,
  y1: function() {
    return this.get('y') + Constant.CONNECTOR_SIZE / 2;
  }.property('y'),

  x2: 0,
  y2: 0,

  actions: {
    dragStart: function() {
      var _this = this;
      this.get('model.connection').then(function(connection) {
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

      var opPos = this.get('operator.model.position');
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

      var stream = this.get('operator.stream');
      var output = stream.get('activeOutput');
      if (output === null) {
        return;
      }

      stream.addConnection(this.get('model'), output);
    },
    enter: function() {
      var _this = this;
      this.get('model.connection').then(function(connection) {
        if (connection !== null) {
          return;
        }

        var stream = _this.get('operator.stream');
        stream.set('activeInput', _this.get('model'));
      });
    },
    leave: function() {
      var stream = this.get('operator.stream');
      stream.set('activeInput', null);
    }
  }
});
