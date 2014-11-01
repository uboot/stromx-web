/* global App */

require('scripts/controllers/operator_controller');

App.InputController = Ember.ObjectController.extend({
  y: function() {
    var inputs = this.get('operator.inputs');
    var numConnectors = inputs.get('length');
    var index = inputs.indexOf(this.get('model'));
    
    var opCenter = (App.Constants.OPERATOR_SIZE +
                    App.Constants.CONNECTOR_SIZE) / 2;
    var offset = opCenter - App.Constants.CONNECTOR_SIZE * numConnectors;
    
    return offset + 2 * App.Constants.CONNECTOR_SIZE * index;
  }.property('operator.position', 'operator.inputs')
});
