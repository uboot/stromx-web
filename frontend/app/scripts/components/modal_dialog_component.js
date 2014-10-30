/* global App */

App.ModalDialogComponent = Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$('.modal').modal('show');
    });
  },
  
  actions: {
    cancel: function() {
      var component = this;
      this.$('.modal').modal('hide').one('hidden.bs.modal', function(ev) {
        component.sendAction("cancel");
      });
    },
    accept: function() {
      var component = this;
      this.$('.modal').modal('hide').one('hidden.bs.modal', function(ev) {
        component.sendAction("accept");
      });
    }
  }
}); 
