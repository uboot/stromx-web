/* global App */

App.StreamController = Ember.ObjectController.extend({
  actions: {
    close: function () {
      var stream = this.get('model');
      this.get('file').then(function(file) {
        file.set('opened', false);
        file.save();
        stream.set('saved', true);
        stream.save();
      });
      this.transitionToRoute('files');
    },
    start: function () {
        this.set('active', true);
        var stream = this.get('model');
        stream.save();
    },
    stop: function () {
        this.set('active', false);
        var stream = this.get('model');
        stream.save();
    },
    pause: function () {
        this.set('paused', true);
        var stream = this.get('model');
        stream.save();
    },
    resume: function () {
        this.set('paused', false);
        var stream = this.get('model');
        stream.save();
    }
  }
});
