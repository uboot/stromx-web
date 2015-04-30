import Ember from "ember";

export default Ember.Controller.extend({
  wasRemoved: false,
  view: null,
  actions: {
    remove: function () {
      var model = this.get('model');
      var view = model.get('view');
      
      model.deleteRecord();
      
      Ember.RSVP.hash({
        view: view,
        observer: model.save()
      }).then(function(hash) {
        hash.view.reload().then(function(view) {
          view.get('observers').forEach(function(observer) {
            observer.reload();
          });
        });
      });
      
      // remember the view
      this.set('view', view);
      this.set('wasRemoved', true);
    }
  }
});
