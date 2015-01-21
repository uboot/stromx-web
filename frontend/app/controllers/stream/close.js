import Ember from "ember";

export default Ember.ObjectController.extend({
  wasCancelled: false,
  actions: {
    dismiss: function () {
      if (this.get('wasCancelled')) {
        this.transitionToRoute('stream');
      } else {
        this.transitionToRoute('files');
      }
      this.set('wasCancelled', false);
    },
    saveAndClose: function () {
      this.get('file').then(function(file) {
        file.set('saved', true);
        file.set('opened', false);
        file.save();
      });
    },
    cancel: function() {
      this.set('wasCancelled', true);
    }
  }
});
