import Ember from "ember";

export default Ember.Controller.extend({
  wasRemoved: false,
  needs: ['stream'],
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('stream.index', this.get('model.stream'));
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('connection.index', this.get('model'));
      }
    },
    remove: function () {
      var streamController = this.get('controllers.stream');
      streamController.removeConnection(this.get('model'));
      this.set('wasRemoved', true);
    }
  }
});
