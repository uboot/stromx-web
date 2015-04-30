import Ember from "ember";

export default Ember.Controller.extend({
  wasRemoved: false,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('view.index', this.get('model.view'));
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('parameterObserver.index', this.get('model'));
      }
    },
    remove: function () {
      this.set('wasRemoved', true);
    }
  }
});
