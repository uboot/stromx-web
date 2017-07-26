import Ember from "ember";

export default Ember.Component.extend({
  showDoNotAccept: Ember.computed.notEmpty('doNotAcceptText'),
  open: true,
  actions: {
    accept: function() {
      this.sendAction("accept");
      this.set('open', false);
    },
    doNotAccept: function() {
      this.sendAction("doNotAccept");
      this.set('open', false);
    },
    cancel: function() {
      this.sendAction("cancel");
      this.set('open', false);
    }
  }
});
