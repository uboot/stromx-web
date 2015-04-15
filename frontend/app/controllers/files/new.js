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
        name: name,
        opened: true
      });
      var store = this.store;
      file.save().then(function(file) {
        var stream = file.get('stream');
        if (stream === null) {
          return;
        }
        
        var view = store.createRecord('view', {
          name: 'View',
          stream: stream
        });
        
        view.save().then(function() {
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
