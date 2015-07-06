import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    openFile: function(file) {
      file.set('opened', true);
      var controller = this;
      file.save().then( function(file) {
        if (! file.get('opened')) {
          return;
        }

        var stream = file.get('stream');
        if (stream !== null) {
          controller.transitionToRoute('stream', stream);
        }
      }, function() {
        file.rollbackAttributes();
      });
    }
  }
});


