import Ember from "ember";

export default Ember.ObjectController.extend({
  wasRemoved: false,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('stream.index', this.get('model.stream'));
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('view.index', this.get('model'));
      }
    },
    remove: function () {
      var view = this.get('model');
      view.deleteRecord();
      view.save();
      this.set('wasRemoved', true);
    }
  }
});
