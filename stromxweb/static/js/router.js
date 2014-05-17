App.Router.map(function () {
  this.resource('files', { path: '/'}, function() {
    this.route('add');
    this.route('new');
  })
  this.resource('streams', function() {
    this.resource('stream', { path: '/:stream_id' })
  });
  this.resource('operators', function() {
    this.resource('operator', { path: '/:operator_id' })
  });
});


App.ApplicationRoute = Ember.Route.extend({
  actions: {
    showModal: function(modal, model) {
      var controller = this.controllerFor(modal);
      controller.set('model', model)
      return this.render(modal, {
        into: 'application',
        outlet: 'modal',
        controller: controller
      });
    },
    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
}); 

App.FilesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('file');
  }
}); 
