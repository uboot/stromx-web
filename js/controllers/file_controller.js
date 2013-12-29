App.FileController = Ember.ObjectController.extend({
    actions: {
      remove: function () {
          var file = this.get('model')
          file.deleteRecord()
          file.save()
      }
    }
});