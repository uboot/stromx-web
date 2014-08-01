/* global App */

App.StreamNewViewController = Ember.Controller.extend({
  actions: {
    saveView: function () {
      var stream = this.get('model');
      var name = this.get('viewName');
      var view = this.store.createRecord('view', {
        name: name,
        stream: stream,
      });
      view.save();

      stream.get('views').then(function(views) {
        views.pushObject(view);
      })

      this.transitionToRoute('stream');
    }
  }
});
