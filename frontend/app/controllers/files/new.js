import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    newFile: function () {
      var name = this.get('name');
      var file = this.store.createRecord('file', {
        name: name
      });

      file.save();
      this.transitionToRoute('files');
    },
    cancel: function () {
      this.transitionToRoute('files');
    }
  }
});
