/* global App */

App.ModalDialogComponent = Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$('.modal').modal('show');
    });
  },
  
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
