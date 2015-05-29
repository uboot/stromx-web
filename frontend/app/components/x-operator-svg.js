import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'g',
  classNames: ['stromx-svg-operator'],
  transform: function() {
    var pos = this.get('model.position');
    if (pos === undefined) {
      return '';
    }

    return 'translate(' + pos.x + ' ' + pos.y + ')';
  }.property('model.position'),

  dragStartPosition: {x: 0, y: 0},

  actions: {
    dragStart: function() {
      var pos = this.get('model.position');
      this.dragStartPosition = {
        x: pos.x,
        y: pos.y
      };
    },
    dragMove: function(dx, dy) {
      this.set('model.position', {
        x: this.dragStartPosition.x + dx,
        y: this.dragStartPosition.y + dy
      });
    },
    dragEnd: function() {
      var pos = this.get('model.position');
      var newPos = {
        x: 25 * Math.round(pos.x / 25),
        y: 25 * Math.round(pos.y / 25)
      };
      
      if (pos.x === newPos.x && pos.y === newPos.y) {
        return;
      }
      
      this.set('model.position', newPos);
      this.get('model').save();
    },
    inputDragStart: function(input, x, y) {
      this.sendAction('inputDragStart', input, x, y); 
    },
    inputDragMove: function(input, x, y) {
      this.sendAction('inputDragMove', input, x, y); 
    },
    inputDragEnd: function(input) {
      this.sendAction('inputDragEnd', input); 
    },
    inputEnter: function(input) {
      this.sendAction('inputEnter', input); 
    },
    inputLeave: function(input) {
      this.sendAction('inputLeave', input); 
    },
    outputDragStart: function(output, x, y) {
      this.sendAction('outputDragStart', output, x, y); 
    },
    outputDragMove: function(output, x, y) {
      this.sendAction('outputDragMove', output, x, y); 
    },
    outputDragEnd: function(output) {
      this.sendAction('outputDragEnd', output); 
    },
    outputEnter: function(output) {
      this.sendAction('outputEnter', output); 
    },
    outputLeave: function(output) {
      this.sendAction('outputLeave', output); 
    }
  }
});


