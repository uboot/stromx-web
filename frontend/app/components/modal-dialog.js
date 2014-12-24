import Ember from "ember";

export default Ember.Component.extend({
  didInsertElement: function() {
    // show the dialog
    this.$('.modal').modal('show');
    
    // send the according action after it has been hidden again
    var _this = this;
    this.$('.modal').one('hidden.bs.modal', function() {
      Ember.run(function() {
        // send the according action after it has been hidden
        _this.sendAction("dismiss");
      });
    });
  },
  actions: {
    accept: function() {
      this.sendAction("accept");
    },
    cancel: function() {
      this.sendAction("cancel");
    }
  }
});
