import Ember from "ember";

export default Ember.Controller.extend({
  name: '',
  actions: {
    save: function () {
      var stream = this.get('model');
      var name = this.get('name');
      var thread = this.store.createRecord('thread', {
        name: name,
        stream: stream
      });
      
      var _this = this;
      thread.save().then(function(thread) {
        _this.transitionToRoute('thread', thread);
      });
    }
  }
});
