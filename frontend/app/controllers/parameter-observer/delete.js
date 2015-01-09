import Ember from "ember";

export default Ember.ObjectController.extend({
  actions: {
    dismiss: function () {
      this.transitionToRoute('view.index', this.get('model.view'));
    },
    remove: function () {
      var view = this.get('model');
      view.deleteRecord();
      view.save();
    }
  }
});
