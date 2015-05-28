import Ember from "ember";

export default Ember.Controller.extend({
  wasRemoved: false,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('view.index');
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('parameterObserver.index');
      }
    },
    remove: function () {
      this.set('wasRemoved', true);
    }
  }
});
