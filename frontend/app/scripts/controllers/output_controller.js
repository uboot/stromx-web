/* global App */

require('scripts/controllers/operator_controller');

App.OutputController = Ember.ObjectController.extend({
  x: App.Constants.OPERATOR_SIZE,
  y: function() {
    var inputs = this.get('operator.outputs');
    var numConnectors = inputs.get('length');
    var index = inputs.indexOf(this.get('model'));
    
    var opCenter = (App.Constants.OPERATOR_SIZE +
                    App.Constants.CONNECTOR_SIZE) / 2;
    var offset = opCenter - App.Constants.CONNECTOR_SIZE * numConnectors;
    
    return offset + 2 * App.Constants.CONNECTOR_SIZE * index;
  }.property('operator.position', 'operator.outputs'),
  
  isDraggingConnection: false,
  strokeWidth: function() {
    var stream = this.get('parentController.parentController');
    var output = stream.get('activeInput');
    return output === null ? 2 : 4;
  }.property('parentController.parentController.activeInput'),
  
  x1: App.Constants.OPERATOR_SIZE + App.Constants.CONNECTOR_SIZE / 2,
  y1: function() {
    return this.get('y') + 5;
  }.property('y'),
  
  x2: 0,
  y2: 0,
  
  actions: {
    dragStart: function(x, y) {
      this.setProperties({
        'x2': this.get('x1'),
        'y2': this.get('y1')
      });
      this.set('isDraggingConnection', true);
    },
    dragMove: function(dx, dy, x, y) {
      if (! this.isDraggingConnection)
        return;
        
      var opPos = this.get('parentController.position');
      this.setProperties({
        'x2': x - opPos.x,
        'y2': y - opPos.y
      });
    },
    dragEnd: function() {
      if (! this.isDraggingConnection)
        return;
        
      this.set('isDraggingConnection', false);
      
      var streamController = this.get('parentController.parentController');
      var input = streamController.get('activeInput');
      if (input === null)
        return;
        
      var output = this.get('model');
      var store = this.get('store');
      var connection = store.createRecord('connection', {
        output: output,
        input: input,
        thread: null,
        stream: streamController.get('model')
      });
      connection.save();
    },
    enter: function() {
      var stream = this.get('parentController.parentController');
      stream.set('activeOutput', this.get('model'));
    },
    leave: function() {
      var stream = this.get('parentController.parentController');
      stream.set('activeOutput', null);
    }
  }
});
