/* global App */

App.FilesNewController = Ember.Controller.extend({
  actions: {
    newFile: function () {
      var name = this.get('name');
      var file = this.store.createRecord('file', {
        name: name,
        content: ''
      });
      
      file.save();
      this.transitionToRoute('files');
    }
  }
});
