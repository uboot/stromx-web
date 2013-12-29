App.FilesAddController = Ember.Controller.extend({
  actions: {
    addFile: function () {
      var file = this.store.createRecord('file', {
        name: this.get('name'),
        content: this.get('content')
      });
      
      file.save()
      this.transitionToRoute('files')
    }
  }
});