import Ember from "ember";

export default Ember.Controller.extend({
  wasRemoved: false,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('view.index', this.get('model.view'));
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('inputObserver.index', this.get('model'));
      }
    },
    remove: function () {
      var observer = this.get('model');
      observer.deleteRecord();
      observer.save();
      this.set('wasRemoved', true);
    }
  }
});
