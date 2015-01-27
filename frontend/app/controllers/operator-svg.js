import OperatorController from 'stromx-web/controllers/operator';

export var Constant = {
  OPERATOR_SIZE: 50,
  CONNECTOR_SIZE: 10
};

export default OperatorController.extend({
  transform: function() {
    var pos = this.get('position');
    if (pos === undefined) {
      return '';
    }

    return 'translate(' + pos.x + ' ' + pos.y + ')';
  }.property('position'),

  dragStartPosition: {x: 0, y: 0},

  actions: {
    dragStart: function() {
      var pos = this.get('position');
      this.dragStartPosition = {
        x: pos.x,
        y: pos.y
      };
    },
    dragMove: function(dx, dy) {
      this.set('position', {
        x: this.dragStartPosition.x + dx,
        y: this.dragStartPosition.y + dy
      });
    },
    dragEnd: function() {
      var pos = this.get('position');
      var newPos = {
        x: 25 * Math.round(pos.x / 25),
        y: 25 * Math.round(pos.y / 25)
      };
      
      if (pos.x === newPos.x && pos.y === newPos.y) {
        return;
      }
      
      this.set('position', newPos);
      this.get('model').save();
    },
    show: function() {
      this.transitionToRoute('operator', this.get('model'));
    }
  }
});
