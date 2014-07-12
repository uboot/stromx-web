/* global App */

App.ParameterObserverController = Ember.ObjectController.extend({  
  visualizationLabel: function() {
    var visualization = this.get('model').get('visualization');
    
    if (visualization === 'slider')
      return 'Slider';
    else
      return '';
  }.property('visualization'),
                                                                
  title: function() {
    var parameter = this.get('parameter');
    var operator = parameter.get('operator');
    if (operator)
      return parameter.get('title') + " at " + operator.get('name');
    else
      return '';
  }.property('parameter.title', 'parameter.operator.name'),                  
});
