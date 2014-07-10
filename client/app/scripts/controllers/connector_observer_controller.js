/* global App */

App.ConnectorObserverController = Ember.ObjectController.extend({  
  visualizationLabel: function() {
    var visualization = this.get('visualization');
    
    if (visualization === 'image')
      return 'Image';
    else if (visualization === 'lines')
      return 'Lines';
    else
      return '';
  }.property('visualization'),
                                                                
  title: function() {
    var connector = this.get('connector');
    var operator = connector.get('operator');
    if (operator)
      return operator.get('name') + connector.get('title');
    else
      return connector.get('title');
  }.property('connector.title', 'connector.operator.name')                
});