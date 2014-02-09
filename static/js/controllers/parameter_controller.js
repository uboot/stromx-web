App.ParameterController = Ember.ObjectController.extend({  
  value: function(key, value) {
    if (arguments.length > 1) {
      return value
    }
    var type = this.get('type')
    if (type == 'int')
      return this.get('valueNumber')
    else if (type == 'string')
      return this.get('valueString')
    else if (type == 'enum')
      return this.updateEnumTitle(this.get('valueNumber'))
    else
      return ''
  }.property('valueString', 'valueNumber', 'type'),
  
  updateEnumTitle: function(enumValue) {
    var title = this.get('descriptions').then( function(value){
      return value.find( function(item, index, enumerable) {
         return item.get('value') == enumValue
      })
    }).then( function(obj) {
      return obj.get('title')
    })
    
    that = this
    title.then( function(title) {
      that.set('value', title)
    })
    
    return enumValue
  }
});
