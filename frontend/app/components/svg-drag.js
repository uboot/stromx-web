/*global $:false */

import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'g',
  start: undefined,

  mouseDown: function(event) {
    this.start = this.transform(event);
    this.sendAction('dragStart', this.start.x, this.start.y);

    var _this = this;
    $('body').mouseup(function () {
      $('body').off('mousemove');
      $('body').off('mouseup');
      _this.sendAction('dragEnd');
      return false;
    });

    $('body').mousemove(function (event) {
      var point = _this.transform(event);
      var start = _this.start;
      _this.sendAction('dragMove', point.x - start.x, point.y - start.y,
                       point.x, point.y);
      return false;
    });
    return false;
  },

  mouseEnter: function() {
    this.sendAction('enter');
    return false;
  },

  mouseLeave: function() {
    this.sendAction('leave');
    return false;
  },

  transform: function(event) {
    var node = $('.stromx-stream-svg')[0];
    var transform = node.getScreenCTM().inverse();
    var point = node.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(transform);
  }
});
