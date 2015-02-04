import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    cancel: function() {
      this.set('name', '');
      this.transitionToRoute('files.index');
    },
    save: function () {
      var name = this.get('name');
      var file = this.store.createRecord('file', {
        name: name
      });

      this.set('name', '');
      file.save();
      this.transitionToRoute('files');
    }
  }
});
