import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    remove: function () {
      var file = this.get('model');
      file.deleteRecord();
      file.save();
    },
    dismiss: function () {
      this.transitionToRoute('/');
    }
  }
});
