App.StreamController = Ember.ObjectController.extend({
  actions: {
    close: function () {
      this.set('saved', true)
      var stream = this.get('model')
      var that = this
      stream.save().then(function() {
        file = that.get('file')
        file.set('opened', false)
        that.transitionToRoute('files')
        file.save()
      })
    },
    start: function () {
        this.set('active', true)
        var stream = this.get('model')
        stream.save()
    },
    stop: function () {
        this.set('active', false)
        var stream = this.get('model')
        stream.save()
    },
    pause: function () {
        this.set('paused', true)
        var stream = this.get('model')
        stream.save()
    },
    resume: function () {
        this.set('paused', false)
        var stream = this.get('model')
        stream.save()
    }
  }
});