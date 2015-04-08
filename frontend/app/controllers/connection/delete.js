import Ember from "ember";

export default Ember.Controller.extend({
  needs: ['stream'],
  actions: {
    dismiss: function () {
      this.transitionToRoute('stream.index', this.get('model.stream'));
    },
    remove: function () {
      var streamController = this.get('controllers.stream');
      streamController.removeConnection(this.get('model'));
    }
  }
});
