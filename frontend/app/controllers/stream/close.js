import Ember from "ember";

export default Ember.Controller.extend({
  needs: ['stream'],
  wasAccepted: false,
  actions: {
    dismiss: function () {
      if (this.get('wasAccepted')) {
        this.transitionToRoute('files');
      } else {
        this.transitionToRoute('stream');
      }
      this.set('wasAccepted', false);
    },
    saveAndClose: function () {
      this.get('model.file').then(function(file) {
        file.set('saved', true);
        file.set('opened', false);
        file.save();
      });
      this.get('controllers.stream').set('view', null);
      this.set('wasAccepted', true);
    },
    close: function () {
      this.get('model.file').then(function(file) {
        file.set('opened', false);
        file.set('saved', false);
        file.save();
      });
      this.get('controllers.stream').set('view', null);
      this.set('wasAccepted', true);
    }
  }
});
