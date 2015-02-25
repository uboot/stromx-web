import Ember from "ember";
import { defaultThreadColor } from 'stromx-web/colors';

export default Ember.Controller.extend({
  actions: {
    cancel: function() {
      this.set('name', '');
      this.transitionToRoute('files.index');
    },
    save: function () {
      var name = this.get('name');
      var file = this.store.createRecord('file', {
        name: name,
        opened: true
      });
      var store = this.store;
      file.save().then(function(file) {
        var stream = file.get('stream');
        if (stream === null) {
          return;
        }
        
        var thread = store.createRecord('thread', {
          name: 'Thread',
          stream: stream,
          color: defaultThreadColor
        });
        
        var view = store.createRecord('view', {
          name: 'View',
          stream: stream
        });
        
        Ember.RSVP.all([thread.save(), view.save()]).then(function() {
          file.set('opened', false);
          file.set('saved', true);
          file.save();
        });
        
      });

      this.set('name', '');
      this.transitionToRoute('files');
    }
  }
});
