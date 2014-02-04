App.OperatorController = Ember.ObjectController.extend({  
  fullType: function() {
    return this.get('package') + '::' + this.get('type')
  }.property('type', 'package')
});
