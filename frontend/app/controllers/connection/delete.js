import Ember from "ember";

export default Ember.Controller.extend({
  stream: Ember.inject.controller(),
  wasRemoved: false,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('stream.index');
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('connection.index');
      }
    },
    remove: function () {
      var streamController = this.get('stream');
      streamController.send('removeConnection', this.get('model'));
      this.set('wasRemoved', true);
    }
  }
});
