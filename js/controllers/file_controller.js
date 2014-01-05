App.FileController = Ember.ObjectController.extend({
  closed: Ember.computed.not('opened'),
  actions: {
    remove: function () {
        var file = this.get('model')
        file.deleteRecord()
        file.save()
    },
    open: function () {
        this.set('opened', true)
        var that = this
        var file = this.get('model')
        file.save().then( function(file) {
          return file.get('stream')
        }).then( function(stream) {
          if (stream)
          {
            firstStream = stream.get('firstObject')
            that.transitionToRoute('stream', firstStream)
          }
        })
    },
    close: function () {
        this.set('opened', false)
        var file = this.get('model')
        file.save()
    }
  }
});