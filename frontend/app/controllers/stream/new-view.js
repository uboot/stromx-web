import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    saveView: function () {
      var stream = this.get('model');
      var name = this.get('viewName');
      var view = this.store.createRecord('view', {
        name: name,
        stream: stream
      });
      view.save();

      this.transitionToRoute('stream');
    }
  }
});
