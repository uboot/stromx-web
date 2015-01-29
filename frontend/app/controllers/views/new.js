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

      var _this = this;
      view.save().then(function(view) {
        _this.transitionToRoute('view', view);
      });
    }
  }
});
