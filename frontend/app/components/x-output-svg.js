import Ember from "ember";

import { OPERATOR_SIZE, CONNECTOR_SIZE } from 'stromx-web/geometry';

export default Ember.Component.extend({
  tagName: 'g',
  classNames: ['stromx-svg-output'],
  x: OPERATOR_SIZE,
  y: function() {
    var numConnectors = this.get('numConnectors');
    var index = this.get('index');

    var opCenter = (OPERATOR_SIZE +
                    CONNECTOR_SIZE) / 2;
    var offset = opCenter - CONNECTOR_SIZE * numConnectors;

    return offset + 2 * CONNECTOR_SIZE * index;
  }.property('numConnectors', 'index'),

  localToGlobal: function(x, y) {
    var svg = document.getElementById('stromx-stream-svg-id');
    var point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    var transform = svg.getScreenCTM().inverse().multiply(this.element.getScreenCTM());

    //getTransformToElement(svg);
    return point.matrixTransform(transform);
  },

  actions: {
    dragStart: function() {
      var x = OPERATOR_SIZE + CONNECTOR_SIZE / 2;
      var y = this.get('y') + CONNECTOR_SIZE / 2;
      var global = this.localToGlobal(x, y);
      this.sendAction('dragStart', this.get('model'), global.x, global.y);
    },
    dragMove: function(dx, dy, x, y) {
      this.sendAction('dragMove', this.get('model'), x, y);
    },
    dragEnd: function() {
      this.sendAction('dragEnd', this.get('model'));
    },
    enter: function() {
      this.sendAction('enter', this.get('model'));
    },
    leave: function() {
      this.sendAction('leave', this.get('model'));
    }
  }
});
