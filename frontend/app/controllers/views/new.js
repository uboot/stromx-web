import Ember from "ember";

export default Ember.Controller.extend({
  name: '',
  actions: {
    save: function () {
      var stream = this.get('model');
      var name = this.get('name');
      var view = this.store.createRecord('view', {
        name: name,
        stream: stream
      });
      view.save();

      this.transitionToRoute('stream');
    }
  }
});
