/* global App */

App.StreamNewThreadController = Ember.Controller.extend({
  actions: {
    saveView: function () {
      var stream = this.get('model');
      var name = this.get('viewName');
      var thread = this.store.createRecord('thread', {
        name: name,
        stream: stream
      });
      thread.save();

      stream.get('threads').then(function(threads) {
        threads.pushObject(thread);
      });

      this.transitionToRoute('stream');
    }
  }
});
