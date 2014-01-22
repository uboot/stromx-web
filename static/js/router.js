App.Router.map(function () {
  this.resource('files', { path: '/'}, function() {
    this.route('add');
  })
  this.resource('streams', function() {
    this.resource('stream', { path: '/:stream_id' })
  });
});

App.ApplicationRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('error');
  }
});

App.FilesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('file');
  }
});