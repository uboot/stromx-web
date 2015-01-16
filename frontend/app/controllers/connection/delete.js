import Ember from "ember";

export default Ember.ObjectController.extend({
  actions: {
    dismiss: function () {
      this.transitionToRoute('stream.index', this.get('model.stream'));
    },
    remove: function () {
      var connection = this.get('model');
      connection.deleteRecord();
      connection.save();
    }
  }
});
