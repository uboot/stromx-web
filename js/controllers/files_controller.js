App.FilesController = Ember.ArrayController.extend({
  fileOpened: function(key, value) {
    
  }.property('model.@each.opened')
});
