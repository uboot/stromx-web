/* global App */

App.StreamNewViewController = Ember.Controller.extend({
  actions: {
    newView: function () {
      var name = this.get('viewName');
      var view = this.store.createRecord('view', {
        name: name
      });
      view.save();

      var stream = this.get('model');
      stream.get('views').then(function(views) {
        views.pushObject(view);
      })

      this.transitionToRoute('stream');
    }
  }
});
