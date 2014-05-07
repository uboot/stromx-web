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

App.FilesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('file');
  }
}); 
