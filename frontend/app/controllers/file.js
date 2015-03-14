import Ember from "ember";
import ENV from '../config/environment';

export default Ember.Controller.extend({
  isEditing: false,
  closed: Ember.computed.not('model.opened'),
  url: function() {
    if (ENV.APP.API_HOST) {
      return ENV.APP.API_HOST + '/download/' + this.get('model.name');
    } else {
      return 'download/' + this.get('model.name');
    }
  }.property(name),
  actions: {
    edit: function() {
      this.set('isEditing', true);
    },
    saveChanges: function() {
      this.set('isEditing', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditing', false);
      this.get('model').rollback();
    },
    open: function () {
      var file = this.get('model');
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
        file.rollback();
      });
    }
  }
});
