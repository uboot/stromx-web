App.ParameterController = Ember.ObjectController.extend({  
  value: function() {
    var type = this.get('type')
    if (type == 'int')
      return this.get('valueNumber')
    else if (type == 'string')
      return this.get('valueString')
    else if (type == 'enum')
      return this.get('valueNumber')
    else
      return ''
  }.property('valueString', 'valueNumber', 'type')
});
