import Ember from "ember";

export default Ember.Controller.extend({
  wasRemoved: false,
  view: null,
  actions: {
    remove: function () {
      var model = this.get('model');
      var view = model.get('view');

      Ember.RSVP.hash({
        removedObserver: model.destroy(),
        observers: model.get('view.observers')
      }).then(function(hash) {
        hash.observers.removeObject(hash.removedObserver);
        hash.observers.forEach(function(observer) {
          if (! observer.get('isDeleted')) {
            observer.reload();
          }
        });
      });

      // remember the view
      this.set('view', view);
      this.set('wasRemoved', true);
    }
  }
});
