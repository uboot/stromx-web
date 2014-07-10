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
    return parameter.get('title');
  }.property('parameter.title'),                  
});
