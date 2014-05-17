App.ModalDialogComponent = Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.next(this,function(){
      this.$('.modal').modal('show')
    });
  },
  
  actions: {
    cancel: function() {
      component = this
      this.$('.modal').modal('hide').one('hidden.bs.modal', function(ev) {
        component.sendAction("cancel");
      });
    },
    accept: function() {
      component = this
      this.$('.modal').modal('hide').one('hidden.bs.modal', function(ev) {
        component.sendAction("accept");
      });
    }
  }
}); 
