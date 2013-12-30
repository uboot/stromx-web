App.FileController = Ember.ObjectController.extend({
    actions: {
      remove: function () {
          var file = this.get('model')
          file.deleteRecord()
          file.save()
      },
      open: function () {
          this.set('opened', true)
          var file = this.get('model')
          file.save()
      },
      close: function () {
          this.set('opened', false)
          var file = this.get('model')
          file.save()
      }
    }
});