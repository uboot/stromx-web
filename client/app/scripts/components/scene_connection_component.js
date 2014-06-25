/* global App, Snap */

App.SceneConnectionComponent = Ember.Component.extend({
  group: null,
  
  didInsertElement: function() {
    var paper = new Snap('#svg');
    
    var connectionLine = paper.line(0, 0, 0, 0);
    connectionLine.attr({
      class: 'stromx-svg-connection-line',
      stroke: '#ff0000'
    });
    this.set('line', connectionLine);
      
    this.updatePosition();
  },
  
  willDestroyElement: function() {
  },

  updatePosition: function() {
    var connection = this.get('connection');
    var line = this.get('line');
    var sourcePosition = connection.get('sourcePosition');
    var targetPosition = connection.get('targetPosition');
    var operatorPromises = {
      sourceOperator: connection.get('sourceOperator'),
      targetOperator: connection.get('targetOperator')
    };
    Ember.RSVP.hash(operatorPromises).then( function(hash){
      var sourceOperator = hash['sourceOperator'];
      var targetOperator = hash['targetOperator'];
      var x1 = sourceOperator.get('x');
      var y1 = sourceOperator.get('y');
      var x2 = targetOperator.get('x');
      var y2 = targetOperator.get('y');
      
      var numConnectorPromises = {
        numInputs: targetOperator.get('numInputs'),
        numOutputs: sourceOperator.get('numOutputs')
      };
      
      Ember.RSVP.hash(numConnectorPromises).then( function(hash){
        var numInputs = hash['numInputs'];
        var numOutputs = hash['numOutputs'];
        
        var targetOffset = 30 - 10 * numInputs;
        var sourceOffset = 30 - 10 * numOutputs;
      
        line.attr({
          x1: x1 + 60,
          y1: y1 + sourceOffset + 20 * sourcePosition + 5,
          x2: x2 - 10,
          y2: y2 + targetOffset + 20 * targetPosition + 5,
        });
      });
      
    });
    
  }.observes('connection.sourceOperator.x', 'connection.sourceOperator.y', 
             'connection.targetOperator.x', 'connection.targetOperator.y')
}); 
