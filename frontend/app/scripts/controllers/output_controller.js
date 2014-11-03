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
  
  actions: {
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
