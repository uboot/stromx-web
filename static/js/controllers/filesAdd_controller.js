App.FilesAddController = Ember.Controller.extend({
  actions: {
    addFile: function () {
      var name = this.get('name')
      var strippedName = name.replace(/^.*[\\\/]/, '')
      var file = this.store.createRecord('file', {
        name: strippedName,
        content: this.get('content')
      });
      
      file.save()
      this.transitionToRoute('files')
    }
  }
});