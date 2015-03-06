import Ember from "ember";

export default Ember.Controller.extend({
  wasRemoved: false,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('stream.index', this.get('model.stream'));
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('thread.index', this.get('model'));
      }
    },
    remove: function () {
      var thread = this.get('model');
      thread.deleteRecord();
      thread.save();
      this.set('wasRemoved', true);
    }
  }
});
