import Ember from "ember";

import { Constant } from 'stromx-web/controllers/operator-svg';

export default Ember.Component.extend({
  tagName: 'g',
  classNames: ['stromx-svg-output'],
  x: Constant.OPERATOR_SIZE,
  y: function() {
    var inputs = this.get('model.operator.outputs');
    var numConnectors = inputs.get('length');
    var index = inputs.indexOf(this.get('model'));

    var opCenter = (Constant.OPERATOR_SIZE +
                    Constant.CONNECTOR_SIZE) / 2;
    var offset = opCenter - Constant.CONNECTOR_SIZE * numConnectors;

    return offset + 2 * Constant.CONNECTOR_SIZE * index;
  }.property('model.operator.position', 'model.operator.outputs'),

  isDraggingConnection: false,
  strokeWidth: function() {
    var stream = this.get('operator.stream');
    var output = stream.get('activeInput');
    return output === null ? 2 : 4;
  }.property('operator.stream.activeInput'),

  x1: Constant.OPERATOR_SIZE + Constant.CONNECTOR_SIZE / 2,
  y1: function() {
    return this.get('y') + 5;
  }.property('y'),

  x2: 0,
  y2: 0,

  actions: {
    dragStart: function() {
      this.setProperties({
        'x2': this.get('x1'),
        'y2': this.get('y1')
      });
      this.set('isDraggingConnection', true);
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

      var streamController = this.get('operator.stream');
      var input = streamController.get('activeInput');
      if (input === null) {
        return;
      }
      
      streamController.addConnection(input, this.get('model'));
    },
    enter: function() {
      var stream = this.get('operator.stream');
      stream.set('activeOutput', this.get('model'));
    },
    leave: function() {
      var stream = this.get('operator.stream');
      stream.set('activeOutput', null);
    }
  }
});