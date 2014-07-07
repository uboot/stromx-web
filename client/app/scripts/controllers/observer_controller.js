/* global App */

App.ObserverController = Ember.ObjectController.extend({  
  visualizationLabel: function() {
    var visualization = this.get('model').get('visualization');
    
    if (visualization === 'image')
      return 'Image';
    else if (visualization === 'lines')
      return 'Lines';
    else
      return '';
  }.property('visualization'),
                                                       
});
