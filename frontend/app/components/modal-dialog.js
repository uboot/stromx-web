import Ember from "ember";

export default Ember.Component.extend({
  didInsertElement: function() {
    // show the dialog
    this.$('.modal').modal('show');

    // send the according action after it has been hidden again
    var _this = this;
    this.$('.modal').one('hidden.bs.modal', function() {
      _this.sendAction("dismiss");
    });
  },
  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  },
  showDoNotAccept: Ember.computed.notEmpty('doNotAcceptText'),
  actions: {
    accept: function() {
      this.sendAction("accept");
    },
    doNotAccept: function() {
      this.sendAction("doNotAccept");
    },
    cancel: function() {
      this.sendAction("cancel");
    }
  }
});
