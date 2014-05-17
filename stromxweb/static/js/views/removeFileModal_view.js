// TODO: attribute to http://stackoverflow.com/a/19910677

App.RemoveFileModalView = Ember.View.extend({  
  didInsertElement: function() {
    Ember.run.next(this,function(){
      this.$('.modal').modal('show')
    });
  },
  
  actions: {
    cancel: function() {
      view = this
      this.$('.modal').modal('hide').one('hidden.bs.modal', function(ev) {
        view.controller.send('cancel')
      });
    },
    accept: function() {
      view = this
      this.$('.modal').modal('hide').one('hidden.bs.modal', function(ev) {
        view.controller.send('accept')
      });
    }
  }
});