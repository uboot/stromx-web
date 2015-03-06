import Ember from "ember";

export default Ember.Controller.extend({
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
      this.get('model.file').then(function(file) {
        file.set('saved', true);
        file.set('opened', false);
        file.save();
      });
    },
    close: function () {
      this.get('model.file').then(function(file) {
        file.set('opened', false);
        file.set('saved', false);
        file.save();
      });
    },
    cancel: function() {
      this.set('wasCancelled', true);
    }
  }
});
