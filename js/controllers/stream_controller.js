App.StreamController = Ember.ObjectController.extend({
  actions: {
    close: function () {
      this.get('file').then(function(file) {
        file.set('opened', false)
      })
      this.transitionToRoute('files')
    }
  }
});