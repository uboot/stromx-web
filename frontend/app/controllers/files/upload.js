import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    cancel: function() {
      this.set('name', '');
      this.set('content', '');
      this.transitionToRoute('files.index');
    },
    upload: function () {
      var name = this.get('name');
      var strippedName = name.replace(/^.*[\\\/]/, '');
      var file = this.store.createRecord('file', {
        name: strippedName,
        content: this.get('content')
      });

      this.set('name', '');
      this.set('content', '');
      file.save();
      this.transitionToRoute('files');
    }
  }
});
