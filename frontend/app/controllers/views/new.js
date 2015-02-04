import Ember from "ember";

export default Ember.Controller.extend({
  name: '',
  actions: {
    cancel: function() {
      this.set('name', '');
      this.transitionToRoute('stream.index', this.get('model'));
    },
    save: function () {
      var stream = this.get('model');
      var name = this.get('name');
      var view = this.store.createRecord('view', {
        name: name,
        stream: stream
      });

      this.set('name', '');
      var _this = this;
      view.save().then(function(view) {
        _this.transitionToRoute('view', view);
      });
    }
  }
});
