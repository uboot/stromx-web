/* global App, Snap */

App.SvgDragComponent = Ember.Component.extend({
  tagName: 'g',
  start: undefined,
  
  mouseDown: function(event) {
    this.start = this.transform(event);
    this.sendAction('dragStart');
    
    var _this = this;
    $('body').mouseup(function (event) {
      $('body').off('mousemove');
      _this.sendAction('dragEnd');
      return false;
    });
    
    $('body').mousemove(function (event) {
      var point = _this.transform(event);
      var start = _this.start;
      _this.sendAction('dragMove', point.x - start.x, point.y - start.y);
      return false;
    });
    
    return false;
  },
  
  transform: function(event) {
    var node = $('#stream-svg')[0];
    var transform = node.getScreenCTM().inverse();
    var point = node.createSVGPoint();
    point.x = event.pageX;
    point.y = event.pageY;
    return point.matrixTransform(transform);
  }
});
