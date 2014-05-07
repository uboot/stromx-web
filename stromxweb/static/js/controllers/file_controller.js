App.FileController = Ember.ObjectController.extend({
  closed: Ember.computed.not('opened'),
  url: function(key, value) {
    return '../download/' + this.get('name')
  }.property(name),
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
          if (! file.get('opened'))
            return
            
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