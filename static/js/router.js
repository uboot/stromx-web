App.Router.map(function () {
  this.resource('index', { path: '/' }, function() {
    this.resource('files', function() {
      this.route('add');
    });
    this.resource('streams', function() {
      this.resource('stream', { path: '/:stream_id' })
    });
  })
});

App.FilesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('file');
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('error');
  },
  activate  : function () {
    this.transitionTo('files');
  }
});
