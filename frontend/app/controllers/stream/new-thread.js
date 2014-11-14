import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    saveView: function () {
      var stream = this.get('model');
      var name = this.get('viewName');
      var thread = this.store.createRecord('thread', {
        name: name,
        stream: stream
      });
      thread.save();

      this.transitionToRoute('stream');
    }
  }
});
