App.ParameterController = Ember.ObjectController.extend({  
  isEditing: false,
  
  isEnum: function() {
    return this.get('type') == 'enum'
  }.property('type'),
  
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
  
  // cf. http://stackoverflow.com/questions/20623027/rendering-resolved-promise-value-in-ember-handlebars-template
  updateEnumTitle: function(enumValue) {
    var value = enumValue
    var title = this.get('descriptions').then( function(value){
      return value.find( function(item, index, enumerable) {
         return item.get('value') == enumValue
      })
    }).then( function(obj) {
      return obj.get('title')
    })
    
    var that = this
    title.then( function(title) {
      that.set('value', title)
      value = title
    })
    
    return value
  },
  
  actions: {
    editValue: function() {
      this.set('isEditing', true)
    }, 
    saveValue: function() {
      this.set('isEditing', false)
    }
  }
});
