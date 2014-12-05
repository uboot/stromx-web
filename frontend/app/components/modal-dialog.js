import Ember from "ember";

export default Ember.Component.extend({
  actions: {
    cancel: function() {
      this.$('.modal').modal('hide');
      this.sendAction("cancel");
    },
    accept: function() {
      this.$('.modal').modal('hide');
      this.sendAction("accept");
    }
  }
});
