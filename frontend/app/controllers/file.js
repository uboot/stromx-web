import Ember from "ember";
import ENV from '../config/environment';

export default Ember.ObjectController.extend({
  closed: Ember.computed.not('opened'),
  url: function() {
    if (ENV.APP.API_HOST) {
      return ENV.APP.API_HOST + '/download/' + this.get('name');
    } else {
      return 'download/' + this.get('name');
    }
  }.property(name),
  actions: {
    remove: function () {
        var file = this.get('model');
        file.deleteRecord();
        file.save();
    },

    open: function () {
      this.set('opened', true);
      var controller = this;
      var file = this.get('model');
      file.save().then( function(file) {
        if (! file.get('opened')) {
          return;
        }

        var stream = file.get('stream');
        if (stream !== null) {
          controller.transitionToRoute('stream', stream);
        }
      });
    },

    close: function () {
      this.set('opened', false);
      var file = this.get('model');
      file.save();
    }
  }
});
