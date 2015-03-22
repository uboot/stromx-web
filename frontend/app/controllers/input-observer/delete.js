import Ember from "ember";

export default Ember.Controller.extend({
  wasRemoved: false,
  view: null,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('view.index', this.get('view'));
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('inputObserver.index', this.get('model'));
      }
    },
    remove: function () {
      var observer = this.get('model');

      // remember the view
      this.set('view', observer.get('view'));

      // remove the observer from the view
      // FIXME: is this really necessary or should ember-data take of
      // the removal?
      var observers = this.get('model.view.observers');
      observers.removeObject(observer);

      // delete and save the observer
      observer.deleteRecord();
      observer.save();
      this.set('wasRemoved', true);
    }
  }
});
