App.OperatorController = Ember.ObjectController.extend({  
  fullType: function() {
    return this.get('package') + '::' + this.get('type')
  }.property('type', 'package'),
                                                       
  status: function() {
    var status = this.get('model').get('status')
    
    if (status == 'none')
      return 'Not initialized'
    else if (type == 'initialized')
      return 'Initialized'
    else if (type == 'active')
      return 'Active'
    else
      return 'Not defined'
  }.property('status')
});
